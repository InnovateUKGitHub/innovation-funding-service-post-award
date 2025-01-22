import { expect, Locator, Page } from "@playwright/test";
import { Fixture, Given, Then, When } from "playwright-bdd/decorators";
import { Commands } from "../../../Commands";
import { PageHeading } from "../../../../components/PageHeading";
import { DataTable } from "playwright-bdd";
import { Validators } from "../../../validators";
import { UploadType } from "../../../../typings/files";
import { getLorem } from "../../../../components/lorem";
import { AccNavigation } from "../../AccNavigation";

export
@Fixture("crdClaims")
class CrdClaims {
  protected readonly page: Page;
  protected readonly commands: Commands;
  protected readonly validators: Validators;
  protected readonly accNavigation: AccNavigation;
  private readonly backToProject: Locator;
  private readonly pageTitle: PageHeading;
  private readonly guidanceCopyStart: string;
  private readonly guidanceCopyLink: Locator;
  private readonly guidanceCopyEnd: string;
  private readonly dashboardGuidance: Locator;
  private readonly openHeading: Locator;
  private readonly closedHeading: Locator;
  private readonly noClosedClaims: Locator;
  private readonly openClaimsTable: Locator;
  private readonly costsToBeClaimedHeading: PageHeading;
  private readonly backToClaims: Locator;
  private readonly period1Subheading: Locator;
  private readonly costsClaimedTable: Locator;
  private readonly statusAndCommentsLog: Locator;
  private readonly statusLogShow: Locator;
  private readonly statusLogHide: Locator;
  private readonly logEntry: Locator;
  private readonly continueToClaimsDocs: Locator;
  private readonly saveAndReturnButton: Locator;
  private readonly evidenceDocs: Array<UploadType>;
  //Claim line items
  private readonly backToClaim: Locator;
  private readonly claimLineWarning: Locator;
  private readonly claimLineGuidance: Locator;
  private readonly claimCurrencyGuidance: Locator;
  private readonly supportingDocsHeading: Locator;
  private readonly supportingDocsGuidance: Locator;
  private readonly uploadRemoveDocsButton: Locator;
  private readonly filesUploadedHeading: Locator;
  private readonly noDocsUploaded: Locator;
  private readonly additionalInfoSubheading: Locator;
  private readonly additionalInfoHint: Locator;
  private readonly textbox: Locator;
  private readonly charRemaining32k: Locator;
  private readonly addCostButton: Locator;
  private readonly firstLineItemDescription: Locator;
  private readonly firstLineItemCost: Locator;
  private readonly lineItemCost: number;
  private readonly lineItemCostGbp: string;
  private readonly lineItemTotal: Locator;
  private readonly emptyDescriptionValMsg: string;
  private readonly emptyCostValMsg: string;
  private readonly lineItemDescription1: string;
  //Costcat documents page
  private readonly costCatDocGuidance: Locator;
  private readonly uploadSubheading: Locator;
  private readonly filesUploadedTable: Locator;
  private readonly costCatFileTable: Array<[string, string]>;
  //Claim documents page
  private readonly claimDocsHeading: PageHeading;
  private readonly backToCosts: Locator;
  private readonly mainIarText: Locator;
  private readonly uploadIarText: Locator;
  private readonly docTypeSelector: Locator;
  private readonly docTypeList: Array<string>;
  private readonly claimDocTable: Locator;
  private readonly continueForecastButton: Locator;
  //Forecast page
  private readonly updateForecastHeading: PageHeading;
  private readonly backToDocumentsLink: Locator;
  private readonly lastChancePeriod2: string;
  private readonly overHeadsCostsRate: Locator;
  private readonly changesLastSaved: Locator;
  private readonly continueToSummaryButton: Locator;
  private readonly backToUpdateForecast: Locator;
  private readonly invalidForecastData: Array<[string, string]>;
  private readonly forecastCostsWarningQa: Locator;
  private readonly forecastCostsWarningMessage: Locator;
  private readonly forecastCostsWarningListItem: Locator;
  private readonly forecastWarningMoStatement: Locator;
  //Summary page
  private readonly claimSummaryTitle: PageHeading;
  private readonly costsToBeClaimedSubheading: Locator;
  private readonly costsClaimedListing: Array<[string, string]>;
  private readonly costsClaimedQaTags: Array<string>;
  private readonly editCostsClaimedLink: Locator;
  private readonly claimDocumentsSubheading: Locator;
  private readonly docsUploadedGuidance: Locator;
  private readonly searchBox: Locator;
  private readonly docTableHeaders: Array<string>;
  private readonly editClaimDocsLink: Locator;
  private readonly forecastSubheading: Locator;
  private readonly forecastListings: Array<[string, string]>;
  private readonly summaryForecastsQaTags: Array<string>;
  private readonly editForecastLink: Locator;
  private readonly addCommentsSubheading: Locator;
  private readonly hintForComments: Locator;
  private readonly comments1000CharRemaining: Locator;
  private readonly claimConfirmationStatement: Locator;
  private readonly claimSubmitButton: Locator;
  private readonly iarValidationMessage: string;
  private readonly summaryCharValidation: string;
  private readonly commentForMo: string;
  //MSP review
  private readonly claimHeading: PageHeading;
  private readonly competitionName: Locator;
  private readonly competitionType: Locator;
  private readonly hedgesClaimForPeriodHeading: Locator;
  private readonly partnerOneClosedClaimMsg: Locator;
  private readonly partnerTwoClosedClaimMsg: Locator;
  private readonly statusChangeTable: Locator;
  private readonly moDocTable: Locator;
  private readonly moUploadDocCopy: Locator;
  private readonly moDocCopy: Locator;
  private readonly howToProceed: Locator;
  private readonly queryOption: Locator;
  private readonly submitOption: Locator;
  private readonly sendQueryButton: Locator;
  private readonly submitButton: Locator;
  private readonly moSubmitGuidance: Locator;
  private readonly moSatisfiedCopy: Locator;
  private readonly moMustSubmitReport: Locator;
  private readonly commentForIUK: string;

