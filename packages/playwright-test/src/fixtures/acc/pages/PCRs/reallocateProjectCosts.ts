import { expect, Locator, Page } from "@playwright/test";
import { Fixture, Then, When } from "playwright-bdd/decorators";
import { Commands } from "../../../Commands";
import { ProjectChangeRequests } from "./ProjectChangeRequests";
import { PageHeading } from "../../../../components/PageHeading";
import { DataTable } from "playwright-bdd";
import { AccNavigation } from "../../AccNavigation";
import { AccUserSwitcher } from "../../AccUserSwitcher";

export
@Fixture("reallocateProjectCosts")
class ReallocateProjectCosts {
  protected readonly page: Page;
  protected readonly commands: Commands;
  protected readonly pcr: ProjectChangeRequests;
  protected readonly accNavigation: AccNavigation;
  protected readonly accUserSwitcher: AccUserSwitcher;

  private readonly reallocateHeading: PageHeading;
  private readonly backToRequest: Locator;
  private readonly grantGuidance: Locator;
  private readonly changeRemainingGrantButton: Locator;
  private readonly grantMovingSubheading: Locator;
  private readonly grantMovingHint: Locator;
  private readonly grantMovingInput: Locator;
  private readonly saveAndReturnRequestButton: Locator;
  private readonly saveAndReturnCostsButton: Locator;
  private readonly hedgesPrimarySubmissionCosts: Array<[string | RegExp, string]>;
  private readonly hedgesSecondarySubmissionCosts: Array<[string | RegExp, string]>;
  private readonly backToSummary: Locator;
  private readonly reviewPageDetailsDropdown: Locator;

  constructor({
    page,
    commands,
    projectChangeRequests,
    accNavigation,
    accUserSwitcher,
  }: {
    page: Page;
    commands: Commands;
    projectChangeRequests: ProjectChangeRequests;
    accNavigation: AccNavigation;
    accUserSwitcher: AccUserSwitcher;
  }) {
    this.page = page;
    this.commands = commands;
    this.pcr = projectChangeRequests;
    this.accNavigation = accNavigation;
    this.accUserSwitcher = accUserSwitcher;

    this.reallocateHeading = PageHeading.fromTitle(page, "Reallocate project costs");
    this.backToRequest = this.commands.backLink("Back to request");
    this.grantGuidance = this.page.getByRole("paragraph").filter({
      hasText:
        "If the new remaining grant is higher as a result of the reallocation of costs, you can change the funding level of partners to lower the new project grant.",
    });
    this.changeRemainingGrantButton = this.page.getByRole("button").filter({ hasText: "Change remaining grant" });
    this.grantMovingSubheading = this.page
      .locator("legend")
      .filter({ hasText: "Grant value moving over the financial year end" });
    this.grantMovingHint = this.page
      .locator("#hint-for-grantMovingOverFinancialYear")
      .filter({ hasText: "The financial year ends on 31 March." });
    this.grantMovingInput = this.page.locator("#grantMovingOverFinancialYear");
    this.saveAndReturnRequestButton = this.page.getByRole("button").filter({ hasText: "Save and return to request" });
    this.saveAndReturnCostsButton = this.page
      .getByRole("button")
      .filter({ hasText: "Save and return to reallocate project costs" });
    this.hedgesPrimarySubmissionCosts = [
      ["Labour", "1500000.02"],
      ["Overheads", "1259999.99"],
      ["Materials", "1500000.07"],
      ["Capital usage", "7800000.02"],
      ["Subcontracting", "7800000.07"],
      ["Travel and subsistence", "7800000.07"],
      ["Other costs", "7800000.02"],
    ];
    this.hedgesSecondarySubmissionCosts = [
      ["Directly incurred - staff", "1076199.98"],
      ["Directly incurred - travel and subsistence", "1076199.98"],
      ["Directly incurred - equipment", "1076199.98"],
      ["Directly incurred - other costs", "1076199.98"],
      ["Directly allocated - investigations", "1076199.98"],
      ["Directly allocated - estates costs", "1076199.98"],
      ["Directly allocated - other costs", "1076199.98"],
      ["Indirect costs - investigations", "1076199.98"],
      ["Exceptions - staff", "1076199.98"],
      ["Exceptions - travel and subsistence", "1076199.98"],
      ["Exceptions - equipment", "1076199.98"],
      ["Exceptions - other costs", "1076199.96"],
    ];
    this.backToSummary = this.commands.backLink("Back to summary");
    this.reviewPageDetailsDropdown = this.page.locator("details").filter({ hasText: "Reasoning for the request" });
  }

