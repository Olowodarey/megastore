import { test, expect } from "@playwright/test";

// Read-path smoke test: browse -> product detail -> add to cart -> checkout gate.
// Deliberately stops at the checkout gate rather than actually placing an
// order, so this can run repeatedly (including in CI) without creating fake
// accounts or orders against the real database.

test("browse a category, view a product, add it to cart, and hit the checkout gate", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/MegaMart/i);

  await page.goto("/category/Electronics");
  await expect(page.getByRole("heading", { name: "Electronics" })).toBeVisible({ timeout: 15_000 });

  const firstProductLink = page.locator('a[href^="/products/"]').first();
  await expect(firstProductLink).toBeVisible();
  await firstProductLink.click();

  await expect(page).toHaveURL(/\/products\/\d+/);
  const productTitle = await page.locator("h1").innerText();
  await expect(page.getByRole("button", { name: "Add to Cart" })).toBeVisible();

  await page.getByRole("button", { name: "Add to Cart" }).click();
  await expect(page.getByLabel(/Cart, 1 items?/i)).toBeVisible();

  await page.goto("/cart");
  await expect(page.getByText(productTitle.trim(), { exact: false }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign In to Checkout" })).toBeVisible();
});
