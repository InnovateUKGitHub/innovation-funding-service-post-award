import { expect, Page } from "@playwright/test";

export interface Clickable {
  click(): Promise<void>;
}

abstract class BaseComponent {
  protected readonly page: Page;

  constructor({ page }: { page: Page }) {
    this.page = page;
  }

  abstract get(): ReturnType<Page["locator"]>;
  isVisible() {
    return expect(this.get()).toBeVisible();
  }
}

abstract class BaseClickableComponent extends BaseComponent implements Clickable {
  click() {
    return this.get().click();
  }
}

export { BaseComponent, BaseClickableComponent };