  @Then("the user will see the Reallocate project costs PCR page")
  async reallocateMainPage(table: DataTable) {
    await this.reallocateHeading.isVisible();
    await expect(this.backToRequest).toBeVisible();
    await this.reallocateTable(table);
    await expect(this.grantGuidance).toBeVisible();
    await expect(this.changeRemainingGrantButton).toBeVisible();
    await expect(this.grantMovingSubheading).toBeVisible();
    await expect(this.grantMovingHint).toBeVisible();
    await expect(this.grantMovingInput).toBeVisible();
    await this.pcr.markAsCompleteSubheading();
    await expect(this.page.getByLabel("I agree with this change.")).toBeVisible();
    await expect(this.saveAndReturnRequestButton).toBeVisible();
  }

  @Then("the user will see the Reallocate costs footer totals")
  async reallocateCostsPageFooter(table: DataTable) {
    const data = table.hashes();
    const headers = [
      "Partner",
      "Total eligible costs",
      "Remaining costs",
      "Remaining grant",
      "New total eligible costs",
      "New remaining costs",
      "New remaining grant",
    ];

    for (const row of data) {
      for (let i = 0; i < 7; i++) {
        await expect(this.page.getByRole("table").locator("tfoot").locator("th").nth(i)).toHaveText(row[headers[i]]);
      }
    }
  }

  @When("the user clicks {string} in the reallocate costs table")
  async clickPartner(name: string) {
    await this.page.getByRole("table").getByRole("link").filter({ hasText: name }).click();
  }

  @Then("the user will see partner costs for {string}")
  async partnerCosts(name: string, table: DataTable) {
    await expect(this.page.getByRole("heading").filter({ hasText: name })).toBeVisible();
    await this.partnerCostsTable(table);
  }

  @Then("the user will see the Summary of project costs")
  async summaryOfProjectCosts(table: DataTable) {
    const data = table.hashes();
    const headers = [
      "Total eligible costs",
      "New total eligible costs",
      "Difference",
      "Total remaining grant",
      "New total remaining grant",
      "Difference",
    ];
    let i = 0;
    for (const header of headers) {
      await expect(
        this.page.getByRole("table").nth(1).locator("thead").locator("th").nth(i).filter({ hasText: header }),
      ).toBeVisible();
      i++;
    }
    for (const row of data) {
      const tableCell = this.page.getByRole("table").nth(1).locator("tbody").locator("td");
      await expect(tableCell.nth(0)).toHaveText(row["Total eligible costs"]);
      await expect(tableCell.nth(1)).toHaveText(row["New total eligible costs"]);
      await expect(tableCell.nth(2)).toHaveText(row["Difference costs"]);
      await expect(tableCell.nth(3)).toHaveText(row["Total remaining grant"]);
      await expect(tableCell.nth(4)).toHaveText(row["New total remaining grant"]);
      await expect(tableCell.nth(5)).toHaveText(row["Difference grant"]);
    }
  }

  @Then("the user will see {string} button")
  async buttonIsVisible(name: string) {
    await expect(this.page.getByRole("button").filter({ hasText: name })).toBeVisible();
  }

  @Then("the user accesses the {string} PCR")
  async accessPcr(pcr: string) {
    const row = this.page.getByRole("table").locator("tbody").locator("tr").filter({ hasText: pcr });
    await row.locator("td").getByRole("link").filter({ hasText: "Edit" }).click();
    await this.pcr.selectPcrType(pcr);
  }

