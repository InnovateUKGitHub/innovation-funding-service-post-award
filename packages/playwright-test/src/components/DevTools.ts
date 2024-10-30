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

  async isLoaded() {
    return expect(await this.getReactLoadedIndicator().innerText()).toBe("Loaded");
  }

  async isLoggedInAs(user: string) {
    return expect(await this.getLoggedInUser().innerText()).toBe(user);
  }
}

export { DevTools };
