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
  async lookupCell(columnHeader: ColumnHeader, row: string | number) {
    if (typeof row === "string") {
      return await this.get().evaluate(table => {
        const trs = table.querySelectorAll("tr");
        let index: number = 0;
        trs.evaluateAll(rows =>
          rows.forEach((row, i) => {
            if (row.textContent === columnHeader) {
              index = i;
            }
          }),
        );
        return this.page.locator("table tr", { hasText: row }).locator(`td:nth(${index + 1})`);
      });
    } else if (typeof row === "number") {
      return await this.get().evaluate(table => {
        const trs = table.querySelectorAll("tr");
        let index: number = 0;
        trs.evaluateAll(rows =>
          rows.forEach((row, i) => {
            if (row.textContent === columnHeader) {
              index = i;
            }
          }),
        );

        const tableRow = this.page.locator(`table tr:nth(${row})`);

        return tableRow.locator(`td:nth(${index})`);
      });
    } else {
      throw new Error("row must be a string or a number");
    }
  }

  static fromCaption(page: Page, caption: string) {
    return new Table({ page, caption });
  }
}

export { Table };
