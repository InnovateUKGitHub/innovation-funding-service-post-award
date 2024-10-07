import { Page } from "@playwright/test";

class Table<ColumnHeader extends string> {
  private readonly page: Page;
  private readonly caption: string;

  constructor({ page, caption }: { page: Page; caption: string }) {
    this.page = page;
    this.caption = caption;
  }

  get() {
    return this.page.locator("table", { has: this.page.locator("caption", { hasText: this.caption }) });
  }

  /**
   * Gets table cell from the column header and a row containing the string value.
   * @example
   * lookupCell("Forecast for period", "Labour"); // 123.45
   */
  lookupCell(columnHeader: ColumnHeader, row: string) {
    return this.get().evaluate(table => {
      const rows = table.querySelectorAll("tr");
      let index: number = 0;
      rows.evaluateAll(rows =>
        rows.forEach((element, i) => {
          if (element.textContent === columnHeader) {
            index = i;
          }
        }),
      );
      return this.page.locator("table tr", { hasText: row }).locator(`td:nth(${index + 1})`);
    });
  }

  static fromCaption(page: Page, caption: string) {
    return new Table({ page, caption });
  }
}

export { Table };
