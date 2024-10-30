import { Page } from "@playwright/test";
import { BaseClickableComponent } from "../BaseComponent";
import { SfdcLightningPage } from "../../fixtures/sfdc/SfdcLightningPage";

export class SfdcLightningSearchButton extends BaseClickableComponent {
  constructor({ page }: { page: Page }) {
    super({ page });
  }

  get(): ReturnType<Page["locator"]> {
    return this.page.locator(".search-button");
  }

  static create({ page }: SfdcLightningPage) {
    return new SfdcLightningSearchButton({ page: page });
  }
}
