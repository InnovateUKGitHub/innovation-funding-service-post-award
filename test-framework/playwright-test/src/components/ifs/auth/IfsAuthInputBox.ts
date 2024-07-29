import { Page } from "@playwright/test";
import { BaseComponent } from "../../BaseComponent";

export class IfsAuthInputBox extends BaseComponent {
  private readonly id: string;

  constructor({ page, id }: { page: Page; id: string }) {
    super({ page });
    this.id = id;
  }

  get(): ReturnType<Page["locator"]> {
    return this.page.locator(`#${this.id}`);
  }

  static username(page: Page) {
    return new IfsAuthInputBox({ page, id: "username" });
  }

  static password(page: Page) {
    return new IfsAuthInputBox({ page, id: "password" });
  }
}
