import { expect, Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

class DevTools extends BaseComponent {
  constructor({ page }: { page: Page }) {
    super({ page });
  }

  get() {
    return this.page.locator(".ifspa-developer-section");
  }

  getLoggedInUser() {
    return this.page
      .locator(".govuk-summary-list__row", { hasText: "Salesforce User" })
      .locator("dd.govuk-summary-list__value");
  }

  getReactLoadedIndicator() {
    return this.page.getByTestId("react-loaded-indicator").locator("dd.govuk-summary-list__value");
  }

  static async isLoaded(page: Page) {
    const devTools = new DevTools({ page });

    return expect(await devTools.getReactLoadedIndicator().innerText()).toBe("Loaded");
  }

  static async isLoggedInAs(page: Page, user: string) {
    const devTools = new DevTools({ page });

    return expect(await devTools.getLoggedInUser().innerText()).toBe(user);
  }
}

export { DevTools };
