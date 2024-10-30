import { Page } from "@playwright/test";
import { BaseClickableComponent } from "./BaseComponent";

class Button extends BaseClickableComponent {
  constructor({ page }: { page: Page }) {
    super({ page });
  }
  get() {
    return this.page.getByRole("button");
  }
  getByTitle(title: string) {
    return this.get().filter({ hasText: title });
  }
  static fromTitle(page: Page, title: string) {
    return new Button({ page }).getByTitle(title);
  }
}

export { Button };
