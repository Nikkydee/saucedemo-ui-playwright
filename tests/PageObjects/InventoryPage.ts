import { Page, Locator } from '@playwright/test';
import { PageBase } from './PageBase';
import { parsePriceToCents } from '../../Utils/helperMethods';

export class InventoryPage extends PageBase {

    readonly inventoryItems: Locator;

    constructor(page: Page) {
        super(page);
        this.inventoryItems = page.getByTestId('inventory-item');
    }

    /** The product card whose name matches exactly. */
    productCard(productName: string): Locator {
        return this.inventoryItems.filter({
            has: this.page.getByTestId('inventory-item-name').getByText(productName, { exact: true })
        });
    }

    async addProductToCart(productName: string): Promise<void> {
        await this.productCard(productName).getByRole('button', { name: 'Add to cart' }).click();
    }

    /** Reads the price shown on the product card, in cents. */
    async getProductPriceInCents(productName: string): Promise<number> {
        const priceText = await this.productCard(productName).getByTestId('inventory-item-price').innerText();
        return parsePriceToCents(priceText);
    }
}
