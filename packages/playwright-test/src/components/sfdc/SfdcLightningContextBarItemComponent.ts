import { Page } from "@playwright/test";
import { BaseClickableComponent } from "../BaseComponent";

export class SfdcLightningContextBarItemComponent extends BaseClickableComponent {
  private readonly title: string;

  constructor({ page, title }: { page: Page; title: string }) {
    super({ page });
    this.title = title;
  }

  get(): ReturnType<Page["locator"]> {
    return this.page.locator("one-app-nav-bar").locator("one-app-nav-bar-item-root").filter({ hasText: this.title });
  }

  static fromHeader(page: Page, title: string) {
    return new SfdcLightningContextBarItemComponent({ page, title });
  }
}
