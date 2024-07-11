import { Page } from "@playwright/test";
import { BaseAccComponent } from "./BaseAccComponent";

class PageHeading extends BaseAccComponent {
  private readonly title: string;

  constructor({ page, title }: { page: Page; title: string }) {
    super({ page });
    this.title = title;
  }

  selector() {
    return this.page.locator("h1").filter({ hasText: this.title });
  }

  static fromTitle(page: Page, title: string) {
    return new PageHeading({ page, title });
  }
}

export { PageHeading };