  constructor({
    page,
    commands,
    validators,
    accNavigation,
  }: {
    page: Page;
    commands: Commands;
    validators: Validators;
    accNavigation: AccNavigation;
  }) {
    this.page = page;
    this.commands = commands;
    this.validators = validators;
    this.accNavigation = accNavigation;
    this.backToProject = this.commands.backLink("Back to project");
    this.pageTitle = PageHeading.fromTitle(this.page, "Claims");
    this.guidanceCopyStart =
      "All partners in this project must upload evidence for each expenditure with every claim made. These might include invoices, timesheets, receipts or spreadsheets for capital usage. This is part of Innovate UK's obligations under the ";
    this.guidanceCopyLink = this.page
      .getByRole("link")
      .filter({ hasText: "Managing Public Money government handbook" });
    this.guidanceCopyEnd = " in relation to assurance, financial management and control.";
    this.dashboardGuidance = this.page.getByTestId("guidance-message-content");
    this.openHeading = this.page.getByRole("heading").filter({ hasText: "Open" });
    this.closedHeading = this.page.getByRole("heading").filter({ hasText: "Closed" });
    this.noClosedClaims = this.page
      .getByRole("paragraph")
      .filter({ hasText: "There are no closed claims for this partner." });
    this.openClaimsTable = this.page.getByRole("table").first();
    this.costsToBeClaimedHeading = PageHeading.fromTitle(this.page, "Costs to be claimed");
    this.backToClaims = this.commands.backLink("Back to claims");
    this.period1Subheading = this.page.getByRole("heading").filter({ hasText: "Period 1:" });
    this.costsClaimedTable = this.page.getByRole("table").first();
    this.statusAndCommentsLog = this.page.getByRole("button").filter({ hasText: "Status and comments log" });
    this.statusLogShow = this.page.getByTestId("status-and-comments-log").getByText("Show");
    this.statusLogHide = this.page.getByTestId("status-and-comments-log").getByText("Hide");
    this.logEntry = this.page.getByTestId("status-and-comments-log").getByRole("paragraph");
    this.continueToClaimsDocs = this.page.getByRole("button").filter({ hasText: "Continue to claims documents" });
    this.saveAndReturnButton = this.page.getByRole("button").filter({ hasText: "Save and return to claims" });
    this.evidenceDocs = [
      "testfile.doc",
      "testfile.csv",
      "testfile.odp",
      "testfile.odt",
      "testfile.pdf",
      "testfile.ppt",
      "testfile.rtf",
      "testfile.txt",
      "testfile.xlsx",
      "testfile.xps",
      "T.doc",
    ];
    //Claim line items
    this.backToClaim = this.commands.backLink("Back to claim");
    this.claimLineWarning = this.page.getByTestId("claim-warning-content").filter({
      hasText:
        "You can only remove claim line items you created. For other claim line items you want to remove, set the value to zero and save.",
    });
    this.claimLineGuidance = this.page.getByTestId("guidance-message").filter({
      hasText:
        "You must break down your total costs and upload evidence for each expenditure you are claiming for. Contact your monitoring officer for more information about the level of detail you are required to provide.",
    });
    this.claimCurrencyGuidance = this.page.getByTestId("guidance-currency-message").filter({
      hasText:
        "You can enter up to 120 separate lines of costs and you must convert any foreign currency amounts to pounds sterling (GBP) before you enter them into your claim.",
    });
    this.supportingDocsHeading = this.page.getByRole("heading").filter({ hasText: "Supporting documents" });
    this.supportingDocsGuidance = this.page.getByRole("paragraph").filter({
      hasText:
        "Upload evidence of the costs for your monitoring officer to review. If you do not upload documents your monitoring officer is unlikely to accept your claim. Contact them for advice on which documents to provide.",
    });
    this.uploadRemoveDocsButton = this.page.getByRole("button").filter({ hasText: "Upload and remove documents" });
    this.filesUploadedHeading = this.page.getByRole("heading").filter({ hasText: "Files uploaded" });
    this.noDocsUploaded = this.page.getByRole("paragraph").filter({ hasText: "No documents uploaded." });
    this.additionalInfoSubheading = this.page.locator("legend").filter({ hasText: "Additional information" });
    this.additionalInfoHint = this.page.locator("#hint-for-explanation").filter({
      hasText:
        "Explain any difference between the forecast costs and the total costs, and what actions are you taking because of this. For example updating the project plan or financial forecast.",
    });
    this.textbox = this.page.getByRole("textbox");
    this.charRemaining32k = this.page.getByRole("paragraph").filter({ hasText: "You have 32768 characters remaining" });
    this.addCostButton = this.page.getByRole("button").filter({ hasText: "Add a cost" });
    this.firstLineItemDescription = this.page
      .getByRole("table")
      .locator("tbody")
      .getByLabel("Description of claim line item 0");
    this.firstLineItemCost = this.page.getByRole("table").locator("tbody").getByLabel("Cost of claim line item 0");
    this.lineItemCost = 1666.23;
    this.lineItemCostGbp = this.lineItemCost.toLocaleString("EN-GB", { style: "currency", currency: "GBP" });
    this.lineItemTotal = this.page.getByRole("table").locator("tfoot").locator("tr").nth(1).locator("td");
    this.emptyDescriptionValMsg = "Enter description.";
    this.emptyCostValMsg = "Enter cost.";
    this.lineItemDescription1 = "Line item 1";
    //Costcat documents
    this.costCatDocGuidance = this.page.getByRole("paragraph").filter({
      hasText:
        "Evidence for each expenditure might include, but is not limited to, invoices, timesheets, receipts and spreadsheets for capital usage.",
    });
    this.uploadSubheading = this.page.getByRole("heading").filter({ hasText: /^Upload$/ });
    this.filesUploadedTable = this.page.getByTestId("supporting-documents-section").getByRole("table");
    this.costCatFileTable = [
      ["File name", this.evidenceDocs[0]],
      ["Type", "Claim evidence"],
      ["Date uploaded", this.commands.dateToday(false)],
      ["Size", "0KB"],
      ["Uploaded by", "Main Finance Contact"],
    ];
    //Claim documents page
    this.claimDocsHeading = PageHeading.fromTitle(this.page, "Claim documents");
    this.backToCosts = this.commands.backLink("Back to costs to be claimed");
    this.mainIarText = this.page.getByRole("paragraph").filter({
      hasText:
        "An Independent Accountant's Report (IAR) must be uploaded to support the claim before it can be submitted to Innovate UK. If your total grant value is £50,000 or under, a Statement of Expenditure (SoE) may be sufficient. Your monitoring officer will be able to confirm which document is needed.",
    });
    this.uploadIarText = this.page.getByRole("paragraph").filter({
      hasText:
        "Upload your IAR or SoE in the claim documents, selecting the IAR document type (for both) and then proceed to submit your claim.",
    });
    this.docTypeSelector = this.page.getByLabel("Type");
    this.docTypeList = [
      "Invoice",
      "Independent accountant’s report",
      "Claim evidence",
      "Statement of expenditure",
      "LMC documents",
      "Schedule 3",
    ];
    this.claimDocTable = this.page.getByTestId("claim-documents-container").locator("table");
    this.continueForecastButton = this.page.getByRole("button").filter({ hasText: "Continue to update forecast" });
    //Forecast page
    this.updateForecastHeading = PageHeading.fromTitle(this.page, "Update forecast");
    this.backToDocumentsLink = this.commands.backLink("Back to claims documents");
    this.lastChancePeriod2 = "This is your last chance to change the forecast for period 2.";
    this.overHeadsCostsRate = this.page.getByRole("paragraph").filter({ hasText: "Overheads costs: 20.00%" });
    this.changesLastSaved = this.page
      .getByRole("paragraph")
      .filter({ hasText: `Changes last saved: ${this.commands.dateToday(true)}` });
    this.continueToSummaryButton = this.page.getByRole("button").filter({ hasText: "Continue to summary" });
    this.backToUpdateForecast = this.commands.backLink("Back to update forecast");
    this.invalidForecastData = [
      ["", "Enter forecast."],
      ["10000000", "Your overall total cannot be higher than your total eligible costs."],
      ["-10000000000", "Forecast must be -£1,000,000,000.00 or more."],
      ["1000000000000", "Forecast must be £999,999,999,999.00 or less."],
    ];
    this.forecastCostsWarningQa = this.page.getByTestId("forecasts-warning-fc-content");
    this.forecastCostsWarningMessage = this.forecastCostsWarningQa.filter({
      hasText: "The amount you are requesting is more than the agreed costs for:",
    });
    this.forecastCostsWarningListItem = this.forecastCostsWarningQa.locator("ul").locator("li");
    this.forecastWarningMoStatement = this.forecastCostsWarningQa.filter({
      hasText: "Your Monitoring Officer will let you know if they have any concerns.",
    });
    //Summary page
    this.claimSummaryTitle = PageHeading.fromTitle(this.page, "Claim summary");
    this.costsToBeClaimedSubheading = this.page.getByRole("heading").filter({ hasText: "Costs to be claimed" });
    this.costsClaimedQaTags = ["totalCostsClaimed", "fundingLevel", "totalCostsPaid"];
    this.costsClaimedListing = [
      ["Total costs to be claimed", "£16,995.55"],
      ["Funding level", "50.00%"],
      ["Total costs to be paid", "£8,497.77"],
    ];
    this.editCostsClaimedLink = this.page.getByRole("link").filter({ hasText: "Edit costs to be claimed" });
    this.claimDocumentsSubheading = this.page.getByRole("heading").filter({ hasText: "Claim documents" });
    this.docsUploadedGuidance = this.page
      .getByRole("paragraph")
      .filter({ hasText: "All documents uploaded will be shown here. All documents open in a new window." });
    this.searchBox = this.page.locator("#filter-item");
    this.docTableHeaders = ["File name", "Type", "Date uploaded", "Size", "Uploaded by"];
    this.editClaimDocsLink = this.page.getByRole("link").filter({ hasText: "Edit claim documents" });
    this.forecastSubheading = this.page.getByRole("heading").filter({ hasText: "Forecast" });
    this.forecastListings = [
      ["Total eligible costs", "£79,560,000.00"],
      ["Total of forecasts and costs", "£79,559,999.59"],
      ["Difference", "£0.41 (0.00%)"],
    ];
    this.summaryForecastsQaTags = ["totalEligibleCosts", "totalForecastsAndCosts", "differenceEligibleAndForecast"];
    this.editForecastLink = this.page.getByRole("link").filter({ hasText: "Edit forecast" });
    this.addCommentsSubheading = this.page.locator("legend").filter({ hasText: "Add comments" });
    this.hintForComments = this.page.locator("#hint-for-comments").filter({
      hasText: "If you want to explain anything to your monitoring officer or to Innovate UK, add it here.",
    });
    this.comments1000CharRemaining = this.page
      .getByRole("paragraph")
      .filter({ hasText: "You have 1000 characters remaining" });
    this.claimConfirmationStatement = this.page.getByRole("paragraph").filter({
      hasText:
        "I confirm that the information I have provided in this claim is correct, complete and contains only eligible costs on an actual basis, which we confirm have been incurred and defrayed. I understand and accept that if I knowingly withhold information, or provide false or misleading information, this may result in my claim being rejected, termination of the contract, recovery of ineligible claims, civil action and where there is evidence of fraud, criminal prosecution.",
    });
    this.claimSubmitButton = this.page.getByRole("button").filter({ hasText: "Submit claim" });
    this.iarValidationMessage = "You must upload an independent accountant's report before you can submit this claim.";
    this.summaryCharValidation = "Comments must be 1000 characters or less.";
    this.commentForMo = "This is a comment for the Monitoring Officer.";
    //MSP Review
    this.claimHeading = PageHeading.fromTitle(this.page, "Claim");
    this.competitionName = this.page.getByText("Competition name");
    this.competitionType = this.page.getByText("Competition type");
    this.hedgesClaimForPeriodHeading = this.page
      .getByRole("heading")
      .filter({ hasText: "Hedge's Primary Ltd. claim for period" });
    this.partnerOneClosedClaimMsg = this.page
      .locator("//div[4]//div[2]//div[2]")
      .locator("p")
      .nth(0)
      .filter({ hasText: "There are no closed claims for this partner." });
    this.partnerTwoClosedClaimMsg = this.page
      .locator("//div[4]//div[2]//div[3]")
      .locator("p")
      .nth(0)
      .filter({ hasText: "There are no closed claims for this partner." });
    this.statusChangeTable = this.page.getByTestId("claim-status-change-table").locator("table");
    this.moDocTable = this.page.getByTestId("claim-documents-container").getByRole("table");
    this.moUploadDocCopy = this.page
      .getByRole("paragraph")
      .filter({ hasText: "You can upload and store any documents for this claim on this page." });
    this.moDocCopy = this.page.getByRole("paragraph").filter({
      hasText: "You will also be able to see any documents added to the claim by the finance contact and Innovate UK.",
    });
    this.howToProceed = this.page.locator("legend").filter({ hasText: "How do you want to proceed with this claim?" });
    this.queryOption = this.page.getByLabel("Query claim");
    this.submitOption = this.page.getByLabel("Submit for approval");
    this.sendQueryButton = this.page.getByRole("button").filter({ hasText: "Send query" });
    this.submitButton = this.page.getByRole("button").filter({ hasText: "Submit" });
    this.moSubmitGuidance = this.page.getByTestId("hint-comments").filter({
      hasText:
        "If you query the claim, you must explain what the partner needs to amend. If you approve the claim, you may add a comment to Innovate UK in support of the claim.",
    });
    this.moSatisfiedCopy = this.page.getByRole("paragraph").filter({
      hasText:
        "I am satisfied that the costs claimed appear to comply with the terms and conditions of the awarded grant and eligible costs agreed by the Innovate UK Project Finance Team. This is based on sample checks of the project's financial information, plus evidence provided both in reports and at the quarterly review meeting (QRM).",
    });
    this.moMustSubmitReport = this.page.getByRole("paragraph").filter({
      hasText: "You must submit a monitoring report for this period before the approved claim can be paid.",
    });
    this.commentForIUK = "This is a comment for Innovate UK.";
  }

