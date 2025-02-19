import { expect, Locator, Page } from "@playwright/test";
import { Fixture, Then, When } from "playwright-bdd/decorators";
import { Commands } from "../../../Commands";
import { PageHeading } from "../../../../components/PageHeading";
import { ProjectChangeRequests } from "./ProjectChangeRequests";
import { LoanDrawdowns } from "../Loans/LoanDrawdowns";
import { getLorem } from "../../../../components/lorem";

export
@Fixture("loanDrawdownChange")
class LoanDrawdownChange {
  protected readonly page: Page;
  protected readonly commands: Commands;
  protected readonly pcr: ProjectChangeRequests;
  protected readonly drawdowns: LoanDrawdowns;

  private readonly pcrTitle: PageHeading;
  private readonly createButton: Locator;
  private readonly startRequestHeader: PageHeading;
  private readonly selectRequestTypesSubheading: Locator;
  private readonly createPageGuidance: Locator;
  private readonly guidancePoint1: Locator;
  private readonly guidancePoint2: Locator;
  private readonly pcrList: Array<string>;
  private readonly loanDrawdownChangeTitle: PageHeading;
  private readonly backToRequestLink: Locator;
  private readonly drawdownTableHeaders: Array<string>;
  private readonly drawdownBaseValue: number;
  private readonly continueSummaryButton: Locator;
  private readonly validationCopy: Array<string>;
  private readonly summaryTableHeaders: Array<string>;
  private readonly saveReturnToRequestButton: Locator;

  constructor({
    page,
    commands,
    projectChangeRequests,
    loanDrawdowns,
  }: {
    page: Page;
    commands: Commands;
    projectChangeRequests: ProjectChangeRequests;
    loanDrawdowns: LoanDrawdowns;
  }) {
    this.page = page;
    this.commands = commands;
    this.pcr = projectChangeRequests;
    this.drawdowns = loanDrawdowns;
    this.pcrTitle = PageHeading.fromTitle(this.page, "Project change requests");
    this.createButton = this.page.getByRole("button").filter({ hasText: "Create request" });
    this.startRequestHeader = PageHeading.fromTitle(this.page, "Start a new request");
    this.selectRequestTypesSubheading = this.page.locator("legend").filter({ hasText: "Select request types" });
    this.createPageGuidance = this.page.getByRole("paragraph").filter({ hasText: "Before you submit, you must:" });
    this.guidancePoint1 = this.page
      .getByRole("list")
      .filter({ hasText: "ensure all project partners have approved the change(s)" });
    this.guidancePoint2 = this.page
      .getByRole("list")
      .filter({ hasText: "discuss this request with your monitoring officer" });
    this.pcrList = [
      "Reallocate project costs",
      "Change project scope",
      "Put project on hold",
      "Loan Drawdown Change",
      "Change Loans Duration",
      "Manage team members",
    ];
    this.loanDrawdownChangeTitle = PageHeading.fromTitle(this.page, "Loan Drawdown Change");
    this.backToRequestLink = this.commands.backLink("Back to request");
    this.drawdownTableHeaders = ["Drawdown", "Current date", "Current amount", "New date", "New amount"];
    this.drawdownBaseValue = 110000;
    this.continueSummaryButton = this.page.getByRole("button").filter({ hasText: "Continue to summary" });
    this.validationCopy = [
      "Day must be a number.",
      "Month must be a number.",
      "Year must be a number.",
      "New value must be a number.",
      "Enter a valid date.",
    ];
    this.summaryTableHeaders = ["Drawdown", "Current date", "Current amount", "New date", "New amount"];
    this.saveReturnToRequestButton = this.page.getByRole("button").filter({ hasText: "Save and return to request" });
  }

  @Then("the Loans PCR options are displayed")
  async loansPcrCreatePage() {
    await this.pcrTitle.isVisible();
    await this.createButton.click();
    await this.startRequestHeader.isVisible();
    await expect(this.createPageGuidance).toBeVisible();
    await expect(this.guidancePoint1).toBeVisible();
    await expect(this.guidancePoint2).toBeVisible();
    await expect(this.selectRequestTypesSubheading).toBeVisible();
    for (const pcr of this.pcrList) {
      await expect(this.page.getByLabel(pcr)).toBeVisible();
    }
  }

