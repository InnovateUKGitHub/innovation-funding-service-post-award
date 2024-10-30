import { Page } from "@playwright/test";
import { SfdcLightningPage } from "../../fixtures/sfdc/SfdcLightningPage";
import { BaseClickableComponent } from "../BaseComponent";

export class SfdcLightningTabBarItemComponent extends BaseClickableComponent {
  private readonly title: string;

  constructor({ page, title }: { page: Page; title: string }) {
    super({ page });
    this.title = title;
  }

  get(): ReturnType<Page["locator"]> {
    return this.page.locator(".slds-tabs_default__item").filter({ hasText: this.title });
  }

  static create({ page }: SfdcLightningPage, title: string) {
    return new SfdcLightningTabBarItemComponent({ page, title });
  }
}