  @Given("the FC is on the Claims dashboard")
  async fcClaimsDashboard(table: DataTable) {
    await this.claimDashboard(table, true);
  }

  @Given("the MSP is on the Claims dashboard")
  async mspClaimsDashboard(table: DataTable) {
    await this.claimDashboard(table, false);
  }

  @Given("the user will see the Claims dashboard heading")
  async onClaimsDash() {
    await this.pageTitle.isVisible();
  }

  @When("the user clicks {string} on the claim line")
  async accessClaim(buttonName: string) {
    await this.openClaimsTable.locator("css=td").nth(6).getByRole("link").filter({ hasText: buttonName }).click();
  }

  @Then("the user will see the Costs to be claimed page")
  async costsToBeClaimedPage(table: DataTable) {
    await this.costsToBeClaimedHeading.isVisible();
    await expect(this.backToClaims).toBeVisible();
    await expect(this.period1Subheading).toBeVisible();
    await expect(this.statusAndCommentsLog).toBeVisible();
    await expect(this.statusAndCommentsLog).toHaveAttribute("aria-expanded", "false");
    await expect(this.statusLogShow).toBeVisible();
    await this.statusAndCommentsLog.click();
    await expect(this.statusLogHide).toBeVisible();
    await expect(this.statusAndCommentsLog).toHaveAttribute("aria-expanded", "true");
    await expect(this.logEntry).toHaveText("There are no changes.");
    await expect(this.continueToClaimsDocs).toBeVisible();
    await expect(this.saveAndReturnButton).toBeVisible();
    await this.costCatClaimTable(table, false);
  }

