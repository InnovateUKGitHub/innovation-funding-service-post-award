import { Page } from "@playwright/test";
import { BaseAccClickableComponent } from "./BaseAccComponent";

class DashboardTile extends BaseAccClickableComponent {
  private readonly title: string;

  constructor({ page, title }: { page: Page; title: string }) {
    super({ page });
    this.title = title;
  }

  selector() {
    return this.page.locator(".govuk-link.card-link__link").filter({ hasText: this.title });
  }

  static fromTitle(page: Page, title: string) {
    return new DashboardTile({ page, title });
  }
}

export { DashboardTile };