  @When("the user enters {string} into the {string} field")
  async validatePartnerCosts(data: string, field: string) {
    await this.clickPartner("Hedge's Primary Ltd. (Lead)");
    if (field === "Other costs") {
      await this.page.getByLabel(/^Other costs$/).fill(data);
    } else {
      await this.page.getByLabel(field).fill(data);
    }
    await this.saveAndReturnCostsButton.click();
  }

  @Then("the user will see a {string} message")
  async validationMessage(msg: string) {
    await this.commands.validationLink(msg);
    await this.commands.paragraph(msg);
  }

  @When("the user has navigated to the existing Reallocate project costs PCR")
  async navigateToExistingReallocatePCR() {
    await this.accNavigation.gotoProjectChangeRequests();
    if (
      await this.page
        .getByRole("table")
        .locator("tbody")
        .locator("tr")
        .filter({ hasText: "Reallocate project costs" })
        .isVisible()
    ) {
      await this.accessPcr("Reallocate project costs");
    } else {
      await this.pcr.createPCR("Reallocate project costs");
      await this.pcr.selectPcrType("Reallocate project costs");
    }
  }

  @When("the user makes changes to the partner costs")
  async editPartnerCosts(table: DataTable) {
    const data = table.hashes();
    let rowNumber = 0;
    for (const row of data) {
      if (row["Cost category"] === "Other costs") {
        await this.page.getByLabel(/^Other costs$/).fill(row["New cost"]);
      } else {
        await this.page.getByLabel(row["Cost category"]).fill(row["New cost"]);
      }
      await expect(
        this.page.getByRole("table").first().locator("tbody").locator("tr").nth(rowNumber).locator("td").nth(4),
      ).toHaveText(row["Costs reallocated"]);
      rowNumber++;
    }
  }

  @Then("the user will see the updated totals in the footer")
  async updatedTotalsFooter(table: DataTable) {
    let data = table.hashes();
    const headers = [
      "Cost category",
      "Total eligible costs",
      "Costs claimed",
      "New total eligible costs",
      "Costs reallocated",
    ];
    for (const row of data) {
      for (let i = 0; i < 5; i++) {
        await expect(this.page.getByRole("table").first().locator("tfoot").locator("td").nth(i)).toHaveText(
          row[headers[i]],
        );
      }
    }
  }

  @Then("the user will see {string} remaining grant surplus warning message")
  async grantSurplusMessage(surplus: string) {
    let msg = `Your 'Remaining grant' has a surplus of ${surplus}. You may lose this project surplus permanently if you do not reallocate these funds before you submit this PCR.`;
    await this.commands.validationNotification(msg);
  }

  @Then("the user will see {string} grant exceeded warning message")
  async grantExceedMessage(excess: string) {
    let msg = `You must reduce your 'New remaining grant' project total to £39,787,200.00 or less, because you have exceeded it by ${excess}. You can change each partner’s 'Remaining grant' to reduce the project total to the amount agreed.`;
    await this.commands.validationNotification(msg);
  }

  @When("the user enters {string} in the Grant moving over financial year")
  async enterGrantMoving(input: string) {
    await this.grantMovingInput.fill(input);
  }

  @Then("the user will see the grant moving over financial year validation message")
  async grantMovingVal() {
    await this.commands.validationLink("Enter grant value moving over financial year end.");
  }

  @Then("the user will see a validation message advising of exceeded grant")
  async exceededGrantVal() {
    await this.commands.validationLink(
      "You must reduce your 'New remaining grant' project total to £39,787,200.00 or less, because you have exceeded it by £0.01.",
    );
  }

  @When("the user updates {string} to {string}")
  async updateSingleCostCat(field: string, value: string) {
    await this.page.getByLabel(field).fill(value);
  }

  @Then("no grant warning messages will be displayed")
  async noWarningMessages() {
    await expect(this.page.getByTestId("validation-message-content")).toHaveCount(0);
  }

  @When("the user unchecks {string}")
  async uncheckLabel(label: string) {
    await this.page.getByLabel(label).uncheck();
  }

