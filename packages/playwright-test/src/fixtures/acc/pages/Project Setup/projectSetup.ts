import { expect, Locator, Page } from "@playwright/test";
import { Fixture, Then, When } from "playwright-bdd/decorators";
import { Commands } from "../../../Commands";
import { PageHeading } from "../../../../components/PageHeading";
import { DataTable } from "playwright-bdd";
import { ViewForecast } from "../ViewForecast";
import { getLorem } from "../../../../components/lorem";

export
@Fixture("projectSetup")
class ProjectSetup {
  protected readonly page: Page;
  protected readonly commands: Commands;
  protected readonly viewForecast: ViewForecast;

  private readonly backToProjectsLink: Locator;
  private readonly projectSetupHeading: PageHeading;
  private readonly mainPageGuidance: Locator;
  private readonly taskList: Locator;
  private readonly giveUsInfoSubheading: Locator;
  private readonly sectionLinks: Array<string>;
  private readonly completeProjectSetupButton: Locator;
  private readonly returnToProjectDashboard: Locator;
  private readonly spendProfileHeading: PageHeading;
  private readonly spendProfileGuidance: Locator;
  private readonly spendProfileOverheadGuidance: string;
  private readonly overheadsRate: Locator;
  private readonly tbody: Locator;
  private readonly trow: Locator;
  private readonly readyToSubmit: Locator;
  private readonly markAsComplete: Locator;
  private readonly saveAndReturn: Locator;
  private readonly provideBankDetailsHeading: PageHeading;
  private readonly bankDetailsGuidance: Locator;
  private readonly organisationInfoHeading: Locator;
  private readonly hedgesPrimaryParagraph: Locator;
  private readonly companyNumberLabel: Locator;
  private readonly companyNumberHint: Locator;
  private readonly accountDetailsHeading: Locator;
  private readonly sortCodeLabel: Locator;
  private readonly sortCodeHint: Locator;
  private readonly accountNumberLabel: Locator;
  private readonly accountNumberHint: Locator;
  private readonly billingAddressHeading: Locator;
  private readonly billingGuidance: Locator;
  private readonly buildingLabel: Locator;
  private readonly streetLabel: Locator;
  private readonly localityLabel: Locator;
  private readonly townCityLabel: Locator;
  private readonly postcodeLabel: Locator;
  private readonly submitBankDetailsButton: Locator;
  private readonly confirmYourBankDetailsHeading: PageHeading;
  private readonly changeBankDetailsButton: Locator;
  private readonly automatedCheckGuidance: Locator;
  private readonly redactedGuidance: Locator;
  private readonly allowConfirmDetailsGuidance: Locator;
  private readonly statementMustShowGuidance: Locator;
  private readonly statementList: Array<string>;
  private readonly returnToSetupButton: Locator;
  private readonly submitBankStatementButton: Locator;
  private readonly projectLocationHeading: PageHeading;
  private readonly newLocationLabel: Locator;
  private readonly newLocationHint: Locator;
  private readonly sfParticipantTable: Locator;

