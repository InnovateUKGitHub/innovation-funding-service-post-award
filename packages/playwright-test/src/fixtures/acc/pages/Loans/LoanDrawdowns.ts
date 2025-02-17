import { expect, Locator, Page } from "@playwright/test";
import { Fixture, Then, When } from "playwright-bdd/decorators";
import { Commands } from "../../../Commands";
import { PageHeading } from "../../../../components/PageHeading";
import { DataTable } from "playwright-bdd";
import { getLorem } from "../../../../components/lorem";

export
@Fixture("loanDrawdowns")
class LoanDrawdowns {
  protected readonly page: Page;
  protected readonly commands: Commands;
  private readonly drawdownsHeading: PageHeading;
  private readonly drawdownHeading: PageHeading;
  private readonly backToProject: Locator;
  private readonly backToLoansSummary: Locator;
  private readonly viewButton: Locator;
  private readonly viewButton1: Locator;
  private readonly requestButton: Locator;
  private readonly requestButton1: Locator;
  private readonly requestButton2: Locator;
  private readonly drawdownsHeaders: Array<string>;
  private readonly nonFcDrawdownGuidance: Locator;
  private readonly changeDrawdownLink: Locator;
  private readonly singleDrawdownTableHeaders: Array<string>;
  private readonly filesUploadedHeader: Locator;
  private readonly period1DrawdownRow: Array<string>;
  private readonly fcDrawdownGuidance: Locator;
  private readonly uploadDrawdownApprovalHeader: Locator;
  private readonly drawdownApprovalGuidance: Locator;
  private readonly additionalInfoHeading: Locator;
  private readonly additionalInfoGuidance: Locator;
  private readonly haveZeroCharacters: Locator;
  private readonly nowSendHeading: Locator;
  private readonly submissionGuidance: Locator;
  private readonly uploadDocumentsButton: Locator;
  private readonly fileTableHeaders: Array<string>;
  private readonly fileTableRow: Array<string>;
  private readonly fileTableHead: Locator;
  private readonly fileTableBody: Locator;
  private readonly noDocsUploadedText: Locator;
  private readonly acceptAndSendButton: Locator;
  private readonly drawdownTextbox: Locator;
  private readonly requestedPeriod1DrawdownRow: Array<string>;
  private readonly approvedPeriod1DrawdownRow: Array<string>;
  private readonly sfParticipantsTab: Locator;
  private readonly sfParticipantTable: Locator;
  private readonly sfGrantAdjustmentsTab: Locator;
  private readonly sfSubmitApprovalButton: Locator;
  private readonly sfDialogueBox: Locator;
  private readonly sfApprovalsTab: Locator;
  private readonly sfTabPanel: Locator;
  private readonly sfPaymentInfoHeading: Locator;

