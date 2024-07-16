import { Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

class ValidationMessage extends BaseComponent {
  private readonly message: string;

  constructor({ page, message }: { page: Page; message: string }) {
    super({ page });
    this.message = message;
  }
  get() {
    return this.page.locator(`data-qa=["validation-summary"]`).filter({ hasText: this.message });
  }
  static getByMessage(page: Page, message: string) {
    return new ValidationMessage({ page, message });
  }
}

export { ValidationMessage };