  constructor({ page, commands, viewForecast }: { page: Page; commands: Commands; viewForecast: ViewForecast }) {
    this.page = page;
    this.commands = commands;
    this.viewForecast = viewForecast;

    this.backToProjectsLink = this.commands.backLink("Back to projects");
    this.projectSetupHeading = PageHeading.fromTitle(page, "Project setup");
    this.mainPageGuidance = this.page
      .getByRole("paragraph")
      .filter({ hasText: "We will need some information before we can complete project setup." });
    this.taskList = this.page.getByTestId("taskList");
    this.giveUsInfoSubheading = this.page.getByRole("heading").filter({ hasText: "Give us information" });
    this.sectionLinks = ["Set spend profile", "Provide your bank details", "Provide your project location postcode"];
    this.completeProjectSetupButton = this.page.getByRole("button").filter({ hasText: "Complete project setup" });
    this.returnToProjectDashboard = this.page.getByRole("button").filter({ hasText: "Return to project dashboard" });
    this.spendProfileHeading = PageHeading.fromTitle(page, "Spend Profile");
    this.spendProfileGuidance = this.page.getByRole("paragraph").filter({
      hasText:
        "You must provide a forecast of all eligible project costs to reflect your spend throughout the project.",
    });
    this.spendProfileOverheadGuidance =
      "The Overheads field is locked and cannot be edited. This is because it is calculated at a set percentage of your labour costs, as per your application.";
    this.overheadsRate = this.page.getByRole("paragraph").filter({ hasText: "Overheads costs: 20.00%" });
    this.tbody = this.page.getByRole("table").locator("tbody");
    this.trow = this.tbody.locator("tr");
    this.markAsComplete = this.page.locator("legend").filter({ hasText: "Mark as complete" });
    this.readyToSubmit = this.page.getByLabel("This is ready to submit.");
    this.saveAndReturn = this.page.getByRole("button").filter({ hasText: "Save and return to project setup" });
    this.provideBankDetailsHeading = PageHeading.fromTitle(page, "Provide your bank details");
    this.bankDetailsGuidance = this.page.getByRole("paragraph").filter({
      hasText:
        "In order for us to pay your grant we need the bank details of your organisation. The bank account must belong to the organisation listed.",
    });
    this.organisationInfoHeading = this.page.locator("legend").filter({ hasText: "Organisation information" });
    this.hedgesPrimaryParagraph = this.page.getByRole("paragraph").filter({ hasText: "Hedge's Primary Ltd." });
    this.companyNumberLabel = this.page.getByLabel("Company number");
    this.companyNumberHint = this.page
      .locator("#hint-for-companyNumber")
      .filter({ hasText: "This is the registered organisation number." });
    this.accountDetailsHeading = this.page.locator("legend").filter({ hasText: "Account details" });
    this.sortCodeLabel = this.page.getByLabel("Sort code");
    this.sortCodeHint = this.page
      .locator("#hint-for-sortCode")
      .filter({ hasText: "Must be 6 digits long, for example: 311212." });
    this.accountNumberLabel = this.page.getByLabel("Account number");
    this.accountNumberHint = this.page
      .locator("#hint-for-accountNumber")
      .filter({ hasText: "Must be between 6 and 8 digits long, for example: 15481965." });
    this.billingAddressHeading = this.page.locator("legend").filter({ hasText: "Billing address" });
    this.billingGuidance = this.page.getByRole("paragraph").filter({
      hasText: "This is the billing address connected to this bank account. This is not the address of the bank.",
    });
    this.buildingLabel = this.page.getByLabel("Building");
    this.streetLabel = this.page.getByLabel("Street");
    this.localityLabel = this.page.getByLabel("Locality");
    this.townCityLabel = this.page.getByLabel("Town or city");
    this.postcodeLabel = this.page.getByLabel("Postcode");
    this.submitBankDetailsButton = this.page.getByRole("button").filter({ hasText: "Submit bank details" });
    this.confirmYourBankDetailsHeading = PageHeading.fromTitle(page, "Confirm your bank details");
    this.changeBankDetailsButton = this.page.getByRole("button").filter({ hasText: "Change bank details" });
    this.automatedCheckGuidance = this.page
      .getByRole("paragraph")
      .filter({ hasText: "Our automated checks were unable to verify your bank details." });
    this.redactedGuidance = this.page.getByRole("paragraph").filter({
      hasText:
        "We need you to upload a redacted bank statement for your organisation. This must be dated within 90 days of the upload date.",
    });
    this.allowConfirmDetailsGuidance = this.page
      .getByRole("paragraph")
      .filter({ hasText: "This will allow us to confirm we have the correct details." });
    this.statementMustShowGuidance = this.page
      .getByRole("paragraph")
      .filter({ hasText: "The statement must show your:" });
    this.statementList = ["Company name", "Account number", "Sort code"];
    this.returnToSetupButton = this.page.getByRole("button").filter({ hasText: "Return to set up your project" });
    this.submitBankStatementButton = this.page.getByRole("button").filter({ hasText: "Submit bank statement" });
    this.projectLocationHeading = PageHeading.fromTitle(page, "Provide your project location postcode");
    this.newLocationLabel = this.page.getByLabel("New location");
    this.newLocationHint = this.page.locator("#hint-for-postcode").filter({ hasText: "Enter the postcode." });
    this.sfParticipantTable = this.page
      .getByLabel("Project Participants")
      .locator("table")
      .locator("tbody")
      .locator("tr")
      .nth(0);
  }

  @Then("the user will see the initial {string} Project setup page")
  async viewProjectSetupMainPage(version: string) {
    await expect(this.backToProjectsLink).toBeVisible();
    await this.projectSetupHeading.isVisible();
    await expect(this.mainPageGuidance).toBeVisible();
    await expect(this.giveUsInfoSubheading).toBeVisible();
    for (const section of this.sectionLinks) {
      await this.sectionStatus(section, "To do");
    }
    if (version === "editable") {
      await expect(this.completeProjectSetupButton).toBeVisible();
    } else {
      await expect(this.returnToProjectDashboard).toBeVisible();
    }
  }