  constructor({ page, commands }: { page: Page; commands: Commands }) {
    this.page = page;
    this.commands = commands;
    this.drawdownsHeading = PageHeading.fromTitle(this.page, "Drawdowns");
    this.drawdownHeading = PageHeading.fromTitle(this.page, "Drawdown");
    this.backToProject = this.commands.backLink("Back to Project");
    this.backToLoansSummary = this.commands.backLink("Back to loans summary page");
    this.viewButton = this.page.getByRole("button").filter({ hasText: "View" });
    this.viewButton1 = this.page.locator(`//table//tbody//tr[1]//td[5]`).filter({ has: this.viewButton });
    this.requestButton = this.page.getByRole("button").filter({ hasText: "Request" });
    this.requestButton1 = this.page.locator(`//table//tbody//tr[1]//td[5]`).filter({ has: this.requestButton });
    this.requestButton2 = this.page.locator(`//table//tbody//tr[2]//td[5]`).filter({ has: this.requestButton });
    this.drawdownsHeaders = ["Drawdown", "Due date", "Drawdown amount", "Status"];
    this.nonFcDrawdownGuidance = this.page.getByText(
      "Your Finance Contact can request your drawdown here. If you need to change the amount of your drawdown, you will need to submit a",
    );
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
    this.fcDrawdownGuidance = this.page.getByText(
      "You can request your drawdown here. If the amount of your drawdown needs to be changed, your Project Manager will need to submit a change drawdown project change request.",
    );
    this.uploadDrawdownApprovalHeader = this.page
      .getByRole("heading")
      .filter({ hasText: "Upload drawdown approval request" });
    this.drawdownApprovalGuidance = this.page.getByText("You must upload a signed drawdown approval request");
    this.additionalInfoHeading = this.page.locator("legend").filter({ hasText: "Additional information (Optional)" });
    this.additionalInfoGuidance = this.page
      .locator("#hint-for-comments")
      .filter({ hasText: "If you want to explain anything to Innovate UK, add it here." });
    this.haveZeroCharacters = this.page.getByRole("paragraph").filter({ hasText: "You have 0 characters" });
    this.nowSendHeading = this.page.locator("legend").filter({ hasText: "Now send your request" });
    this.submissionGuidance = this.page.getByRole("paragraph").filter({
      hasText:
        "By submitting this drawdown request I confirm that the amount requested is in line with forecast eligible project costs and that this has been approved by an authorised signatory of the business. I understand and accept that if I knowingly submit a drawdown request without appropriate approvals or provide false or misleading information, this may result in my drawdown being rejected, termination of the loan, recovery of loan proceeds and outstanding interest, civil action and where there is evidence of fraud, criminal prosecution.",
    });
    this.uploadDocumentsButton = this.page.getByRole("button").filter({ hasText: "Upload documents" });
    this.fileTableHeaders = ["File name", "Type", "Date uploaded", "Size", "Uploaded by"];
    this.fileTableRow = [
      "testfile.doc",
      "Drawdown approval",
      this.commands.dateToday(false),
      "0KB",
      "Main Finance Contact",
    ];
    this.fileTableHead = this.page
      .getByTestId("prepare-item-file-for-partner-documents-container")
      .getByRole("table")
      .locator("thead")
      .locator("th");
    this.fileTableBody = this.page
      .getByTestId("prepare-item-file-for-partner-documents-container")
      .getByRole("table")
      .locator("tbody")
      .locator("td");
    this.noDocsUploadedText = this.page.getByRole("paragraph").filter({ hasText: "No documents uploaded." });
    this.acceptAndSendButton = this.page.getByRole("button").filter({ hasText: "Accept and send" });
    this.drawdownTextbox = this.page.locator("#comments");
    this.requestedPeriod1DrawdownRow = ["1", this.getDrawdownDate(0), "£110,000", "Requested"];
    this.approvedPeriod1DrawdownRow = ["1", this.getDrawdownDate(0), "£110,000", "Approved"];
    this.sfParticipantsTab = this.page.locator("#customTab__item").filter({ hasText: "Participants" });
    this.sfParticipantTable = this.page
      .getByLabel("Project Participants")
      .locator("table")
      .locator("tbody")
      .locator("tr")
      .nth(0);
    this.sfGrantAdjustmentsTab = this.page.getByRole("tab").filter({ hasText: "Grant Adjustments" });
    this.sfSubmitApprovalButton = this.page.getByRole("button").filter({ hasText: "Submit for Approval" });
    this.sfDialogueBox = this.page.getByRole("dialog");
    this.sfApprovalsTab = this.page.getByRole("tab").filter({ hasText: "Approval History" });
    this.sfTabPanel = this.page.getByRole("tabpanel");
    this.sfPaymentInfoHeading = this.page.getByRole("heading").filter({ hasText: "Payment Information" });
  }

  @Then("the user will see the {string} Drawdowns page")
  async drawdownPage(user: string, table: DataTable) {
    const data = table.hashes();
    await this.drawdownsHeading.isVisible();
    await expect(this.backToProject).toBeVisible();
    await this.assertDrawdownsTable(user, table);
  }

  @When("the user clicks the View button")
  async clickViewButton() {
    await this.viewButton.click();
    await this.drawdownHeading.isVisible();
  }

  @When("the user clicks the Request button")
  async clickRequestButton() {
    await this.requestButton.click();
    await this.drawdownHeading.isVisible();
  }

  @Then("the user will see the {string} drawdown")
  async viewOnlyDrawdown(user: string) {
    await this.drawdownHeading.isVisible();
    await expect(this.backToLoansSummary).toBeVisible();
    if (user === "PM") {
      await this.pmOnlyDrawdown();
    } else if (user === "FC") {
      await this.fcOnlyDrawdown();
    }
    await this.singleDrawdownTable();
    await expect(this.filesUploadedHeader).toBeVisible();
    await expect(this.noDocsUploadedText).toBeVisible();
  }

  @When("this user clicks the change drawdown link")
  async clickChangeDrawdownLink() {
    await this.changeDrawdownLink.click();
  }

  @Then("the user will see the PCR Start a new request page")
  async startARequestPage() {
    await expect(this.page.getByRole("heading").filter({ hasText: "Start a new request" })).toBeVisible();
  }

  @When("the user attempts to submit the Drawdown without a document and too many comments")
  async submitWithoutDoc() {
    await this.drawdownTextbox.fill(getLorem(32_769));
    await this.acceptAndSendButton.click();
  }

  @When("the enters 4 characters only and attempts to submit")
  async submit4Characters() {
    await this.drawdownTextbox.fill(getLorem(4));
    await expect(this.page.getByRole("paragraph").filter({ hasText: "You have 4 characters" })).toBeVisible();
    await this.acceptAndSendButton.click();
  }

  @Then("the user will see Drawdown validation messaging")
  async drawdownValidationMessages(table: DataTable) {
    const data = table.hashes();
    for (const msg of data) {
      await this.commands.validationLink(msg["Message"]);
      await expect(this.page.getByRole("paragraph").filter({ hasText: msg["Message"] })).toBeVisible();
    }
  }