  @Then("the Reallocate project costs PCR is in the Complete state")
  async reallocateCompleted() {
    if (await this.page.getByLabel("I agree with this change.").isChecked()) {
      await this.saveAndReturnRequestButton.click();
    } else {
      await this.accessUpdateCosts("Hedge's Primary Ltd", this.hedgesPrimarySubmissionCosts);
      await this.accessUpdateCosts("Hedge's Secondary Ltd", this.hedgesSecondarySubmissionCosts);
      await this.grantMovingInput.fill("0");
      await this.page.getByLabel("I agree with this change.").check();
      await this.saveAndReturnRequestButton.click();
      await this.pcr.viewRequestPage("Reallocate project costs");
    }
  }

  @Then("the user accesses the PCR with status {string}")
  async accessPcrWithStatus(status: string) {
    if (await this.page.getByRole("table").filter({ hasText: status }).isVisible()) {
      await this.page.getByRole("link").filter({ hasText: "Review" }).click();
    } else {
      await this.accNavigation.gotoProjectOverview();
      await this.accUserSwitcher.switchToUser("pmUser");
      await this.commands.selectTile("Project change requests");
      await this.pcr.createPCR("Reallocate project costs");
      await this.pcr.selectPcrType("Reallocate project costs");
      await this.reallocateCompleted();
      await this.pcr.completePcrReasons();
      await this.commands.button("Submit request").click();
      await this.pcr.submittedPage("Reallocate project costs");
      await this.accNavigation.gotoProjectOverview();
      await this.accUserSwitcher.switchToUser("mspUser");
      await this.commands.selectTile("Project change requests");
      await this.page.getByRole("link").filter({ hasText: "Review" }).click();
      await this.pcr.viewRequestPage("Reallocate project costs");
    }
  }

  @Then("the user will see the project-level review page for Reallocate project costs")
  async reallocateProjectReviewPage(table: DataTable) {
    await expect(this.backToRequest).toBeVisible();
    await this.reallocateHeading.isVisible();
    await this.viewReallocateProjectCostsReviewPage(table);
    await this.commands.getListItemFromKey(
      "Grant value moving over the financial year end",
      "£0.00",
      true,
      false,
      "grantValueYearEnd",
    );
    await expect(this.page.getByTestId("arrow-left").filter({ hasText: "Reasoning" })).toBeVisible();
  }

  @Then("they will see the {string} costs page")
  async partnerCostsReviewPage(partnerName: string, table: DataTable) {
    await expect(this.page.getByRole("heading").filter({ hasText: partnerName })).toBeVisible();
    await expect(this.backToSummary).toBeVisible();
    await this.reasoningDropdown();
    await this.partnerReviewCostTable(table);
    await this.backToSummary.click();
    await this.reallocateHeading.isVisible();
  }

  /**
   * METHODS
   */
  async reallocateTable(table: DataTable) {
    let data = table.hashes();
    const headers = [
      "Partner",
      "Total eligible costs",
      "Remaining costs",
      "Remaining grant",
      "New total eligible costs",
      "New remaining costs",
      "New remaining grant",
    ];

    //Header
    let i = 0;
    for (const header of headers) {
      await expect(this.page.getByRole("table").locator("thead").locator("th").nth(i)).toHaveText(headers[i]);
      i++;
    }
    //Table body
    let ii = 0;
    for (const row of data) {
      for (let col = 0; col < 7; col++) {
        await expect(
          this.page
            .getByRole("table")
            .locator("tbody")
            .locator("tr")
            .nth(ii)
            .locator("td")
            .nth(col)
            .filter({ hasText: row[headers[col]] }),
        ).toHaveText(row[headers[col]]);
      }
      ii++;
    }
  }

