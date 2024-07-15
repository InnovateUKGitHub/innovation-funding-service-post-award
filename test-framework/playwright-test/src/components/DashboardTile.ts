import { Page } from "@playwright/test";
import { BaseClickableComponent } from "./BaseComponent";

class DashboardTile extends BaseClickableComponent {
  private readonly title: string;

  constructor({ page, title }: { page: Page; title: string }) {
    super({ page });
    this.title = title;
  }

  get() {
    return this.page.locator(".govuk-link.card-link__link").filter({ hasText: this.title });
  }

  static fromTitle(page: Page, title: string) {
    return new DashboardTile({ page, title });
  }
}

export { DashboardTile };