  @Then("the user will see the Costs claimed")
  async mspCostsClaimedPage(table: DataTable) {
    await this.claimHeading.isVisible();
    await expect(this.backToClaims).toBeVisible();
    await expect(this.competitionName).toBeVisible();
    await expect(this.competitionType).toBeVisible();
    await expect(this.hedgesClaimForPeriodHeading).toBeVisible();
    await this.costCatClaimTable(table, true);
  }

  @Given("the user has accessed the Costs to be claimed page")
  async accessCostsToClaim() {
    await this.accNavigation.gotoClaimsPage();
    await this.accessClaim("Edit");
    await this.costsToBeClaimedHeading.isVisible();
  }

  @When("the user clicks the {string} cost category")
  async clickCostCategory(costCat: string, rowNum?: number) {
    if (rowNum) {
      await this.page.locator("tbody").locator("tr").nth(rowNum).getByRole("link").filter({ hasText: costCat }).click();
    } else {
      await this.page.getByRole("link").filter({ hasText: costCat }).click();
    }
    await expect(this.page.getByRole("heading").filter({ hasText: costCat })).toBeVisible();
  }

  @Then("the {string} costs page is displayed")
  async costCategoryPageDisplayed(costCat: string, rowAccess: number) {
    await expect(this.backToClaim).toBeVisible();
    await expect(this.page.getByRole("heading").filter({ hasText: costCat })).toBeVisible();
    await expect(this.claimLineWarning).toBeVisible();
    await expect(this.claimLineGuidance).toBeVisible();
    await expect(this.claimCurrencyGuidance).toBeVisible();
    await this.emptyLineItemTable();
    await expect(this.supportingDocsHeading).toBeVisible();
    await expect(this.supportingDocsGuidance).toBeVisible();
    await expect(this.uploadRemoveDocsButton).toBeVisible();
    await expect(this.filesUploadedHeading).toBeVisible();
    await expect(this.noDocsUploaded).toBeVisible();
    await expect(this.additionalInfoSubheading).toBeVisible();
    await expect(this.additionalInfoHint).toBeVisible();
    await expect(this.textbox).toBeVisible();
    await expect(this.charRemaining32k).toBeVisible();
    await expect(this.saveAndReturnButton).toBeVisible();
    await this.validators.textValidation("Comments", 32768, "Save and return to claims", true);
    await this.clickCostCategory(costCat, rowAccess);
    await expect(this.page.getByRole("heading").filter({ hasText: costCat })).toBeVisible();
    await this.textbox.fill(`Comments for ${costCat}`);
  }

  @When("the user adds line items for {string}")
  async addValidateLineItem(costcat: string, rowNum: number, noValidation?: boolean) {
    await this.addCostButton.click();
    if (noValidation) {
      await expect(this.firstLineItemDescription).toBeVisible();
    } else {
      await this.validateLineItem(costcat, rowNum);
    }
    await this.firstLineItemDescription.fill(this.lineItemDescription1);
    await this.firstLineItemCost.fill(String(this.lineItemCost));
    await expect(this.lineItemTotal.filter({ hasText: this.lineItemCostGbp })).toHaveText(String(this.lineItemCostGbp));
  }

  @Then("uploads evidence for {string}")
  async uploadLineEvidence(costcat: string) {
    await this.uploadRemoveDocsButton.click();
    await PageHeading.fromTitle(this.page, `${costcat} documents`).isVisible();
    await expect(this.costCatDocGuidance).toBeVisible();
    await expect(this.uploadSubheading).toBeVisible();
    await this.validators.testFileComponent(costcat, costcat, "Upload and remove documents", false, false);
    await this.commands.fileInput([this.evidenceDocs[0]]);
    await this.commands.validationNotification("Your document has been uploaded.");
    await this.commands.backLink(`Back to ${costcat}`).click();
    await expect(this.page.getByRole("heading").filter({ hasText: costcat })).toBeVisible();
    let i = 0;
    for (const [header, cell] of this.costCatFileTable) {
      await expect(this.filesUploadedTable.locator("thead").locator("th").nth(i)).toHaveText(header);
      await expect(this.filesUploadedTable.locator("tbody").locator("td").nth(i)).toHaveText(cell);
      i++;
    }
    await expect(this.firstLineItemDescription).toHaveValue(this.lineItemDescription1);
    await expect(this.firstLineItemCost).toHaveValue(String(this.lineItemCost));
    await this.saveAndReturnButton.click();
  }

