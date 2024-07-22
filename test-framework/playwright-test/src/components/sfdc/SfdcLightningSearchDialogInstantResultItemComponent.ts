import { Page } from "@playwright/test";
import { BaseClickableComponent } from "../BaseComponent";
import { SfdcLightningPage } from "../../fixtures/sfdc/SfdcLightningPage";

export class SfdcLightningSearchDialogInstantResultItemComponent extends BaseClickableComponent {
  constructor({ page }: { page: Page }) {
    super({ page });
  }

  get(): ReturnType<Page["locator"]> {
    return this.page.locator("search_dialog-instant-result-item");
  }

  static create({ page }: SfdcLightningPage) {
    return new SfdcLightningSearchDialogInstantResultItemComponent({ page: page });
  }
}
