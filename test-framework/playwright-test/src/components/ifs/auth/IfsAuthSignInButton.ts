import { Page } from "@playwright/test";
import { BaseClickableComponent } from "../../BaseComponent";

export class IfsAuthSignInButton extends BaseClickableComponent {
  constructor({ page }: { page: Page }) {
    super({ page });
  }

  get(): ReturnType<Page["locator"]> {
    return this.page.locator(`#sign-in-cta`);
  }

  static create(page: Page) {
    return new IfsAuthSignInButton({ page });
  }
}