  @When("the user updates the remaining cost categories")
  async updateRemainingCostCats(table: DataTable) {
    const data = table.hashes();
    let row = 2;
    let docNumber = 1;
    for (const cat of data) {
      await this.clickCostCategory(cat["Category"], row);
      await this.costCategoryPageDisplayed(cat["Category"], row);
      await this.addValidateLineItem(cat["Category"], row);
      await this.lineItemDocPageAssertion(cat["Category"], docNumber);
      await this.saveAndReturnButton.click();
      await this.costsToBeClaimedHeading.isVisible();
      row++;
      docNumber++;
    }
  }

  @When("the user accesses the Claim documents page")
  async accessClaimsDocsPage() {
    await this.continueToClaimsDocs.click();
    await this.claimDocsHeading.isVisible();
  }

  @Then("the user will see the Claim documents page")
  async claimsDocumentsPage() {
    await this.claimDocsHeading.isVisible();
    await expect(this.backToCosts).toBeVisible();
    await expect(this.mainIarText).toBeVisible();
    await expect(this.uploadIarText).toBeVisible();
    await expect(this.continueForecastButton).toBeVisible();
    await expect(this.saveAndReturnButton).toBeVisible();
    // await this.validators.testFileComponent(
    //   "costs to be claimed",
    //   "Costs to be claimed",
    //   "Continue to claims documents",
    //   false,
    //   false,
    //   "",
    //   "Claim evidence",
    // );
    for (const type of this.docTypeList) {
      await this.docTypeSelector.selectOption(type);
    }
    await this.uploadInvoice();
  }

  @Given("the user has accessed the Update forecast page")
  async accessUpdateForecastPage() {
    await this.accNavigation.gotoClaimsPage();
    await this.accessClaim("Edit");
    await this.costsToBeClaimedHeading.isVisible();
    await this.continueToClaimsDocs.click();
    await this.claimDocsHeading.isVisible();
    await this.continueForecastButton.click();
    await this.updateForecastHeading.isVisible();
    await expect(this.backToDocumentsLink).toBeVisible();
    await this.commands.validationNotification(this.lastChancePeriod2);
    await expect(this.overHeadsCostsRate).toBeVisible();
    await expect(this.changesLastSaved).toBeVisible();
    await expect(this.continueToSummaryButton).toBeVisible();
    await expect(this.saveAndReturnButton).toBeVisible();
  }

  @Given("the user has accessed the Claim summary page")
  async accessClaimSummaryPage() {
    await this.accessUpdateForecastPage();
    await this.continueToSummaryButton.click();
    await this.claimSummaryTitle.isVisible();
  }

  @When("the user enters invalid information")
  async validateForecastTable() {
    const labour2 = this.page.getByLabel(`Labour period 2`);
    for (const [data, message] of this.invalidForecastData) {
      await labour2.fill(data);
      await this.continueToSummaryButton.click();
      await this.commands.validationLink(message);
    }
    await labour2.fill("2000000");
    await expect(this.forecastCostsWarningMessage).toBeVisible();
    await expect(this.forecastCostsWarningListItem.filter({ hasText: "labour" })).toBeVisible();
    await expect(this.forecastCostsWarningListItem.filter({ hasText: "overheads" })).toBeVisible();
    await expect(this.forecastWarningMoStatement).toBeVisible();
    await labour2.fill("");
  }

  @Then("the user will be advised of correct entries")
  async validationMessageOnscreen() {
    await this.commands.validationLink("Enter forecast.");
  }

  @When("the user updates and saves the forecast table")
  async updateForecastTable(table: DataTable) {
    await this.completeForecastTable(table, true);
  }

  @Then("the figures accurately reflect the changes")
  async forecastTableUpdated(table: DataTable) {
    await this.completeForecastTable(table, false);
  }

  @When("the user clicks Continue to summary")
  async continueToSummary() {
    await this.continueToSummaryButton.click();
    await this.claimSummaryTitle.isVisible();
  }

  @Then("the user will see the Claim summary page")
  async claimSummaryPage(table: DataTable) {
    await this.claimSummaryTitle.isVisible();
    await expect(this.period1Subheading).toBeVisible();
    await expect(this.costsToBeClaimedSubheading).toBeVisible();
    let i = 0;
    for (const [key, item] of this.costsClaimedListing) {
      await this.commands.getListItemFromKey(key, item, true, false, this.costsClaimedQaTags[i]);
      i++;
    }
    await expect(this.editCostsClaimedLink).toBeVisible();
    await expect(this.claimDocumentsSubheading).toBeVisible();
    await expect(this.docsUploadedGuidance).toBeVisible();
    await expect(this.searchBox).toBeVisible();
    await this.summaryDocTable(table);
    await expect(this.editClaimDocsLink).toBeVisible();
    await expect(this.forecastSubheading).toBeVisible();
    let ii = 0;
    for (const [key, item] of this.forecastListings) {
      await this.commands.getListItemFromKey(key, item, true, false, this.summaryForecastsQaTags[ii]);
      ii++;
    }
    await expect(this.editForecastLink).toBeVisible();
    await expect(this.addCommentsSubheading).toBeVisible();
    await expect(this.hintForComments).toBeVisible();
    await expect(this.comments1000CharRemaining).toBeVisible();
    await expect(this.claimConfirmationStatement).toBeVisible();
    await expect(this.saveAndReturnButton).toBeVisible();
    await expect(this.claimSubmitButton).toBeVisible();
  }

  @When("the user attempts to submit the claim")
  async submitClaim() {
    await this.claimSubmitButton.click();
  }

  @Then("an IAR validation message is displayed")
  async iarIsRequired() {
    await this.commands.validationLink(this.iarValidationMessage);
  }

  @When("the user enters over 1000 characters in the Comments box")
  async summaryPageTextValidation() {
    let lorem = getLorem(1000);
    await this.textbox.fill(lorem);
    await this.textbox.press("End");
    await this.textbox.press("t");
    await this.commands.paragraph("You have 1 character too many");
    await this.claimSubmitButton.click();
  }