  @When("the user completes the Loan Drawdown Change with validation")
  async completeDrawdownChange() {
    await this.pcr.selectPcrType("Loan Drawdown Change");
    await this.loanDrawdownChangeTitle.isVisible();
    await expect(this.backToRequestLink).toBeVisible();
    await this.drawdownHeadersAssert();
    await this.viewDrawdownChangeTable();
    await this.validateEmptyDrawdownChangeTable();
    await this.validateFieldsNonNumber();
    await this.validateIncorrectDate();
    await this.validateTotals();
    await this.completePCR();
    await this.submitPcr();
  }

  /**METHODS**/

  async drawdownHeadersAssert() {
    let i = 0;
    for (const header of this.drawdownTableHeaders) {
      await expect(this.page.getByRole("table").locator("thead").locator("th").nth(i)).toHaveText(header);
      i++;
    }
  }

  async viewDrawdownChangeTable() {
    let dateIncrement = 0;
    let drawdownValue = 110000;
    for (let i = 1; i < 13; i++) {
      let drawdownCurrency = drawdownValue.toLocaleString("en-GB", { style: "currency", currency: "GBP" });
      let row = [i, this.drawdowns.getDrawdownDate(dateIncrement, true), drawdownCurrency];
      let cell = 0;
      for (const td of row) {
        await expect(this.page.getByRole("table").locator("tr").nth(i).locator("td").nth(cell)).toHaveText(String(td));
        if (cell === 3) {
          cell = 0;
        } else {
          cell++;
        }
      }
      await this.dayInput(i - 1, "01", true);
      await this.monthInput(i - 1, this.drawdowns.getDrawdownMonthDigit(dateIncrement), true);
      await this.yearInput(i - 1, this.drawdowns.getDrawdownYear(dateIncrement));
      await this.currencyInput(i - 1, String(drawdownValue), true);
      drawdownValue = drawdownValue + 11000;
      dateIncrement = dateIncrement + 3;
    }
    await this.drawdownTableFooter(2046000);
  }

  async validateEmptyDrawdownChangeTable() {
    for (let i = 0; i < 12; i++) {
      await this.dayInput(i, "");
      await this.monthInput(i, "");
      await this.yearInput(i, "");
      await this.currencyInput(i, "");
    }
    await this.drawdownTableFooter(0);
    await this.continueSummaryButton.click();
    await expect(this.page.getByTestId("validation-summary").getByRole("link")).toHaveCount(48);
    await this.page.reload();
    await this.dayInput(0, "01", true);
    await this.page.waitForTimeout(1000);
  }

  async validateFieldsNonNumber() {
    const inputCopy = [getLorem(30000), "£", "!", "@", "*", "%", "*", "^", "&", "+", "=", "-", "#"];
    for (const input of inputCopy) {
      await this.dayInput(0, input);
      await this.monthInput(0, input);
      await this.yearInput(0, input);
      await this.currencyInput(0, input);
      await this.continueSummaryButton.click();
      for (const msg of this.validationCopy) {
        await this.commands.validationLink(msg);
      }
    }
  }

  async validateIncorrectDate() {
    await this.dayInput(0, "32");
    await this.monthInput(0, "13");
    await this.yearInput(0, "1066");
    await this.continueSummaryButton.click();
    await this.commands.validationLink("Enter a valid date.");
    await this.dayInput(0, "31");
    await this.commands.validationLink("Enter a valid date.");
    await this.monthInput(0, "11");
    await this.commands.validationLink("Enter a valid date.");
    await this.yearInput(0, "2000");
    await expect(this.page.getByTestId("validation-summary")).not.toHaveText("Enter a valid date.");
  }

  async validateTotals() {
    await this.currencyInput(0, "1000000");
    await this.commands.validationLink("The new drawdown total cannot exceed the current drawdown total.");
    await this.currencyInput(0, "9999999999999");
    await this.commands.validationLink("New value must be £999,999,999,999.00 or less.");
    for (let i = 0; i < 12; i++) {
      await this.currencyInput(i, "170500");
    }
    await this.drawdownTableFooter(2046000);
    await expect(this.page.getByTestId("validation-summary")).not.toHaveText(
      "The new drawdown total cannot exceed the current drawdown total.",
    );
    await this.currencyInput(0, "170500.01");
    await this.commands.validationLink("The new drawdown total cannot exceed the current drawdown total.");
    await this.drawdownTableFooter(2046000.01);
  }

