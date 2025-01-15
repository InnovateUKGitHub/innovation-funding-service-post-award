import { expect, Page } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { Fixture, Then } from "playwright-bdd/decorators";
import { toCurrency } from "../../../helpers/currency";
import { toPercentage } from "../../../helpers/percentage";

export
@Fixture("accFinanceSummary")
class AccFinanceSummary {
  private readonly page: Page;

  constructor({ page }: { page: Page }) {
    this.page = page;
  }

  @Then("the partner finance details matches")
  async periodMatches(data: DataTable) {
    const table = this.page.getByTestId("PartnerFinanceDetails");
    for (const x of Object.values(data.hashes())) {
      const row = table.getByRole("row").filter({ hasText: x.Participant });
      const cell = row.getByRole("cell");
      await expect(cell.nth(1)).toContainText(toCurrency(x.GOLCosts));
      await expect(cell.nth(2)).toContainText(toPercentage(x.FundingLevel));
      await expect(cell.nth(3)).toContainText(toCurrency(x.ApprovedGrant));
      await expect(cell.nth(4)).toContainText(toCurrency(x.RemainingGrant));
      await expect(cell.nth(5)).toContainText(toCurrency(x.AdvanceGrant));
      await expect(cell.nth(6)).toContainText(toPercentage(x.CapLevel));
      await expect(cell.nth(7)).toContainText(toCurrency(x.CapPot));
    }
  }
}