  @Then("the user will see a validation message advising of character limit")
  async summaryCharactersExceeded() {
    await this.commands.validationLink(this.summaryCharValidation);
    await this.textbox.press("End");
    await this.textbox.press("Backspace");
    await this.commands.paragraph("You have 0 characters remaining");
    await expect(this.page.getByTestId("validation-summary")).not.toContainText(
      "Comments must be 1000 characters or less.",
    );
  }

  @When("the user clicks the different links on the Summary page")
  async navigateSummaryLinks(table: DataTable) {
    let data = table.hashes();
    for (const row of data) {
      await this.page.getByRole("link").filter({ hasText: row["Link"] }).click();
      await expect(this.page.getByRole("heading").filter({ hasText: row["Page heading"] })).toHaveText(
        row["Page heading"],
      );
      await this.saveAndReturnButton.click();
      await expect(this.page.getByRole("heading").filter({ hasText: "Claims" })).toBeVisible();
      await this.clickEditAccessSummary();
    }
  }

  @Then("the correct page heading will be displayed")
  async correctPageHeading() {
    await this.claimSummaryTitle.isVisible();
  }

  @Given("the user has accessed the claim documents page")
  async accessClaimDocsPage() {
    await this.accessCostsToClaim();
    await this.continueToClaimsDocs.click();
    await this.claimDocsHeading.isVisible();
  }

  @When("the user uploads an Independent Accountant's Report")
  async uploadIar() {
    await this.docTypeSelector.selectOption(this.docTypeList[1]);
    await this.commands.fileInput(["IAR.doc"]);
    await this.commands.validationNotification("Your document has been uploaded.");
    await expect(this.claimDocTable.locator("td").filter({ hasText: "IAR.doc" })).toBeVisible();
  }

  @Then("the user submits the Claim")
  async submitTheClaim() {
    await this.continueForecastButton.click();
    await this.updateForecastHeading.isVisible();
    await this.continueToSummaryButton.click();
    await this.claimSummaryTitle.isVisible();
    await this.textbox.fill(this.commentForMo);
    await this.claimSubmitButton.click();
  }

  @Then("the claim will have the status {string}")
  async claimStatusIs(status: string) {
    await expect(this.openClaimsTable.locator("tr").nth(1).locator("td").nth(4)).toHaveText(status);
  }

  @When("the user clicks the {string} accordion")
  async clickForecastAccordion(buttonName: string) {
    const button = this.page.getByRole("button").filter({ hasText: buttonName });
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
  }

  @Then("the user can see the view-only Forecast table")
  async viewForecastTable(table: DataTable) {
    await this.completeForecastTable(table, false, "#ifspa-forecast-table");
  }

  @Then("the user can see the status log")
  async viewStatusLog() {
    let table = [
      ["Date and time", this.commands.dateToday(false)],
      ["Status update", "Submitted to Monitoring Officer"],
      ["Created by", "Main Finance Contact"],
    ];
    let i = 0;
    for (const [header, cell] of table) {
      await expect(this.statusChangeTable.locator("th").nth(i)).toHaveText(header);
      await expect(this.statusChangeTable.locator("tbody").locator("tr").nth(0)).toContainText(cell);
      i++;
    }
    await expect(this.statusChangeTable.locator("tbody").locator("tr").nth(1).locator("td")).toHaveText(
      this.commentForMo,
    );
  }

  @Then("the user can see the MO documents table")
  async viewMoDocTable(table: DataTable) {
    await expect(this.moUploadDocCopy).toBeVisible();
    await expect(this.moDocCopy).toBeVisible();
    await this.commands.learnFiles();
    for (const type of this.docTypeList) {
      await this.docTypeSelector.selectOption(type);
    }
    await this.validators.docTypeDropdown("Statement of expenditure");
    await this.commands.fileInput(["MoDoc.doc"]);
    await this.commands.validationNotification("Your document has been uploaded.");
    await this.summaryDocTable(table, "claim-documents-container");
  }

  @When("the user selects the {string} option")
  async submitForApproval(option: string) {
    await expect(this.howToProceed).toBeVisible();
    await expect(this.queryOption).toBeVisible();
    await expect(this.submitOption).toBeVisible();
    await expect(this.additionalInfoSubheading).not.toBeVisible();
    await this.page.getByLabel(option).click();
    if (option === "Query claim") {
      await expect(this.sendQueryButton).toBeVisible();
      await expect(this.submitButton).not.toBeVisible();
    } else {
      await expect(this.submitButton).toBeVisible();
      await expect(this.sendQueryButton).not.toBeVisible();
    }
    await expect(this.moSubmitGuidance).toBeVisible();
    await expect(this.page.locator("#comments")).toBeVisible();
    await expect(this.moSatisfiedCopy).toBeVisible();
    await expect(this.moMustSubmitReport).toBeVisible();
  }

  @Then("submits the claim to Innovate UK")
  async submitClaimToIUK() {
    await this.page.locator("#comments").fill(this.commentForIUK);
    await this.submitButton.click();
  }