  @Then("the page will advise the user to complete all sections")
  async frontPageValidation(table: DataTable) {
    const data = table.hashes();
    let i = 1;
    for (const row of data) {
      await expect(
        this.taskList.locator("li").nth(i).getByRole("link").filter({ hasText: row["section"] }),
      ).toBeVisible();
      await expect(
        this.taskList.locator("li").nth(i).getByRole("paragraph").filter({ hasText: row["message"] }),
      ).toBeVisible();
      await this.commands.validationLink(row["message"]);
      i++;
    }
  }

  @When("the user clicks the {string} list item")
  async clickSetupItem(section: string) {
    await this.taskList.getByRole("link").filter({ hasText: section }).click();
  }

  @Then("the Spend profile page is displayed")
  async spendProfilePage(table: DataTable) {
    await this.spendProfileHeading.isVisible();
    await expect(this.spendProfileGuidance).toBeVisible();
    await this.commands.validationNotification(this.spendProfileOverheadGuidance);
    await expect(this.overheadsRate).toBeVisible();
    await this.emptyTable(table);
  }

  @When("the user {string} Ready to submit")
  async markAsCompleteSave(action: string) {
    await expect(this.markAsComplete).toBeVisible();
    if (action === "checks") {
      await this.readyToSubmit.check();
    } else {
      await this.readyToSubmit.uncheck();
    }
  }

  @When("the user Clicks Save and return to project setup")
  async clickSaveAndReturn() {
    await this.saveAndReturn.click();
  }

  @Then("the user will see the following validation messages")
  async validateIncompleteSpend(table: DataTable) {
    const data = table.hashes();
    for (const row of data) {
      await this.commands.validationLink(row["Message"]);
      //TODO: implement checks for paragraphs when appropriate
      //await expect(this.page.getByRole("paragraph").filter({ hasText: row["Message"] })).toBeVisible();
    }
  }

  @When("the user updates the spend profile equally")
  async updateTableEqually(table: DataTable) {
    await this.updateTable(table, 650000);
  }

  @Then("the totals should calculate correctly")
  async updatedTotals(table: DataTable) {
    const data = table.hashes();
    let i = 0;
    for (const row of data) {
      await expect(this.trow.nth(i).locator("td").nth(13).filter({ hasText: row["Total"] })).toBeVisible();
      await expect(this.trow.nth(i).locator("td").nth(15).filter({ hasText: row["Difference"] })).toBeVisible();
      i++;
    }
  }

  @When("the user clears the contents of a cell")
  async clearCells() {
    const cellLabels = [
      "Labour",
      "Materials",
      "Capital usage",
      "Subcontracting",
      "Travel and subsistence",
      "Other costs",
      "Other costs 2",
      "Other costs 3",
      "Other costs 4",
      "Other costs 5",
    ];
    for (const label of cellLabels) {
      await this.page.getByLabel(`${label} Period 1`).first().clear();
    }
  }

  @Then("a validation message appears advising them to enter a value")
  async emptyCellValidation() {
    await expect(
      this.page.getByTestId("validation-summary").getByRole("link").filter({ hasText: "Enter forecast." }),
    ).toHaveCount(10);
  }

  @When("the user reconciles the empty cells")
  async reFillBlankCells() {
    const cellLabels = [
      "Labour",
      "Materials",
      "Capital usage",
      "Subcontracting",
      "Travel and subsistence",
      "Other costs",
      "Other costs 2",
      "Other costs 3",
      "Other costs 4",
      "Other costs 5",
    ];
    for (const label of cellLabels) {
      await this.page.getByLabel(`${label} Period 1`).first().fill("650000");
    }
  }

  @Then("the {string} section will show as {string}")
  async sectionStatus(section: string, status: string) {
    await expect(
      this.taskList.locator("li").locator("ul").locator("li").filter({ hasText: section }).filter({ hasText: status }),
    ).toBeVisible();
  }

  @When("the user exceeds their total eligible costs")
  async exceedTotalEligible() {
    const cellLabels = [
      "Labour",
      "Materials",
      "Capital usage",
      "Subcontracting",
      "Travel and subsistence",
      "Other costs",
      "Other costs 2",
      "Other costs 3",
      "Other costs 4",
      "Other costs 5",
    ];
    for (const label of cellLabels) {
      await this.page.getByLabel(`${label} Period 1`).first().fill("650001");
    }
  }

  @When("the user exceeds the character limit of a cell")
  async exceedCharLimit() {
    await this.page.getByLabel(`Labour Period 1`).first().fill("9999999999999");
  }

