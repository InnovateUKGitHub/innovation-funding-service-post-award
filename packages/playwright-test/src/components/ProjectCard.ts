import { Page } from "@playwright/test";
import { BaseClickableComponent } from "./BaseComponent";

class ProjectCard extends BaseClickableComponent {
  private readonly title: string;

  constructor({ page, title }: { page: Page; title: string }) {
    super({ page });
    this.title = title;
  }

  get() {
    return this.page.locator(".acc-list-item").filter({ hasText: this.title });
  }

  click() {
    return this.get().locator("a").click();
  }

  static fromTitle(page: Page, title: string) {
    return new ProjectCard({ page, title });
  }
}

export { ProjectCard };
