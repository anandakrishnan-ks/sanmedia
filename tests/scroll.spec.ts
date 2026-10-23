import { expect, test, type Page } from "@playwright/test";

/** Sample rendered frames, so easing is checked without depending on a fixed timer. */
function scrollFrames(page: Page, frameCount = 90) {
  return page.evaluate(
    (count) =>
      new Promise<number[]>((resolve) => {
        const positions: number[] = [];
        const sample = () => {
          positions.push(window.scrollY);
          if (positions.length < count) requestAnimationFrame(sample);
          else resolve(positions);
        };
        requestAnimationFrame(sample);
      }),
    frameCount,
  );
}

test("desktop wheel scrolling eases gradually and keeps keyboard navigation available", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/services");
  await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  await page.mouse.move(900, 450);
  const trace = scrollFrames(page);
  await page.mouse.wheel(0, 1000);
  const positions = await trace;
  const moving = positions.filter((position) => position > 0);
  const settled = positions.at(-1)!;

  expect(settled).toBeGreaterThan(990);
  expect(settled).toBeLessThan(1010);
  expect(new Set(moving).size).toBeGreaterThan(10);
  expect(moving[0]).toBeLessThan(settled * 0.6);
  expect(Math.abs(settled - positions.at(-5)!)).toBeLessThan(3);

  await page.keyboard.press("End");
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollHeight - innerHeight - scrollY))
    .toBeLessThan(3);
  const bottom = await page.evaluate(() => scrollY);
  await page.keyboard.press("PageUp");
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(bottom - 200);
});

test("changing reduced motion preference cancels easing and restores native wheel distance", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/services");
  await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  await page.mouse.move(900, 450);
  await page.mouse.wheel(0, 1000);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(20);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
  const stopped = await scrollFrames(page, 20);
  expect(Math.max(...stopped) - Math.min(...stopped)).toBeLessThan(3);

  const start = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(start + 490);
  expect(await page.evaluate(() => scrollY)).toBeLessThan(start + 510);
});

test("project dialogs stop page momentum and do not resume it after dismissal", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/work");
  await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  const opener = page.getByRole("button", { name: "Open THE INHERITANCE", exact: true });
  await opener.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 500);
  await opener.click({ force: true });
  const dialog = page.getByRole("dialog", { name: "THE INHERITANCE", exact: true });
  await expect(dialog).toBeVisible();
  const lockedAt = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 1200);
  const locked = await scrollFrames(page, 45);
  expect(locked.every((position) => Math.abs(position - lockedAt) < 3)).toBe(true);

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  const dismissed = await scrollFrames(page, 45);
  expect(Math.max(...dismissed) - Math.min(...dismissed)).toBeLessThan(3);
});

test("client navigation cancels the previous page's wheel momentum", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/services");
  await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  await page.mouse.move(900, 450);
  await page.mouse.wheel(0, 4000);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(30);
  await page
    .getByRole("navigation", { name: "Primary", exact: true })
    .getByRole("link", { name: "Work", exact: true })
    .click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".services-cinematic")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(3);
  const positions = await scrollFrames(page, 45);
  expect(Math.max(...positions)).toBeLessThan(3);
});

test("the explore anchor reaches its section below the fixed header", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  await page.getByRole("link", { name: "Scroll to explore" }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect
    .poll(() =>
      page.locator("#work").evaluate((section) => {
        const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
        return Math.abs(section.getBoundingClientRect().top - offset);
      }),
    )
    .toBeLessThan(3);
});

test("each process chapter has a fully readable interval during the cinematic scroll", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/process");
  const section = page.locator(".process-cinematic");
  await expect(section).toHaveCount(1);
  const chapters = section.locator(".process-stage");
  const count = await chapters.count();
  for (let index = 0; index < count; index++) {
    await section.evaluate(
      (element, progress) => {
        const start = element.getBoundingClientRect().top + scrollY;
        const distance = element.clientHeight - innerHeight;
        window.scrollTo({ top: start + distance * progress, behavior: "instant" });
      },
      (index + 0.5) / count,
    );
    await expect(chapters.nth(index).locator(".process-copy")).toHaveCSS("opacity", "1");
    await expect(chapters.nth(index).locator(".process-image")).toHaveCSS("opacity", "1");
    await expect(chapters.nth(index).locator("h2")).toBeInViewport();
    for (let other = 0; other < count; other++) {
      if (other !== index) {
        await expect(chapters.nth(other).locator(".process-copy")).toHaveCSS("opacity", "0");
        await expect(chapters.nth(other).locator(".process-image")).toHaveCSS("opacity", "0");
      }
    }
  }
});

test("touch layouts retain native scrolling", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/services");
  await expect(page.locator(".service-row")).toHaveCount(6);
  await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
  await page.locator(".service-row").last().tap();
  await expect(page.locator(".service-row").last()).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
});