  @When("the user updates the table using decimals")
  async updateDecimals(table: DataTable) {
    await this.updateTable(table, 659666.02);
  }

  @Then("the user will see the Provide your bank details page")
  async provideBankDetailsPage() {
    await this.provideBankDetailsHeading.isVisible();
    await expect(this.bankDetailsGuidance).toBeVisible();
    await expect(this.organisationInfoHeading).toBeVisible();
    await expect(this.hedgesPrimaryParagraph).toBeVisible();
    await expect(this.companyNumberLabel).toBeVisible();
    await expect(this.companyNumberHint).toBeVisible();
    await expect(this.accountDetailsHeading).toBeVisible();
    await expect(this.sortCodeLabel).toBeVisible();
    await expect(this.sortCodeHint).toBeVisible();
    await expect(this.accountNumberLabel).toBeVisible();
    await expect(this.accountNumberHint).toBeVisible();
    await expect(this.billingAddressHeading).toBeVisible();
    await expect(this.billingGuidance).toBeVisible();
    await expect(this.buildingLabel).toBeVisible();
    await expect(this.streetLabel).toBeVisible();
    await expect(this.localityLabel).toBeVisible();
    await expect(this.townCityLabel).toBeVisible();
    await expect(this.postcodeLabel).toBeVisible();
    await expect(this.submitBankDetailsButton).toBeVisible();
  }

  @When("the user enters an invalid value {string} in the banking field {string}")
  async validateField(value: string, field: string) {
    await this.page.getByLabel(field).fill(value);
    await this.submitBankDetailsButton.click();
  }

  @Then("the user sees the validation message {string}")
  async validationDisplayed(message: string) {
    await this.commands.validationLink(message);
    await expect(this.page.getByRole("paragraph").filter({ hasText: message })).toBeVisible();
  }

  @When("the user enters {string} characters in the {string} field")
  async validateAddressFields(length: string, field: string) {
    let charLength = Number(length);
    let input = getLorem(charLength);
    await this.page.getByLabel(field).fill(input);
    await this.submitBankDetailsButton.click();
  }

  @When("the user enters correct syntax account details with invalid data")
  async correctSyntaxInvalidAccountInfo() {
    await this.sortCodeLabel.fill("123321");
    await this.accountNumberLabel.fill("12332123");
  }

  @When("the user completes the address fields with 255 characters")
  async addressInput(table: DataTable) {
    const data = table.hashes();
    for (const row of data) {
      let charLength = Number(row["Length"]);
      let lorem = getLorem(charLength);
      await this.page.getByLabel(row["Field"]).fill(lorem);
    }
  }

  @Then("the following validation messages will not be present")
  async noValMessages(table: DataTable) {
    const data = table.hashes();
    for (const row of data) {
      await expect(this.page.getByTestId("validation-summary").filter({ hasText: row["Message"] })).not.toBeVisible();
    }
  }

  @When("the user completes the Provide your bank details section")
  async completeBankDetails(table: DataTable) {
    const data = table.hashes();
    for (const row of data) {
      await this.page.getByLabel(row["Field"]).fill(row["Value"]);
    }
  }

  @Then("the user will see the Confirm your bank details page")
  async confirmBankPage(table: DataTable) {
    const data = table.hashes();
    await this.confirmYourBankDetailsHeading.isVisible();
    for (const row of data) {
      await this.commands.getListItemFromKey(row["Field"], row["Value"], true, false, row["qaTag"]);
    }
    await expect(this.submitBankDetailsButton).toBeVisible();
    await expect(this.changeBankDetailsButton).toBeVisible();
  }

  @Then("the We need more information page is displayed")
  async needMoreInfoPage() {
    await this.bankSetupGuidancePages(false);
  }

  @Then("the user will see the Upload bank statement page")
  async uploadBankStatementPage() {
    await this.bankSetupGuidancePages(true);
  }

  @When("the user user uploads a bank statement file")
  async uploadBankStatement() {
    await this.page.locator("css=#attachment").setInputFiles("src/components/testFiles/testfile.pdf");
    await this.page.waitForTimeout(3000);
    await this.page.getByRole("button").filter({ hasText: "Upload" }).click();
    await this.commands.validationNotification("Your document has been uploaded.");
    await this.page.waitForTimeout(5000);
  }

  @Then("the user will see the Provide your project location postcode page")
  async projectLocationPage() {
    await this.projectLocationHeading.isVisible();
    await expect(this.newLocationLabel).toBeVisible();
    await expect(this.newLocationHint).toBeVisible();
    await expect(this.saveAndReturn).toBeVisible();
  }

