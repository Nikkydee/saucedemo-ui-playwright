import { Page, Locator } from '@playwright/test';
import { PageBase } from './PageBase';
import { parsePriceToCents } from '../../Utils/helperMethods';

/**
 * Covers the three checkout steps: your information, overview and complete.
 */
export class CheckoutPage extends PageBase {

    // Step one: your information
    readonly firstNameField: Locator;
    readonly lastNameField: Locator;
    readonly postalCodeField: Locator;
    readonly continueBtn: Locator;

    // Step two: overview
    readonly itemTotalLabel: Locator;
    readonly finishBtn: Locator;

    // Complete
    readonly completeHeader: Locator;

    constructor(page: Page) {
        super(page);
        this.firstNameField = page.getByTestId('firstName');
        this.lastNameField = page.getByTestId('lastName');
        this.postalCodeField = page.getByTestId('postalCode');
        this.continueBtn = page.getByTestId('continue');
        this.itemTotalLabel = page.getByTestId('subtotal-label');
        this.finishBtn = page.getByTestId('finish');
        this.completeHeader = page.getByTestId('complete-header');
    }

    async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.firstNameField.fill(firstName);
        await this.lastNameField.fill(lastName);
        await this.postalCodeField.fill(postalCode);
        await this.continueBtn.click();
    }

    /** Reads "Item total: $X.XX" from the overview step, in cents. */
    async getItemTotalInCents(): Promise<number> {
        return parsePriceToCents(await this.itemTotalLabel.innerText());
    }

    async clickFinish(): Promise<void> {
        await this.finishBtn.click();
    }
}
