import { test } from "@playwright/test";
import path from "path";

// One-off utility for generating README screenshots against the live site.
// Not part of the e2e suite (lives outside e2e/, so it's excluded from the
// configured testDir and never runs in CI).

const OUT_DIR = path.join(__dirname, "..", "..", "docs", "screenshots");

test.use({ viewport: { width: 1440, height: 900 } });

test("capture homepage", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, "home.png") });
});

test("capture category page", async ({ page }) => {
  await page.goto("/category/Electronics");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, "category.png") });
});

test("capture product detail page", async ({ page }) => {
  await page.goto("/category/Electronics");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  await page.locator('a[href^="/products/"]').first().click();
  await page.getByRole("button", { name: "Add to Cart" }).waitFor({ state: "visible", timeout: 15_000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, "product-detail.png") });
});

test("capture cart page", async ({ page }) => {
  await page.goto("/category/Electronics");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  await page.locator('a[href^="/products/"]').first().click();
  await page.getByRole("button", { name: "Add to Cart" }).waitFor({ state: "visible", timeout: 15_000 });
  await page.getByRole("button", { name: "Add to Cart" }).click();
  await page.goto("/cart");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, "cart.png") });
});

test("capture login page", async ({ page }) => {
  await page.goto("/login");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, "login.png") });
});
