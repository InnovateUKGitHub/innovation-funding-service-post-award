import { Page } from "@playwright/test";
import { SfdcLightningPage } from "../../fixtures/sfdc/SfdcLightningPage";
import { BaseComponent } from "../BaseComponent";

class SfdcLightningListViewManagerComponent extends BaseComponent {
  private readonly title: string;
  private readonly occurances: number | string;

  constructor({ page, title, occurances }: { page: Page; title: string; occurances: number | string }) {
    super({ page });
    this.title = title;
    this.occurances = occurances;
  }

  get(): ReturnType<Page["locator"]> {
    return this.page
      .locator("lst-related-list-view-manager")
      .filter({ hasText: this.title })
      .filter({ hasText: `(${this.occurances})` });
  }

  static create({ page }: SfdcLightningPage, title: string, occurances: number | string) {
    return new SfdcLightningListViewManagerComponent({ page, title, occurances });
  }
}

export { SfdcLightningListViewManagerComponent };