  async partnerCostsTable(table: DataTable) {
    let data = table.hashes();
    const headers = ["Cost category", "Total eligible costs", "Costs claimed"];
    const footers = ["Partner totals", "£79,560,000.00", "£0.00", "£79,560,000.00"];
    let trow = 0;
    for (const row of data) {
      for (let i = 0; i < 3; i++) {
        await expect(
          this.page
            .getByRole("table")
            .locator("tbody")
            .locator("tr")
            .nth(trow)
            .locator("td")
            .nth(i)
            .filter({ hasText: row[headers[i]] }),
        ).toBeVisible();
      }
      trow++;
    }
    let i = 0;
    for (const foot of footers) {
      await expect(
        this.page.getByRole("table").locator("tfoot").locator("td").nth(i).filter({ hasText: foot }),
      ).toBeVisible();
      i++;
    }
  }

  async accessUpdateCosts(partnerName: string, data: Array<[string | RegExp, string]>) {
    await this.page.getByRole("table").getByRole("link").filter({ hasText: partnerName }).click();
    await expect(this.page.getByRole("heading").filter({ hasText: partnerName })).toBeVisible();
    for (const [field, value] of data) {
      if (field === "Other costs") {
        await this.page.getByLabel(/^Other costs$/).fill(value);
      } else {
        await this.page.getByLabel(field).fill(value);
      }
    }
    await this.saveAndReturnCostsButton.click();
    await this.reallocateHeading.isVisible();
  }
  async viewReallocateProjectCostsReviewPage(table: DataTable) {
    const data = table.hashes();
    const headers = [
      "Partner",
      "Total eligible costs",
      "New total eligible costs",
      "Difference",
      "Funding level",
      "New funding level",
      "Remaining grant",
      "New remaining grant",
      "Difference",
    ];
    let i = 0;
    for (const header of headers) {
      await expect(this.page.getByRole("table").locator("thead").locator("th").nth(i)).toHaveText(header);
      i++;
    }
    let rowNum = 1;
    for (const row of data) {
      let cell: Locator;
      if (rowNum === 3) {
        cell = this.page.getByRole("table").locator("tr").nth(rowNum).locator("th");
      } else {
        cell = this.page.getByRole("table").locator("tr").nth(rowNum).locator("td");
      }
      await expect(cell.nth(0)).toHaveText(row["Partner"]);
      await expect(cell.nth(1)).toHaveText(row["Total eligible costs"]);
      await expect(cell.nth(2)).toHaveText(row["New total eligible costs"]);
      await expect(cell.nth(3)).toHaveText(row["Difference costs"]);
      await expect(cell.nth(4)).toHaveText(row["Funding level"]);
      await expect(cell.nth(5)).toHaveText(row["New funding level"]);
      await expect(cell.nth(6)).toHaveText(row["Remaining grant"]);
      await expect(cell.nth(7)).toHaveText(row["New remaining grant"]);
      await expect(cell.nth(8)).toHaveText(row["Difference grant"]);
      rowNum++;
    }
  }

  async reasoningDropdown() {
    await expect(this.reviewPageDetailsDropdown).toBeVisible();
    await expect(this.reviewPageDetailsDropdown).not.toHaveAttribute("open");
    await this.reviewPageDetailsDropdown.locator("span").click();
    await expect(this.reviewPageDetailsDropdown).toHaveAttribute("open");
    await expect(
      this.reviewPageDetailsDropdown.getByRole("paragraph").filter({ hasText: "This is the reasoning for this PCR." }),
    ).toBeVisible();
    await this.reviewPageDetailsDropdown.locator("span").click();
    await expect(this.reviewPageDetailsDropdown).not.toHaveAttribute("open");
  }

  async partnerReviewCostTable(table: DataTable) {
    const data = table.hashes();
    const headings = ["Cost category", "Total eligible costs", "New total eligible costs", "Costs reallocated"];
    let rowNumber = 1;
    for (const row of data) {
      let i = 0;
      for (const header of headings) {
        await expect(
          this.page
            .getByRole("table")
            .locator("tr")
            .nth(rowNumber)
            .locator("td")
            .nth(i)
            .filter({ hasText: row[header[i]] }),
        ).toBeVisible();
        i++;
      }
      rowNumber++;
    }
  }
}
