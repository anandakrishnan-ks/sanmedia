import { expect, test } from "@playwright/test";

const routes = ["/", "/work", "/services", "/process", "/about", "/contact"];

test("every route renders its own content, metadata, and local images without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  const externalRequests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (!new URL(request.url()).hostname.match(/^(127\.0\.0\.1|localhost)$/))
      externalRequests.push(request.url());
  });
  const titles = new Set<string>();
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    titles.add(await page.title());
    expect(await page.locator('meta[name="description"]').getAttribute("content")).toBeTruthy();
    const broken = await page.evaluate(async () => {
      const images = [...document.images];
      images.forEach((image) => {
        image.loading = "eager";
      });
      await Promise.allSettled(images.map((image) => image.decode()));
      return images
        .filter((image) => !image.complete || !image.naturalWidth)
        .map((image) => image.src);
    });
    expect(broken, `Images on ${route}`).toEqual([]);
    expect(
      await page.locator("html").evaluate((element) => element.scrollWidth <= element.clientWidth),
    ).toBe(true);
  }
  expect(titles.size).toBe(6);
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test("desktop menu uses client routing and marks the current page", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.evaluate(() => {
    Object.assign(window, { navigationSentinel: true });
  });
  const primary = page.getByRole("navigation", { name: "Primary", exact: true });
  for (const label of ["Work", "Services", "Process", "About", "Contact"]) {
    await primary.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${label.toLowerCase()}$`));
    await expect(primary.getByRole("link", { name: label, exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(await page.evaluate(() => "navigationSentinel" in window)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("mobile menu traps focus, closes on Escape, restores focus, and navigates", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Menu", exact: true });
  await toggle.click();
  const dialog = page.getByRole("dialog", { name: "Navigation", exact: true });
  await expect(dialog).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  for (let index = 0; index < 12; index++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(toggle).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  await toggle.click();
  await dialog.getByRole("link", { name: "02 Services" }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Menu", exact: true })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("film details support keyboard dismissal and restore the opener", async ({ page }) => {
  await page.goto("/work");
  const opener = page.getByRole("button", { name: "Open THE INHERITANCE", exact: true });
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "THE INHERITANCE", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("A generational drama");
  await expect(
    dialog.getByRole("link", { name: "Full film available on request" }),
  ).toHaveAttribute("href", /^mailto:/);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("all services can be selected with touch or keyboard", async ({ page }) => {
  await page.goto("/services");
  const services = page.locator(".service-row");
  await expect(services).toHaveCount(6);
  await services.last().click();
  await expect(services.last()).toHaveAttribute("aria-pressed", "true");
  await services.first().focus();
  await expect(services.first()).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Tab");
  await expect(services.nth(1)).toHaveAttribute("aria-pressed", "true");
});

test("reduced motion shows every process stage without scroll trapping", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/process");
  await expect(page.locator(".process-cinematic")).toHaveCount(0);
  for (const title of ["THE IDEA", "THE FRAME", "THE PRODUCTION", "THE FILM"])
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  expect(
    await page.locator("html").evaluate((element) => getComputedStyle(element).scrollBehavior),
  ).toBe("auto");
});

test("small screens have no horizontal overflow on any page or in the menu", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "mobile");
  await page.setViewportSize({ width: 320, height: 740 });
  for (const route of routes) {
    await page.goto(route);
    expect(
      await page.locator("html").evaluate((element) => element.scrollWidth <= element.clientWidth),
      route,
    ).toBe(true);
  }
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Navigation", exact: true });
  expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await expect(dialog.getByRole("link", { name: "05 Contact" })).toBeInViewport();
});

test("content and routes remain available without JavaScript", async ({
  browser,
  baseURL,
}, info) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: info.project.use.viewport,
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/process`);
  for (const title of ["THE IDEA", "THE FRAME", "THE PRODUCTION", "THE FILM"])
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  await page
    .getByRole("navigation", {
      name: info.project.name === "mobile" ? "Menu" : "Primary",
      exact: true,
    })
    .getByRole("link", { name: "Contact", exact: true })
    .click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(
    page.getByRole("link", { name: "hello@sanmedia.in", exact: true }).first(),
  ).toHaveAttribute("href", "mailto:hello@sanmedia.in");
  await context.close();
});

test("missing routes return a real 404 with a recovery link", async ({ page }) => {
  const response = await page.goto("/missing-scene");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /FINAL SCENE/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to the film" })).toHaveAttribute("href", "/");
});

test("sections become readable when scrolled into view and after route changes", async ({
  page,
}) => {
  await page.goto("/services");
  const tier = page.getByRole("link", { name: /01 ESSENTIAL/ });
  await tier.scrollIntoViewIfNeeded();
  await expect(tier).toHaveCSS("opacity", "1");
  await page.goto("/about");
  const lastFrame = page.locator(".bts-image").last();
  await lastFrame.scrollIntoViewIfNeeded();
  await expect(lastFrame).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator('[data-reveal-state="pending"]')).toHaveCount(0);
});

test("desktop process reaches the final chapter and responds to a motion preference change", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/process");
  await expect(page.locator(".process-cinematic")).toHaveCount(1);
  await page.locator(".process-section").evaluate((section) => {
    const end = section.getBoundingClientRect().top + scrollY + section.clientHeight - innerHeight;
    window.scrollTo({ top: end, behavior: "instant" });
  });
  await expect(page.locator(".process-copy").last()).toHaveCSS("opacity", "1");
  await expect(page.locator(".process-image").last()).toHaveCSS("opacity", "1");
  await expect(page.locator(".process-copy").first()).toHaveCSS("opacity", "0");
  await expect(page.locator(".process-image").first()).toHaveCSS("opacity", "0");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".process-cinematic")).toHaveCount(0);
  await expect(page.locator(".process-copy").first()).toHaveCSS("opacity", "1");
  await expect(page.locator(".process-image").first()).toHaveCSS("opacity", "1");
});