  /**
   * METHODS
   */
  async claimDashboard(table: DataTable, fc: boolean) {
    await this.accNavigation.gotoClaimsPage();
    const data = table.hashes();
    await expect(this.backToProject).toBeVisible();
    await this.pageTitle.isVisible();
    if (fc) {
      let copyList = [this.guidanceCopyStart, this.guidanceCopyEnd];
      for (const copy of copyList) {
        await expect(this.dashboardGuidance.filter({ hasText: copy })).toBeVisible();
      }
      await expect(this.dashboardGuidance.filter({ has: this.guidanceCopyLink })).toBeVisible();
    }
    await expect(this.openHeading).toHaveText("Open");
    await expect(this.closedHeading).toHaveText("Closed");
    if (fc) {
      await expect(this.noClosedClaims).toBeVisible();
    } else {
      await expect(this.page.getByRole("button").filter({ hasText: "Show all sections" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
      await this.page.getByRole("button").filter({ hasText: "Show all sections" }).click();
      await expect(this.page.getByRole("button").filter({ hasText: "Hide all sections" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      await expect(this.partnerOneClosedClaimMsg).toBeVisible();
      await expect(this.partnerTwoClosedClaimMsg).toBeVisible();
    }
    let headers: Array<string>;
    if (fc) {
      headers = [
        "Period",
        "Forecast costs for period",
        "Actual costs for period",
        "Difference",
        "Status",
        "Date of last update",
      ];
    } else {
      headers = [
        "Partner",
        "Forecast costs for period",
        "Actual costs for period",
        "Difference",
        "Status",
        "Date of last update",
      ];
    }
    let i = 0;
    for (const cell of headers) {
      await expect(this.openClaimsTable.locator("th").nth(i).filter({ hasText: cell })).toBeVisible();
      await expect(this.openClaimsTable.locator("td").nth(i).filter({ hasText: data[cell] })).toBeVisible();
      i++;
    }
    await expect(
      this.openClaimsTable
        .locator("td")
        .nth(5)
        .filter({ hasText: this.commands.dateToday(false) }),
    ).toBeVisible();
  }

  async costCatClaimTable(table: DataTable, msp: boolean) {
    const data = table.hashes();
    let headers: Array<string>;
    if (msp) {
      headers = ["Category", "Forecast for period", "Costs claimed this period", "Difference £", "Difference %"];
    } else {
      headers = [
        "Category",
        "Total eligible costs",
        "Eligible costs claimed to date",
        "Costs claimed this period",
        "Remaining eligible costs",
      ];
    }
    let i = 1;
    for (const row of data) {
      for (let col = 0; col < 5; col++) {
        await expect(
          this.costsClaimedTable.locator("tr").nth(i).locator("td").nth(col).filter({ hasText: row[headers[col]] }),
        ).toHaveText(row[headers[col]]);
      }
      i++;
    }
  }

  async emptyLineItemTable() {
    const headers = ["Description", "Cost", "Last updated"];
    const footers = ["Total costs", "Forecast costs", "Difference"];
    const costs = ["£0.00", "£100,000.00", "-100.00%"];
    await expect(this.page.getByRole("table").locator("tfoot").locator("tr").nth(0).getByRole("button")).toHaveText(
      "Add a cost",
    );
    let i = 0;
    for (const header of headers) {
      await expect(this.page.getByRole("table").locator("thead").locator("th").nth(i)).toHaveText(header);
      await expect(
        this.page
          .getByRole("table")
          .locator("tfoot")
          .locator("tr")
          .nth(i + 1)
          .locator("th"),
      ).toHaveText(footers[i]);
      await expect(
        this.page
          .getByRole("table")
          .locator("tfoot")
          .locator("tr")
          .nth(i + 1)
          .locator("td")
          .first(),
      ).toHaveText(costs[i]);
      i++;
    }
  }

  async validateLineItem(costcat: string, rowAccess?: number) {
    await this.saveAndReturnButton.click();
    await this.commands.validationLink(this.emptyDescriptionValMsg);
    await this.commands.validationLink(this.emptyCostValMsg);
    await this.firstLineItemCost.fill("1");
    await this.commands.textValidation(
      "Description",
      250,
      "Save and return to claims",
      false,
      false,
      "Description of claim line item 0",
    );
    await this.clickCostCategory(costcat, rowAccess);
    await expect(this.page.getByRole("heading").filter({ hasText: costcat })).toBeVisible();
    await this.validators.validateCurrency(
      "Cost of claim line item 0",
      "Cost",
      String(this.lineItemCost),
      "Save and return to claims",
    );
  }

  async lineItemDocPageAssertion(costcat: string, docNumber: number) {
    const fileTable = [
      ["File name", this.evidenceDocs[docNumber]],
      ["Type", "Claim evidence"],
      ["Date uploaded", this.commands.dateToday(false)],
      ["Size", "0KB"],
      ["Uploaded by", "Main Finance Contact"],
    ];
    await this.uploadRemoveDocsButton.click();
    await PageHeading.fromTitle(this.page, `${costcat} documents`).isVisible();
    await expect(this.costCatDocGuidance).toBeVisible();
    await expect(this.uploadSubheading).toBeVisible();
    await this.commands.fileInput([this.evidenceDocs[docNumber]]);
    await this.commands.validationNotification("Your document has been uploaded.");
    await this.commands.backLink(`Back to ${costcat}`).click();
    await expect(this.page.getByRole("heading").filter({ hasText: costcat })).toBeVisible();
    let i = 0;
    for (const [header, cell] of fileTable) {
      await expect(this.filesUploadedTable.locator("thead").locator("th").nth(i)).toHaveText(header);
      await expect(this.filesUploadedTable.locator("tbody").locator("td").nth(i)).toHaveText(cell);
      i++;
    }
    await expect(this.firstLineItemDescription).toHaveValue(this.lineItemDescription1);
    await expect(this.firstLineItemCost).toHaveValue(String(this.lineItemCost));
    await expect(this.page.locator("css=textarea")).toHaveValue(`Comments for ${costcat}`);
  }

  async uploadInvoice() {
    await this.docTypeSelector.selectOption("Invoice");
    await this.commands.fileInput([this.evidenceDocs[10]]);
    const fileTable = [
      ["File name", this.evidenceDocs[10]],
      ["Type", "Invoice"],
      ["Date uploaded", this.commands.dateToday(false)],
      ["Size", "0KB"],
      ["Uploaded by", "Main Finance Contact"],
    ];
    let i = 0;
    for (const [header, cell] of fileTable) {
      await expect(this.claimDocTable.locator("thead").locator("th").nth(i)).toHaveText(header);
      await expect(this.claimDocTable.locator("tbody").locator("td").nth(i)).toHaveText(cell);
      i++;
    }
  }

  async clickEditAccessSummary() {
    await this.accessClaim("Edit");
    await this.costsToBeClaimedHeading.isVisible();
    await this.continueToClaimsDocs.click();
    await this.claimDocsHeading.isVisible();
    await this.continueForecastButton.click();
    await this.updateForecastHeading.isVisible();
    await this.continueToSummaryButton.click();
    await this.claimSummaryTitle.isVisible();
  }

  async summaryDocTable(table: DataTable, moLocator?: string) {
    let docTable: Locator;
    let i = 0;
    if (moLocator) {
      docTable = this.page.getByTestId(moLocator).getByRole("table");
    } else {
      docTable = this.page.getByRole("table");
    }
    for (const header of this.docTableHeaders) {
      await expect(docTable.locator("thead").locator("th").nth(i)).toHaveText(header);
      i++;
    }
    let data = table.hashes();
    const headers = ["File name", "Type"];
    let rowNum = 1;
    for (const row of data) {
      for (let i = 0; i < 2; i++) {
        await expect(docTable.locator("tr").nth(rowNum).locator("td").nth(i)).toHaveText(row[headers[i]]);
      }
      await expect(docTable.locator("tr").nth(rowNum).locator("td").nth(2)).toHaveText(this.commands.dateToday(false));
      await expect(docTable.locator("tr").nth(rowNum).locator("td").nth(3)).toHaveText("0KB");
      if (moLocator && rowNum === 1) {
        await expect(docTable.locator("tr").nth(rowNum).locator("td").nth(4)).toHaveText("Monitoring Officer");
      } else {
        await expect(docTable.locator("tr").nth(rowNum).locator("td").nth(4)).toHaveText("Main Finance Contact");
      }
      rowNum++;
    }
  }

  /**
   * FORECAST METHODS
   */

  /**
   * This function is setup to enable the feature to run independently of previous claims steps.
   */
  async completeForecastTable(table: DataTable, update: boolean, moViewID?: string) {
    const data = table.hashes();
    let updateFigure: number;
    let overheadsPeriodCost: string;
    let rowTotal: string;
    let overheadsTotal: string;
    let columnTotal: string;
    let tableLocator: Locator;
    let period: string;
    let ifLabourPopulated: Locator;
    if (moViewID) {
      tableLocator = this.page.locator(moViewID);
      period = "Period";
    } else {
      tableLocator = this.page.getByRole("table");
      period = "period";
    }
    ifLabourPopulated = this.page.getByLabel(`Labour ${period} 1`).filter({ hasText: "£1,666.23" });
    if (await ifLabourPopulated.isVisible()) {
      updateFigure = 708939.43;
      overheadsPeriodCost = "£141,787.89";
      rowTotal = "£7,799,999.96";
      overheadsTotal = "£1,560,000.04";
      columnTotal = "£7,231,182.19";
    } else {
      updateFigure = 709090.9;
      rowTotal = "£7,799,999.90";
      overheadsPeriodCost = "£141,818.18";
      overheadsTotal = "£1,559,999.98";
      columnTotal = "£7,232,727.18";
    }
    //Table headers
    if (moViewID) {
      await this.forecastTableHeaders(moViewID);
    } else {
      await this.forecastTableHeaders();
    }
    //Table body
    for (const cat of data) {
      for (let i = 2; i < 13; i++) {
        if (update) {
          await this.page.getByLabel(`${cat["Category"]} ${period} ${i}`).fill(String(updateFigure));
          await expect(this.page.getByLabel(`${cat["Category"]} ${period} ${i}`)).toHaveValue(String(updateFigure));
          await expect(
            this.page.getByLabel(`Overheads ${period} ${i}`).filter({ hasText: overheadsPeriodCost }),
          ).toBeVisible();
        } else {
          if (moViewID) {
            await expect(
              this.page
                .getByLabel(`${cat["Category"]} ${period} ${i}`)
                .filter({ hasText: updateFigure.toLocaleString("en-GB", { style: "currency", currency: "GBP" }) }),
            ).toBeVisible();
          } else {
            await expect(this.page.getByLabel(`${cat["Category"]} ${period} ${i}`)).toHaveValue(String(updateFigure));
          }
          await expect(
            this.page.getByLabel(`Overheads ${period} ${i}`).filter({ hasText: overheadsPeriodCost }),
          ).toBeVisible();
        }
      }
      //Row totals
      await expect(
        tableLocator.locator(`//tbody//tr[${Number(cat["Row number"])}]//td[14]//span`).filter({ hasText: rowTotal }),
      ).toBeVisible();
    }
    //Overheads total
    await expect(
      tableLocator.locator(`//tbody//tr[2]//td[14]//span`).filter({ hasText: overheadsTotal }),
    ).toBeVisible();
    //Column totals
    for (let i = 1; i < 12; i++) {
      await expect(
        tableLocator.locator("tfoot").locator("tr").nth(0).locator("td").nth(i).filter({ hasText: columnTotal }),
      ).toBeVisible();
    }
    if (moViewID) {
    } else {
      await this.continueToSummaryButton.click();
      await this.claimSummaryTitle.isVisible();
      await this.backToUpdateForecast.click();
      await this.updateForecastHeading.isVisible();
    }
  }

  async topThreeRows(moViewID?: string) {
    let period1IarNeeded: string;
    let locator: Locator;
    if (moViewID) {
      locator = this.page.locator(moViewID);
      period1IarNeeded = "No";
    } else {
      locator = this.page.getByRole("table");
      period1IarNeeded = "Yes";
    }
    const rowHeaders = [
      ["Period", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      ["IAR Due", period1IarNeeded, "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes"],
      [
        "Month",
        this.getPeriodDateRange(0),
        this.getPeriodDateRange(3),
        this.getPeriodDateRange(6),
        this.getPeriodDateRange(9),
        this.getPeriodDateRange(12),
        this.getPeriodDateRange(15),
        this.getPeriodDateRange(18),
        this.getPeriodDateRange(21),
        this.getPeriodDateRange(24),
        this.getPeriodDateRange(27),
        this.getPeriodDateRange(30),
        this.getPeriodDateRange(33),
      ],
    ];
    let rowNumber = 2;
    for (const row of rowHeaders) {
      for (let i = 1; i < 13; i++) {
        await expect(
          locator.locator(`//thead//tr[${rowNumber}]//th[${i}]`).filter({ hasText: row[i - 1] }),
        ).toBeVisible();
      }
      rowNumber++;
    }
  }

  async forecastTableHeaders(moViewID?: string) {
    const topHeaders = ["Costs you are claiming", "Forecast", "Total", "Total eligible costs", "Difference"];
    let i = 1;
    let table: Locator;
    if (moViewID) {
      table = this.page.locator(moViewID);
    } else {
      table = this.page.getByRole("table");
    }
    for (const header of topHeaders) {
      await expect(
        table.locator("thead").locator("tr").nth(0).locator("th").nth(i).filter({ hasText: header }),
      ).toBeVisible();
      i++;
    }
    if (moViewID) {
      await this.topThreeRows(moViewID);
    } else {
      await this.topThreeRows();
    }
  }

  getPeriodDateRange(startIncrement: number) {
    let date = new Date();
    let startMonth = new Date(new Date(date).setMonth(date.getMonth() + startIncrement));
    let startMonthString = startMonth.toLocaleDateString("en-US", { month: "short" });
    let endMonth = new Date(new Date(date).setMonth(date.getMonth() + (startIncrement + 2)));
    let endMonthString = endMonth.toLocaleDateString("en-US", { month: "short" });
    return `${startMonthString} to ${endMonthString}`;
  }
}
