import { Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

class PageHeading extends BaseComponent {
  private readonly title: string;

  constructor({ page, title }: { page: Page; title: string }) {
    super({ page });
    this.title = title;
  }

  get() {
    return this.page.locator("h1").filter({ hasText: this.title });
  }

  static fromTitle(page: Page, title: string) {
    return new PageHeading({ page, title });
  }
}

export { PageHeading };