  @When("the user uploads a document and enters 5 characters")
  async drawdownValidState() {
    await this.commands.fileInput(["testfile.doc"]);
    let i = 0;
    for (const header of this.fileTableHeaders) {
      await expect(this.fileTableHead.nth(i).filter({ hasText: header })).toBeVisible();
      await expect(this.fileTableBody.nth(i).filter({ hasText: this.fileTableRow[i] })).toBeVisible();
      i++;
    }
    await this.fileTableBody.nth(5).getByRole("button").filter({ hasText: "Remove" }).click();
    await this.commands.validationNotification("'testfile.doc' has been removed.");
    await this.commands.fileInput(["testfile.doc"]);
    await this.drawdownTextbox.fill(getLorem(5));
    await expect(this.page.getByRole("paragraph").filter({ hasText: "You have 5 characters" })).toBeVisible();
  }

  @Then("the Drawdown validation messages will no longer appear")
  async noDrawdownValMessages() {
    await expect(this.page.getByTestId("validation-summary")).not.toBeVisible();
  }

  @When("the user submits the Drawdown request")
  async submitDrawdown() {
    await this.drawdownTextbox.fill(getLorem(32_768));
    await expect(this.page.getByRole("paragraph").filter({ hasText: "You have 32768 characters" })).toBeVisible();
    await this.acceptAndSendButton.click();
  }

  @Then("the period 1 Drawdown status will be {string}")
  async drawdownRequestedStatus(status: string) {
    await this.drawdownsHeading.isVisible();
    let array: Array<string>;
    if (status === "Requested") {
      array = this.requestedPeriod1DrawdownRow;
    } else if (status === "Approved") {
      array = this.approvedPeriod1DrawdownRow;
    }
    let i = 1;
    for (const cell of array) {
      await expect(this.page.getByTestId("drawdown-list").locator(`//table//tbody//tr[1]//td[${i}]`)).toHaveText(cell);
      i++;
    }
  }

  @Then("the Drawdown request button will be disabled")
  async requestButtonDisabled() {
    await expect(this.requestButton).toBeDisabled();
  }

  @When("the Salesforce user access the Drawdown")
  async salesforceAccessDrawdown() {
    await this.sfParticipantsTab.click();
    await this.sfParticipantTable.locator("th").nth(0).getByRole("link").click();
    await this.sfGrantAdjustmentsTab.click();
    const cell = this.page.locator("td").nth(2).filter({ hasText: "£110,000.00" });
    const row = this.page.getByLabel("Grant Adjustments").locator("tbody").locator("tr").filter({ has: cell });
    await row.locator("th").nth(0).getByRole("link").click();
  }

  @When("the user submits the Drawdown for approval")
  async sfSubmitforApproval() {
    await this.sfSubmitApprovalButton.click();
    await this.sfDialogueBox.getByRole("textbox").fill("Approval comments");
    await this.sfDialogueBox.getByRole("button").filter({ hasText: "Submit" }).click();
    await this.sfApprovalsTab.click();
    await this.page.getByRole("button").filter({ hasText: "Approve" }).click();
    await this.sfDialogueBox.getByRole("textbox").fill("Approval comments");
    await this.sfDialogueBox.getByRole("button").filter({ hasText: "Approve" }).click();
  }

  @Then("the Salesforce status will show Approved")
  async sfStatusApproved() {
    await this.page.getByRole("tab").filter({ hasText: "Details" }).click();
    const panelSection = this.sfTabPanel.filter({ has: this.sfPaymentInfoHeading });
    await expect(panelSection.filter({ has: this.page.locator("dd").filter({ hasText: "Approved" }) })).toBeVisible();
  }

  @Then("the user can access the second Drawdown")
  async accessSecondDrawdown() {
    await this.requestButton2.click();
    await expect(this.page.locator("//table/tbody/tr[1]//td[1]").filter({ hasText: "2" })).toBeVisible();
  }

  /**
   * METHODS
   */
  async assertDrawdownsTable(user: string, table: DataTable) {
    const data = table.hashes();
    let th = 1;
    for (const header of this.drawdownsHeaders) {
      await expect(this.page.locator(`//table//thead/tr[1]//th[${th}]`).filter({ hasText: header })).toBeVisible();
      th++;
    }
    if (user === "PM") {
      await expect(this.viewButton1).toBeVisible();
    } else if (user === "FC") {
      await expect(this.requestButton1).toBeVisible();
    }
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

  async pmOnlyDrawdown() {
    await expect(this.nonFcDrawdownGuidance).toBeVisible();
    await expect(this.changeDrawdownLink).toBeVisible();
  }

  async fcOnlyDrawdown() {
    await expect(this.fcDrawdownGuidance).toBeVisible();
    await expect(this.uploadDrawdownApprovalHeader).toBeVisible();
    await this.commands.learnFiles();
    await expect(this.drawdownApprovalGuidance).toBeVisible();
    await expect(this.uploadDocumentsButton).toBeVisible();
    await expect(this.additionalInfoHeading).toBeVisible();
    await expect(this.additionalInfoGuidance).toBeVisible();
    await expect(this.haveZeroCharacters).toBeVisible();
    await expect(this.nowSendHeading).toBeVisible();
    await expect(this.submissionGuidance).toBeVisible();
    await expect(this.acceptAndSendButton).toBeVisible();
  }
}
