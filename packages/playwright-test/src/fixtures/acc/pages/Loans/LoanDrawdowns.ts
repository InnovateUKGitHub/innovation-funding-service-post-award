import { expect, Locator, Page } from "@playwright/test";
import { Fixture, Then, When } from "playwright-bdd/decorators";
import { Commands } from "../../../Commands";
import { PageHeading } from "../../../../components/PageHeading";
import { DataTable } from "playwright-bdd";

export
@Fixture("loanDrawdowns")
class LoanDrawdowns {
  protected readonly page: Page;
  protected readonly commands: Commands;
  private readonly drawdownsHeading: PageHeading;
  private readonly drawdownHeading: PageHeading;
  private readonly viewButton: Locator;
  private readonly viewButton1: Locator;
  private readonly drawdownsHeaders: Array<string>;
  private readonly nonFcDrawdownGuidance: string;
  private readonly changeDrawdownLink: Locator;
  private readonly singleDrawdownTableHeaders: Array<string>;
  private readonly filesUploadedHeader: Locator;
  private readonly period1DrawdownRow: Array<string>;

  constructor({ page, commands }: { page: Page; commands: Commands }) {
    this.page = page;
    this.commands = commands;
    this.drawdownsHeading = PageHeading.fromTitle(this.page, "Drawdowns");
    this.drawdownHeading = PageHeading.fromTitle(this.page, "Drawdown");
    this.viewButton = this.page.getByRole("button").filter({ hasText: "View" });
    this.viewButton1 = this.page.locator(`//table//tbody//tr[1]//td[5]`).filter({ has: this.viewButton });
    this.drawdownsHeaders = ["Drawdown", "Due date", "Drawdown amount", "Status"];
    this.nonFcDrawdownGuidance =
      "Your Finance Contact can request your drawdown here. If you need to change the amount of your drawdown, you will need to submit a";
    this.changeDrawdownLink = this.page.getByRole("link").filter({ hasText: "change drawdown" });
    this.singleDrawdownTableHeaders = [
      "Drawdown",
      "Due date",
      "Drawdown forecast",
      "Total loan",
      "Drawdown to date",
      "Drawdown amount",
      "Remaining loan",
    ];
    this.filesUploadedHeader = this.page.getByRole("heading").filter({ hasText: "Files uploaded" });
    this.period1DrawdownRow = [
      "1",
      this.getDrawdownDate(0),
      "£110,000.00",
      "£78,186,000.0",
      "£0.00",
      "£110,000.00",
      "£78,076,000.00",
    ];
  }

  @Then("the user will see the Drawdowns page")
  async drawdownPage(table: DataTable) {
    const data = table.hashes();
    await this.drawdownsHeading.isVisible();
    await this.assertDrawdownsTable(table);
  }

  @When("the user clicks the View button")
  async clickViewButton() {
    await this.viewButton.click();
    await this.drawdownHeading.isVisible();
  }

  @Then("the user will see the read-only drawdown")
  async viewOnlyDrawdown() {
    await this.drawdownHeading.isVisible();
    await this.commands.verifyTextOnPage(this.nonFcDrawdownGuidance);
    await expect(this.changeDrawdownLink).toBeVisible();
    await this.singleDrawdownTable();
    await expect(this.filesUploadedHeader).toBeVisible();
  }

  @When("this user clicks the change drawdown link")
  async clickChangeDrawdownLink() {
    await this.changeDrawdownLink.click();
  }

  @Then("the user will see the PCR Start a new request page")
  async startARequestPage() {
    await expect(this.page.getByRole("heading").filter({ hasText: "Start a new request" })).toBeVisible();
  }

  /**
   * METHODS
   */
  async assertDrawdownsTable(table: DataTable) {
    const data = table.hashes();
    let th = 1;
    for (const header of this.drawdownsHeaders) {
      await expect(this.page.locator(`//table//thead/tr[1]//th[${th}]`).filter({ hasText: header })).toBeVisible();
      th++;
    }
    await expect(this.viewButton1).toBeVisible();
    let i = 1;
    let dateCount = 0;
    for (const row of data) {
      await expect(
        this.page.locator(`//table//tbody//tr[${i}]//td[1]`).filter({ hasText: row["Drawdown"] }),
      ).toBeVisible();
      await expect(
        this.page.locator(`//table//tbody//tr[${i}]//td[2]`).filter({ hasText: this.getDrawdownDate(dateCount) }),
      ).toBeVisible();
      await expect(
        this.page.locator(`//table//tbody//tr[${i}]//td[3]`).filter({ hasText: row["Drawdown amount"] }),
      ).toBeVisible();
      await expect(this.page.locator(`//table//tbody//tr[${i}]//td[4]`).filter({ hasText: "Planned" })).toBeVisible();
      console.log(this.getDrawdownDate(dateCount));
      i++;
      dateCount = dateCount + 3;
    }
  }

  async singleDrawdownTable() {
    let th = 1;
    for (const header of this.singleDrawdownTableHeaders) {
      await expect(this.page.locator(`//table//thead/tr[1]//th[${th}]`).filter({ hasText: header })).toBeVisible();
      th++;
    }
    let i = 1;
    for (const cell of this.period1DrawdownRow) {
      await expect(this.page.locator(`//table/tbody/tr//td[${i}]`).filter({ hasText: cell })).toBeVisible();
      i++;
    }
  }

  getDrawdownDate(increment: number) {
    let date = new Date();
    let fullDate = new Date(date.getFullYear(), date.getMonth() + increment, 1, 12);
    return `01/${fullDate.toLocaleDateString("en-GB", { month: "2-digit", year: "numeric" })}`;
  }
}