  async completePCR() {
    await this.dayInput(0, "01");
    await this.monthInput(0, this.drawdowns.getDrawdownMonthDigit(1));
    await this.yearInput(0, this.drawdowns.getDrawdownYear(0));
    for (let i = 0; i < 12; i++) {
      await this.currencyInput(i, "170500");
    }
    await this.drawdownTableFooter(2046000);
    await this.continueSummaryButton.click();
    await this.pcr.markAsCompleteSection(false);
    await this.summaryTable();
    await this.saveReturnToRequestButton.click();
    await this.pcr.requestPagePcrStatus("Loan Drawdown Change", "Incomplete");
    await this.pcr.selectPcrType("Loan Drawdown Change");
    await this.pcr.markAsCompleteSection(true);
    await this.pcr.requestPagePcrStatus("Loan Drawdown Change", "Complete");
  }

  async summaryTable() {
    let i = 0;
    for (const header of this.summaryTableHeaders) {
      await expect(this.page.getByRole("table").locator("thead").locator("th").nth(i)).toHaveText(header);
      i++;
    }
    await this.summaryRow1();
    await this.remainingSummaryRows();
  }

  async summaryRow1() {
    let row = [
      "1",
      this.drawdowns.getDrawdownDate(0, true),
      "£110,000.00",
      this.drawdowns.getDrawdownDate(1),
      "£170,500.00",
      "Edit",
    ];
    let i = 0;
    for (const cell of row) {
      await expect(this.page.getByRole("table").locator("tbody").locator("tr").nth(0).locator("td").nth(i)).toHaveText(
        cell,
      );
      i++;
    }
  }

  async submitPcr() {
    await this.pcr.completePcrReasons();
    await this.pcr.submitRequest();
  }

  async remainingSummaryRows() {
    let rowNum = 2;
    let dateIncrement = 3;
    let drawdownValue = 121000;
    let i = 0;
    for (let row = 1; row < 12; row++) {
      let remainingRow = [
        String(rowNum),
        this.drawdowns.getDrawdownDate(dateIncrement, true),
        drawdownValue.toLocaleString("en-GB", { style: "currency", currency: "GBP" }),
        this.drawdowns.getDrawdownDate(dateIncrement),
        "£170,500.00",
        "Edit",
      ];
      for (const cell of remainingRow) {
        await expect(
          this.page.getByRole("table").locator("tbody").locator("tr").nth(row).locator("td").nth(i),
        ).toHaveText(cell);
        if (i === 5) {
          i = 0;
        } else {
          i++;
        }
      }
      dateIncrement = dateIncrement + 3;
      rowNum = rowNum + 1;
      drawdownValue = drawdownValue + 11000;
    }
    await this.drawdownTableFooter(2046000);
  }

  async drawdownTableFooter(newTotal: number) {
    let total = newTotal.toLocaleString("en-GB", { style: "currency", currency: "GBP" });
    const foot = ["Total", "£2,046,000.00", total];
    let i = 0;
    for (const th of foot) {
      await expect(this.page.getByRole("table").locator("tfoot").locator("th").nth(i)).toHaveText(th);
      i = i + 2;
    }
  }

  async dayInput(rowNum: number, value: string, readonly?: boolean) {
    if (readonly) {
      await expect(this.page.locator(`#loans_${rowNum}_newDate_day`)).toHaveValue(value);
    } else {
      await this.page.locator(`#loans_${rowNum}_newDate_day`).fill(value);
    }
  }

  async monthInput(rowNum: number, value: string, readonly?: boolean) {
    if (readonly) {
      await expect(this.page.locator(`#loans_${rowNum}_newDate_month`)).toHaveValue(value);
    } else {
      await this.page.locator(`#loans_${rowNum}_newDate_month`).fill(value);
    }
  }

  async yearInput(rowNum: number, value: string, readonly?: boolean) {
    if (readonly) {
      await expect(this.page.locator(`#loans_${rowNum}_newDate_year`)).toHaveValue(value);
    } else {
      await this.page.locator(`#loans_${rowNum}_newDate_year`).fill(value);
    }
  }

  async currencyInput(rowNum: number, value: string, readonly?: boolean) {
    if (readonly) {
      await expect(
        this.page.getByRole("table").locator("tbody").locator("tr").nth(rowNum).locator("td").nth(4).locator("input"),
      ).toHaveValue(value);
    } else {
      await this.page
        .getByRole("table")
        .locator("tbody")
        .locator("tr")
        .nth(rowNum)
        .locator("td")
        .nth(4)
        .locator("input")
        .fill(value);
    }
  }
}