  @When("the user enters over 10 characters in the Postcode box")
  async exceedPostcodeBox() {
    await this.newLocationLabel.fill("SN123456789");
    await this.saveAndReturn.click();
  }

  @When("the user enters 10 characters")
  async enter10CharPostcode() {
    await this.newLocationLabel.fill("SN12345678");
  }

  @When("the user completes their spend profile")
  async completeAllSpendProfile(table: DataTable) {
    await this.clickSetupItem("Set spend profile");
    await this.updateTableEqually(table);
    await this.markAsCompleteSave("checks");
    await this.clickSaveAndReturn();
    await this.sectionStatus("Set spend profile", "Complete");
    await this.clickSetupItem("Provide your bank details");
  }

  @When("the user uploads the bank statement and submits bank details")
  async uploadAndCompleteBankDetails() {
    await this.page.getByRole("button").filter({ hasText: "Submit bank details" }).click();
    await this.needMoreInfoPage();
    await this.page.getByRole("button").filter({ hasText: "Return to set up your project" }).click();
    await this.clickSetupItem("Provide your bank details");
    await this.uploadBankStatement();
    await this.page.getByRole("button").filter({ hasText: "Submit bank statement" }).click();
  }

  @When("the user completes their project location setup")
  async completeLocation() {
    await this.clickSetupItem("Provide your project location postcode");
    await this.enter10CharPostcode();
    await this.page.getByRole("button").filter({ hasText: "Save and return to project setup" }).click();
  }

  @Then("the participant status will show as {string}")
  async participantStatus(status: string) {
    await this.page.getByLabel("Tabs").getByRole("tab").filter({ hasText: "Participants" }).click();
    await this.sfParticipantTable.locator("th").nth(0).getByRole("link").click();
    await expect(
      this.page
        .locator(`[data-field-id="RecordAcc_ParticipantStatus__cField"]`)
        .locator("dd")
        .filter({ hasText: "Active" }),
    ).toBeVisible();
  }
  /**
   * METHODS
   */

  async emptyTable(table: DataTable) {
    const data = table.hashes();
    await this.viewForecast.forecastTableHeaders(true, true);
    let i = 0;
    for (const row of data) {
      await expect(this.trow.nth(i).locator("td").nth(0).filter({ hasText: row["Category"] })).toBeVisible();
      await expect(this.trow.nth(i).locator("td").nth(14).filter({ hasText: row["Total eligible"] })).toBeVisible();
      await expect(this.trow.nth(i).locator("td").nth(15).filter({ hasText: row["Difference"] })).toBeVisible();
      i++;
    }
    await this.checkBlankCells(table);
  }

  async checkBlankCells(table: DataTable) {
    const data = table.hashes();
    for (const row of data) {
      for (let cell = 1; cell < 13; cell++) {
        if (row["Category"] === "Overheads") {
          await expect(this.page.getByLabel(`${row["Category"]} Period ${cell}`).first()).toHaveText("£0.00");
        } else {
          await expect(this.page.getByLabel(`${row["Category"]} Period ${cell}`).first()).toHaveValue("0");
        }
      }
    }
  }

  async updateTable(table: DataTable, updateFigure: number) {
    const data = table.hashes();
    for (const row of data) {
      let inputFigure = updateFigure.toString();
      let overheads = 0.2 * updateFigure;
      let overheadsCurrency = overheads.toLocaleString("en-GB", { style: "currency", currency: "GBP" });
      for (let cell = 1; cell < 13; cell++) {
        if (row["Category"] === "Overheads") {
          await expect(this.page.getByLabel(`${row["Category"]} Period ${cell}`).first()).toHaveText(overheadsCurrency);
        } else {
          await this.page.getByLabel(`${row["Category"]} Period ${cell}`).first().fill(inputFigure);
        }
      }
    }
  }

  async bankSetupGuidancePages(uploadPage: boolean) {
    for (const item of this.statementList) {
      await expect(this.page.getByRole("list").filter({ hasText: item })).toBeVisible();
    }
    if (uploadPage) {
      await expect(this.redactedGuidance).toBeVisible();
      await expect(this.allowConfirmDetailsGuidance).toBeVisible();
      await expect(this.submitBankStatementButton).toBeVisible();
      await expect(this.returnToSetupButton).toBeVisible();
    } else {
      await expect(this.automatedCheckGuidance).toBeVisible();
      await expect(this.redactedGuidance).toBeVisible();
      await expect(this.allowConfirmDetailsGuidance).toBeVisible();
      await expect(this.statementMustShowGuidance).toBeVisible();
      await expect(this.returnToSetupButton).toBeVisible();
    }
  }
}
