import { expect, Page } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { Fixture, Then } from "playwright-bdd/decorators";
import { currencyFormat } from "../../../../helpers/currency";

export
@Fixture("accClaimsDashboard")
class AccClaimsDashboard {
  private readonly page: Page;

  constructor({ page }: { page: Page }) {
    this.page = page;
  }

  @Then("the claims dashboard open periods are")
  async periodMatches(data: DataTable) {
    const table = this.page.getByTestId("current-claims-table");
    for (const x of Object.values(data.hashes())) {
      const row = table.getByRole("row").filter({ hasText: `Period ${x.Period}` });
      if (typeof x.Forecast === "string") {
        await expect(row.getByRole("cell").nth(1)).toContainText(currencyFormat.format(parseFloat(x.Forecast)));
      }
      if (typeof x.Actual === "string") {
        await expect(row.getByRole("cell").nth(2)).toContainText(currencyFormat.format(parseFloat(x.Actual)));
      }
      if (typeof x.Difference === "string") {
        await expect(row.getByRole("cell").nth(3)).toContainText(currencyFormat.format(parseFloat(x.Difference)));
      }
      if (typeof x.Status === "string") {
        await expect(row.getByRole("cell").nth(4)).toContainText(x.Status);
      }
    }
  }
}
