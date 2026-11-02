import { test as base } from '@playwright/test';
import { LoginPage } from '../PageObjects/LoginPage';
import { InventoryPage } from '../PageObjects/InventoryPage';
import { CartPage } from '../PageObjects/CartPage';
import { CheckoutPage } from '../PageObjects/CheckoutPage';

type Pages = {
    loginPage: LoginPage,
    inventoryPage: InventoryPage,
    cartPage: CartPage,
    checkoutPage: CheckoutPage
};

export const test = base.extend<Pages>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    }
});

export { expect } from '@playwright/test';
