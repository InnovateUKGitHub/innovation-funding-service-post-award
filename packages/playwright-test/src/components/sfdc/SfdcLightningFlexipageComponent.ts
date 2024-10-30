import { Page } from "@playwright/test";
import { BaseComponent } from "../BaseComponent";

export class SfdcLightningFlexipageComponent extends BaseComponent {
  private readonly title: string;

  constructor({ page, title }: { page: Page; title: string }) {
    super({ page });
    this.title = title;
  }

  get(): ReturnType<Page["locator"]> {
    return this.page
      .locator(".flexipageComponent")
      .filter({ has: this.page.locator("header").filter({ hasText: this.title }) });
  }

  static fromHeader(page: Page, title: string) {
    return new SfdcLightningFlexipageComponent({ page, title });
  }
}
