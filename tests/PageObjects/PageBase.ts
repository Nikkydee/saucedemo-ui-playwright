import { Locator, Page } from "@playwright/test";

export class PageBase {
    readonly page: Page;
    readonly pageTitle: Locator;
    readonly cartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        // Header elements shared by every page after login
        this.pageTitle = page.getByTestId('title');
        this.cartLink = page.getByTestId('shopping-cart-link');
    }

    async openCart(): Promise<void> {
        await this.cartLink.click();
    }
}
