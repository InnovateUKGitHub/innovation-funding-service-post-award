import { Page } from "@playwright/test";
import { Fixture } from "playwright-bdd/decorators";

export
@Fixture("commands")
class Commands {
  private readonly page: Page;

  constructor({ page }: { page: Page }) {
    this.page = page;
  }

  getTableRow(category: string) {
    return this.page.locator("tr").filter({ hasText: category });
  }

  getLinkInRow(category: string, linkName: string) {
    return this.getTableRow(category).locator("a").filter({ hasText: linkName });
  }
}
