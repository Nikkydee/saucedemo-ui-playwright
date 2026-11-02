import { test, expect } from '../../fixtures/pageFixtures';
import { getEnvVar } from '../../../Utils/helperMethods';

test.describe('Checkout tests', { tag: '@sanity' }, () => {
    const username = getEnvVar('SAUCE_USERNAME');
    const password = getEnvVar('SAUCE_PASSWORD');
    const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

    test.beforeEach(async ({ loginPage, inventoryPage }) => {
        await loginPage.goto();
        await loginPage.login(username, password);
        await expect(inventoryPage.pageTitle).toHaveText('Products');
    });

    test('Validate that Item total equals the sum of the product prices', async ({ page, inventoryPage, cartPage, checkoutPage }) => {
        let expectedTotalInCents = 0;
        for (const product of products) {
            expectedTotalInCents += await inventoryPage.getProductPriceInCents(product);
            await inventoryPage.addProductToCart(product);
        }

        await inventoryPage.openCart();
        await expect(cartPage.cartItemNames).toHaveText(products);
        await cartPage.clickCheckout();

        await checkoutPage.fillInformation('Adenike', 'Olapetan', '100001');
        await expect(page).toHaveURL(/checkout-step-two/);
        expect(await checkoutPage.getItemTotalInCents()).toBe(expectedTotalInCents);

        await checkoutPage.clickFinish();
        await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    });
});
