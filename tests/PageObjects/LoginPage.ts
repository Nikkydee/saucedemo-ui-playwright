import { Page, Locator } from '@playwright/test';
import { PageBase } from './PageBase';

export class LoginPage extends PageBase {

    // Locators
    readonly usernameField: Locator;
    readonly passwordField: Locator;
    readonly loginBtn: Locator;
    readonly errorMsg: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameField = page.getByTestId('username');
        this.passwordField = page.getByTestId('password');
        this.loginBtn = page.getByTestId('login-button');
        this.errorMsg = page.getByTestId('error');
    }

    async goto(): Promise<void> {
        await this.page.goto('/');
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameField.fill(username);
        await this.passwordField.fill(password);
        await this.loginBtn.click();
    }
}
