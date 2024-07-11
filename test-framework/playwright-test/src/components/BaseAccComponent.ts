import { Page } from "@playwright/test";

abstract class BaseAccComponent {
  protected readonly page: Page;

  constructor({ page }: { page: Page }) {
    this.page = page;
  }

  abstract selector(): ReturnType<Page["locator"]>;
}

abstract class BaseAccClickableComponent extends BaseAccComponent {
  click() {
    return this.selector().click();
  }
}

export { BaseAccComponent, BaseAccClickableComponent };
