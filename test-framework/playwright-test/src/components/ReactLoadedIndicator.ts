import { Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

class ReactLoadedIndicator extends BaseComponent {
  constructor({ page }: { page: Page }) {
    super({ page });
  }

  get() {
    return this.page.getByTestId("react-loaded-indicator").locator("dd.govuk-summary-list__value");
  }

  static async isLoaded(page: Page) {
    const indicator = new ReactLoadedIndicator({ page });

    return (await indicator.get().innerText()) === "Loaded";
  }
}

export { ReactLoadedIndicator };
