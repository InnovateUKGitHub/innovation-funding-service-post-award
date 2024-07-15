import { Page } from "@playwright/test";

interface Column {
  name: string;
}

class Table<Columns extends Record<string, Column>> {
  private readonly page: Page;
  private readonly columns: Columns;

  constructor({ page, columns }: { page: Page; columns: Columns }) {
    this.page = page;
    this.columns = columns;
  }

  async lookup<Column extends keyof Columns>(lookupColumn: Column, lookupValue: string) {}
}

export { Table };
