import { expect, test, type Locator } from "@playwright/test";

async function scrollThrough(section: Locator, progress: number) {
  await section.evaluate((element, fraction) => {
    const start = element.getBoundingClientRect().top + scrollY;
    const distance = element.clientHeight - innerHeight;
    window.scrollTo({ top: start + distance * fraction, behavior: "instant" });
  }, progress);
}

function imageScale(image: Locator) {
  return image.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a);
}

test("the opening shot expands and zooms out as the title gives way to its caption", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  const hero = page.locator(".hero-section");
  await expect(hero).toHaveClass(/\bhero-cinematic\b/);
  const film = hero.locator(".hero-film");
  const image = film.locator("img");
  const initialScale = await imageScale(image);
  const initialCrop = await film.evaluate((element) =>
    parseFloat(getComputedStyle(element).clipPath.slice(6)),
  );
  expect(initialCrop).toBeGreaterThan(0);

  await scrollThrough(hero, 0.3);
  await expect.poll(() => imageScale(image)).toBeLessThan(initialScale - 0.02);
  await expect
    .poll(() => film.evaluate((element) => parseFloat(getComputedStyle(element).clipPath.slice(6))))
    .toBeLessThan(initialCrop);

  await scrollThrough(hero, 0.95);
  await expect(film).toHaveCSS("opacity", "1");
  await expect(hero.locator(".hero-intro")).toHaveCSS("opacity", "0");
  await expect(hero.locator(".hero-caption")).toHaveCSS("opacity", "1");
  await expect(hero.locator(".hero-caption")).toBeInViewport();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".hero-cinematic")).toHaveCount(0);
  await expect(page.locator(".hero-intro")).toHaveCSS("opacity", "1");
  await expect(image).toHaveCSS("transform", "none");
  expect(
    await page.locator(".hero-section").evaluate((element) => element.clientHeight / innerHeight),
  ).toBeLessThan(1.1);
});

test("scrolling through services changes the active format and restores a regular list for reduced motion", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/services");
  const section = page.locator(".services-cinematic");
  await expect(section).toHaveCount(1);
  const services = section.locator(".service-row");
  await scrollThrough(section, 0.02);
  await expect(services.first()).toHaveAttribute("aria-pressed", "true");
  await expect(section.locator(".service-image").first()).toHaveAttribute("data-active", "true");

  await scrollThrough(section, 1);
  await expect(services.last()).toHaveAttribute("aria-pressed", "true");
  await expect(services.last()).toHaveCSS("opacity", "1");
  await expect(services.last()).toBeInViewport();
  await expect(section.locator(".service-image").last()).toHaveAttribute("data-active", "true");
  await expect(section.locator(".service-image").last()).toHaveCSS("opacity", "1");
  await expect(services.first()).toHaveAttribute("aria-pressed", "false");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".services-cinematic")).toHaveCount(0);
  const firstService = page.locator(".service-row").first();
  await firstService.click();
  await expect(firstService).toHaveAttribute("aria-pressed", "true");
  expect(
    await page
      .locator(".services-section")
      .evaluate((element) => element.clientHeight / innerHeight),
  ).toBeLessThan(2);
});

test("film images gradually zoom out while scrolling and stop animating for reduced motion", async ({
  page,
}) => {
  await page.goto("/work");
  const card = page.locator(".work-card").nth(2);
  const image = card.locator(".work-image-motion");
  await card.evaluate((element) => {
    window.scrollTo({
      top: element.getBoundingClientRect().top + scrollY - innerHeight * 0.75,
      behavior: "instant",
    });
  });
  await expect(card).toHaveCSS("opacity", "1");
  await expect.poll(() => imageScale(image)).toBeGreaterThan(1.07);
  const enteringScale = await imageScale(image);

  await card.evaluate((element) => {
    window.scrollTo({
      top: element.getBoundingClientRect().top + scrollY + element.clientHeight * 0.25,
      behavior: "instant",
    });
  });
  await expect.poll(() => imageScale(image)).toBeLessThan(enteringScale - 0.03);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(image).toHaveCSS("transform", "none");
  await expect(card).toHaveCSS("opacity", "1");
});

test("the faded hero link cannot receive focus, and a focused link stays readable during its transition", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  const hero = page.locator(".hero-section");
  const intro = hero.locator(".hero-intro");
  const link = hero.locator(".hero-link");
  await expect(hero).toHaveClass(/\bhero-cinematic\b/);

  await scrollThrough(hero, 0.95);
  await expect(intro).toHaveCSS("visibility", "hidden");
  await link.evaluate((element) => (element as HTMLElement).focus());
  await expect(link).not.toBeFocused();

  await scrollThrough(hero, 0);
  await expect(intro).toHaveCSS("opacity", "1");
  await link.focus();
  await expect(link).toBeFocused();
  await scrollThrough(hero, 0.95);
  await expect(hero.locator(".hero-caption")).toHaveCSS("opacity", "1");
  await expect(link).toBeFocused();
  await expect(link).toBeInViewport();
  await expect(intro).toHaveCSS("visibility", "visible");
  await expect(intro).toHaveCSS("opacity", "1");
  await expect(intro).toHaveCSS("filter", "none");
  await expect(intro).toHaveCSS("transform", "none");

  await link.evaluate((element) => (element as HTMLElement).blur());
  await expect(intro).toHaveCSS("visibility", "hidden");
});

test("short desktop windows keep hero controls and every process chapter in normal document flow", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop");
  await page.setViewportSize({ width: 1200, height: 550 });
  await page.goto("/");
  await expect(page.locator(".hero-cinematic")).toHaveCount(0);
  await expect(page.locator(".hero-sticky")).not.toHaveCSS("position", "sticky");
  for (const name of ["Explore our work", "Scroll to explore"]) {
    const link = page.getByRole("link", { name, exact: true });
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeVisible();
    await expect(link).toBeInViewport();
  }

  await page.goto("/process");
  await expect(page.locator(".process-cinematic")).toHaveCount(0);
  await expect(page.locator(".process-sticky")).not.toHaveCSS("position", "sticky");
  for (const title of ["THE IDEA", "THE FRAME", "THE PRODUCTION", "THE FILM"]) {
    const heading = page.getByRole("heading", { name: title, exact: true });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();
    await expect(heading).toBeInViewport();
  }
});
