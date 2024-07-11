import { Page } from "@playwright/test";
import { BaseAccClickableComponent, BaseAccComponent } from "./BaseAccComponent";

class DashboardCard extends BaseAccComponent {
  private readonly title: string;

  constructor({ page, title }: { page: Page; title: string }) {
    super({ page });
    this.title = title;
  }

  selector() {
    return this.page.locator(".acc-list-item").filter({ hasText: this.title });
  }

  click() {
    return this.selector().locator("a").click();
  }

  static fromTitle(page: Page, title: string) {
    return new DashboardCard({ page, title });
  }
}

export { DashboardCard };
