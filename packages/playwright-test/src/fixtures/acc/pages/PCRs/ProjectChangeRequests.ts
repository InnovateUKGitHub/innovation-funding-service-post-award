import { expect, Locator, Page } from "@playwright/test";
import { Fixture, When, Then, Given } from "playwright-bdd/decorators";
import { Commands } from "../../../Commands";
import { PcrType } from "../../../../typings/pcr";
import { Button } from "../../../../components/Button";
import { DataTable } from "playwright-bdd";
import { SfdcApi } from "../../../sfdc/SfdcApi";
import { ProjectState } from "../../../projectFactory/ProjectState";
import { BaseCrndProjectScriptContext } from "@innovateuk/project-factory-two/scripts/BaseCrndProjectScript";
export
@Fixture("projectChangeRequests")
class ProjectChangeRequests {
  protected readonly page: Page;
  protected readonly commands: Commands;
  protected readonly sfdcApi: SfdcApi;
  protected readonly projectState: ProjectState;

  private readonly pcrPageHeading: Locator;
  private readonly createButton: Locator;
  private readonly startRequestHeader: string;
  private readonly giveUsInfoQa: Locator;
  private readonly reasoningQa: Locator;
  private readonly provideReasonsLink: Locator;
  private readonly reasoningHeader: Locator;
  private readonly agreeWithChange: Locator;
  private readonly requestHeading: Locator;
  private readonly submittedHeading: Locator;
  private readonly submitSuccessMsgHeading: Locator;
  private readonly submitSuccessMsgContent: Locator;
  private readonly backtoPcr: Locator;
  private readonly markAsComplete: Locator;
  private readonly saveAndReturnButton: Locator;
  private readonly detailsHeading: Locator;
  private readonly backToRequest: Locator;
  private readonly queryRadioButton: Locator;
  private readonly sendRadioButton: Locator;
  private readonly commentsForPm: string;
  private readonly statusLogButton: Locator;
  private readonly statusShow: Locator;
  private readonly statusHide: Locator;
  private readonly moStatusComment: Locator;
  private readonly commentsForMo: string;
  private readonly commentsForIUK: string;
  private readonly pmStatusComment: Locator;
  private readonly finalComments: string;
  private readonly uploadDocumentsHeading: Locator;
  private readonly giveUsInfoSubheading: Locator;
  private readonly pcrReasoning: string;
  private readonly pcrTask1: string;
  private readonly pcrSummaryRowValue: string;
  private readonly pcrSummaryRowlist: string;
  private readonly nextPreviousPage: Locator;
  private readonly submitPcrs: Locator;
  private readonly iukRadioButton: string;
  private readonly taskLink: Locator;
  private readonly createReq: Locator;
  private readonly submittedDetails: string;
  private readonly existingPcrTableHeadings: Array<string>;
  private readonly tbodyRowCell: Locator;
  private readonly editLink: Locator;
  private readonly deleteLink: Locator;
  private readonly deleteDraftRequestHeading: Locator;
  private readonly deleteGuidance: string;
  private readonly deleteRequestButton: Locator;

  constructor({
    page,
    commands,
    sfdcApi,
    projectState,
  }: {
    page: Page;
    commands: Commands;
    sfdcApi: SfdcApi;
    projectState: ProjectState;
  }) {
    this.page = page;
    this.commands = commands;
    this.sfdcApi = sfdcApi;
    this.projectState = projectState;
    this.pcrPageHeading = this.page.getByRole("heading").filter({ hasText: "Project change requests" });
    this.createButton = Button.fromTitle(page, "Create request");
    this.startRequestHeader = "Start a new request";
    this.giveUsInfoQa = this.page.getByTestId("WhatDoYouWantToDo");
    this.reasoningQa = this.page.getByTestId("reasoning");
    this.provideReasonsLink = this.reasoningQa.getByRole("link");
    this.reasoningHeader = this.page.getByRole("heading").filter({ hasText: "Provide reasons to Innovate UK" });
    this.agreeWithChange = this.page.getByLabel("I agree with this change.");
    this.requestHeading = this.page.getByRole("heading").filter({ hasText: "Request" });
    this.submittedHeading = this.page.getByRole("heading").filter({ hasText: "Project change request submitted" });
    this.submitSuccessMsgHeading = this.page
      .getByTestId("validation-message")
      .filter({ hasText: "Your project change request has been submitted." });
    this.submitSuccessMsgContent = this.page.getByTestId("validation-message").filter({
      hasText:
        "Please note there is a 30-day Service Level Target from submission of your request to Innovate UK, through to approval of the change(s).",
    });
    this.backtoPcr = this.page.getByRole("link").filter({ hasText: "Back to project change requests" });
    this.markAsComplete = this.page.locator("css=legend").filter({ hasText: "Mark as complete" });
    this.saveAndReturnButton = this.commands.button("Save and return to request");
    this.detailsHeading = this.page.getByRole("heading").filter({ hasText: "Details" });
    this.backToRequest = this.commands.backLink("Back to request");
    this.queryRadioButton = this.page.getByLabel("Query the request");
    this.sendRadioButton = this.page.getByLabel("Send for approval");
    this.commentsForPm = "These are comments for the PM to pick up.";
    this.statusLogButton = this.commands.button("Status and comments log");
    this.statusShow = this.page.getByTestId("status-and-comments-log").filter({ hasText: "Show" });
    this.statusHide = this.page.getByTestId("status-and-comments-log").filter({ hasText: "Hide" });
    this.moStatusComment = this.page
      .getByTestId("projectChangeRequestStatusChangeTable")
      .filter({ hasText: this.commentsForPm });
    this.commentsForMo = "These are comments for the MO to pick up.";
    this.commentsForIUK = "These are comments for Innovate UK to pick up.";
    this.pmStatusComment = this.page
      .getByTestId("projectChangeRequestStatusChangeTable")
      .filter({ hasText: this.commentsForMo });
    this.finalComments = "These are the final comments for Innovate UK.";
    this.uploadDocumentsHeading = this.page.locator("css=legend").filter({ hasText: "Upload documents" });
    this.giveUsInfoSubheading = this.page.locator("li").getByRole("heading").filter({ hasText: "Give us information" });
    this.pcrReasoning = "This is the reasoning for this PCR.";
    this.pcrTask1 = '[data-qa="taskList"]';
    this.pcrSummaryRowValue = '[data-qa="numberRow"] dd.govuk-summary-list__value';
    this.pcrSummaryRowlist = '[data-qa="typesRow"] dd.govuk-summary-list__value';
    this.nextPreviousPage = this.page.locator("//span[@class='govuk-navigation-arrows__button__label__category']");
    this.submitPcrs = this.page.locator("//button[normalize-space()='Submit']");
    this.iukRadioButton = "//label[contains(text(),'{text}')]";
    this.createReq = this.page.locator('button:has-text("Create request")');
    this.taskLink = this.page.locator("role=link");
    this.submittedDetails = `//dl[@class='govuk-summary-list']//dt[text()='%s']/following-sibling::dd[@class='govuk-summary-list__value']`;
    this.existingPcrTableHeadings = ["Request number", "Types", "Started", "Status", "Last updated"];
    this.tbodyRowCell = this.page.getByRole("table").locator("tbody").locator("tr").locator("td");
    this.editLink = this.page.getByRole("link").filter({ hasText: "Edit" });
    this.deleteLink = this.page.getByRole("link").filter({ hasText: "Delete" });
    this.deleteDraftRequestHeading = this.page.getByRole("heading").filter({ hasText: "Delete draft request" });
    this.deleteGuidance = "All the information will be permanently deleted.";
    this.deleteRequestButton = this.page.getByRole("button").filter({ hasText: "Delete request" });
  }

  @Then("the Salesforce Marked as complete status is {string}")
  async accessProject(markedCompleteStatus: string) {
    let status = `"${markedCompleteStatus}"`;
    const context = this.projectState.context as BaseCrndProjectScriptContext;
    const projectNumber = String(context.project.Acc_ProjectNumber__c);
    type QueryPCR = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: string; url: string };
        Name: string;
        Acc_MarkedasComplete__c: string;
      }[];
    };
    const conn = await this.sfdcApi.getTsforceConnection();
    await conn.executeApex({ query: "System.debug('Run an Apex query');" });
    const pcrQuery: QueryPCR = await conn.executeSOQL({
      query: `SELECT Name, CreatedDate from Acc_ProjectChangeRequest__c WHERE Acc_ProjectNumber__c = '${projectNumber}' ORDER BY CreatedDate`,
    });
    const pcr = pcrQuery.records[1].Name;
    const markedAsQuery: QueryPCR = await conn.executeSOQL({
      query: `SELECT Acc_MarkedasComplete__c from Acc_ProjectChangeRequest__c WHERE Name = '${pcr}'`,
    });
    console.log(pcrQuery);
    const markedAsCompleteStatus = markedAsQuery.records[0].Acc_MarkedasComplete__c;
    const markedAsJson = JSON.stringify(markedAsCompleteStatus);
    if (markedAsJson === status) {
      console.log(`Marked as complete status test passed. The status is '${markedAsJson}'`);
    } else {
      throw new Error(`Test failed because marked as complete status is '${markedAsJson}'`);
    }
    console.log(pcrQuery);
  }

  @Then("the user will see the Mark as complete subheading")
  async markAsCompleteSubheading() {
    await expect(this.markAsComplete).toBeVisible();
  }

  /**
   * This assumes the user is on the Start a request page and can see all PCR checkboxes.
   */
  @When("the user creates a {string} PCR")
  async createPCR(pcr: PcrType) {
    await this.clickCreateRequest();
    await this.commands.selectPcrType(pcr);
    await this.createButton.click();
  }

  @Then("the user clicks the {string} PCR type")
  async selectPcrType(pcr: PcrType | string) {
    await this.page.getByRole("link").getByText(pcr).click();
    await this.commands.heading(pcr);
  }

  @Then("the request page will show {string} as {string}")
  async requestPagePcrStatus(pcr: PcrType | string, status: string) {
    await this.commands.heading("Request");
    await expect(this.giveUsInfoQa.filter({ hasText: pcr })).toBeVisible();
    await expect(this.giveUsInfoQa.filter({ hasText: status })).toBeVisible();
  }

  /**
   * This does no validation or extensive checks.
   * This simply completes the section to allow for submission.
   */
  @When("the user completes the reasons section")
  async completePcrReasons() {
    await this.provideReasonsLink.click();
    await expect(this.reasoningHeader).toBeVisible();
    await this.commands.textValidation("Reasoning", 32000, "Save and continue", true);
    await expect(this.uploadDocumentsHeading).toBeVisible();
    await this.commands.backLink("Back to request").click();
    await expect(this.requestHeading).toBeVisible();
    await this.page.getByRole("link").filter({ hasText: "Provide reasons to Innovate UK" }).click();
    await this.commands.getByLegend("Mark as complete");
    await this.commands.getListItemFromKey("Comments", "Edit", true, true, "comments");
    await this.commands.getByLegend("Reasons");
    await this.page.getByRole("textbox").fill(this.pcrReasoning);
    await this.commands.button("Save and continue").click();
    await expect(this.uploadDocumentsHeading).toBeVisible();
    await expect(this.page.getByTestId("numberRow").filter({ hasText: "Request number" })).toBeVisible();
    await this.commands.fileInput(["testfile.doc"], true);
    await this.commands.button("Save and continue").click();
    await this.agreeWithChange.click();
    await this.commands.button("Save and return to request").click();
    await expect(this.requestHeading).toBeVisible();
    await expect(this.reasoningQa.filter({ hasText: "Complete" })).toBeVisible();
  }

  @Then("the user clicks Submit request")
  async submitRequest() {
    await this.commands.button("Submit request").click();
  }

  @Then("the user will see the submitted page for {string}")
  async submittedPage(pcr: PcrType) {
    await expect(this.submittedHeading).toBeVisible();
    await expect(this.backtoPcr).toBeVisible();
    await expect(this.submitSuccessMsgHeading).toBeVisible();
    await expect(this.submitSuccessMsgContent).toBeVisible();
    //let dates = this.commands.dateToday(true);
    let submissionList = [
      ["Request number", /[1-9]/],
      ["Request type", pcr],
      ["Request started", String(this.commands.dateToday(true))],
      ["Request status", "Submitted to Monitoring Officer"],
      ["Request last updated", String(this.commands.dateToday(true))],
    ];
    let i = 1;
    for (const [key, list] of submissionList) {
      await this.commands.getListItemFromKey(key, list, true);
      i++;
    }

    await expect(this.page.getByRole("link").filter({ hasText: "Review request" })).toBeVisible();
    await expect(this.commands.button("Return to project change requests")).toBeVisible();
  }

  @When("the user clicks review against {string}")
  async clickReviewAgainst(pcrType: PcrType) {
    const row = this.page.locator("tr").filter({ hasText: pcrType });
    await row.getByRole("link").filter({ hasText: "Review" }).click();
  }

  @Then("the user can see the request page for {string}")
  async viewRequestPage(pcrType: PcrType) {
    await expect(this.requestHeading).toBeVisible();
    await expect(this.detailsHeading).toBeVisible();
    await expect(this.giveUsInfoSubheading).toBeVisible();
    await expect(this.page.getByRole("link").filter({ hasText: pcrType })).toBeVisible();
  }

  @When("the user clicks Next - Reasoning")
  async nextReasoning() {
    await expect(this.page.getByTestId("arrow-left").filter({ hasText: "Next" })).toBeVisible();
    await this.page.getByTestId("arrow-left").filter({ hasText: "Reasoning" }).click();
  }

  @Then("the reasoning page displays the following")
  async reasoningPageDisplayed(table: DataTable) {
    const data = table.hashes();
    let i = 1;
    for (const row of data) {
      await this.commands.getListItemFromKey(row["Key"], row["List item"], true);
      i++;
    }
  }

  @When("the user clicks back to request")
  async backToRequestPage() {
    await this.backToRequest.click();
    await this.requestHeading.isVisible();
  }

  @When("the user selects Query the request")
  async selectQuery() {
    await this.queryRadioButton.click();
  }

  @When("the user selects Send for approval")
  async selectSend() {
    await this.sendRadioButton.click();
    await this.page.waitForTimeout(2000);
  }

  @Then("the user will see the PCR Request screen")
  async requestScreenVisible() {
    await this.requestHeading.isVisible();
  }

  @Then("the user enters comments for the {string}")
  async enterComments(recipient: string) {
    if (recipient === "Project Manager") {
      await this.page.getByRole("textbox").fill(this.commentsForPm);
    } else if (recipient === "Monitoring Officer") {
      await this.page.getByRole("textbox").fill(this.commentsForMo);
    } else if (recipient === "Innovate UK") {
      await this.page.getByRole("textbox").fill(this.commentsForIUK);
    }
  }

  @When("the user clicks the submit button")
  async clickSubmitButton() {
    await this.commands.button("Submit").click();
  }

  @Then("the {string} PCR has the status {string}")
  async pcrStatus(pcrtype: PcrType, status: string) {
    await this.pcrPageHeading.isVisible();
    const row = this.page.locator("css=tr").filter({ hasText: pcrtype });
    await expect(row.locator("td").nth(3).filter({ hasText: status })).toBeVisible();
  }

  @When("the user accesses the queried {string} PCR")
  async accessQueriedPcr(pcrtype: PcrType) {
    const row = this.page.locator("tr").filter({ hasText: pcrtype });
    await row.getByRole("link").filter({ hasText: "Edit" }).click();
  }

  @Then("the user can see the comments from the {string}")
  async commentsFrom(userType: string) {
    await this.statusShow.isVisible();
    await this.statusLogButton.click();
    await this.statusHide.isVisible();
    if (userType === "Monitoring Officer") {
      await this.moStatusComment.isVisible();
    } else if (userType === "Project Manager") {
      await this.pmStatusComment.isVisible();
    }
  }

  @Then("the user clicks the submit request button")
  async clickSubmitRequest() {
    await this.commands.button("Submit request").click();
  }

  @Then("the user enters final comments")
  async enterFinalComments() {
    await this.page.getByRole("textbox").fill(this.finalComments);
  }

  @When("the user saves the {string} pcr after marking as complete")
  async saveAssertStatus(pcrType: PcrType) {
    await expect(this.markAsComplete).toBeVisible();
    await this.saveAndReturnButton.click();
    await this.requestPagePcrStatus(pcrType, "Incomplete");
    await this.selectPcrType(pcrType);
    await this.markAsCompleteSection(true);
    await this.requestPagePcrStatus(pcrType, "Complete");
  }

  @When("the user adds all PCR types to the request")
  async addAllPcrTypes(table: DataTable) {
    const data = table.hashes();
    await this.clickCreateRequest();
    await expect(this.page.getByRole("heading").filter({ hasText: this.startRequestHeader })).toBeVisible();
    for (const row of data) {
      await this.commands.selectPcrType(row["PCR"]);
    }
    await this.clickCreateRequest();
    await expect(this.requestHeading).toBeVisible();
  }

  @Then("the Request page will show all PCR types as {string}")
  async requestPageShowsAllPcrs(status: string, table: DataTable) {
    const data = table.hashes();
    for (const row of data) {
      await this.requestPagePcrStatus(row["PCR"], status);
    }
  }

  @When("the user clicks into each PCR in turn")
  async accessEachPcrType(table: DataTable) {
    const data = table.hashes();
    for (const row of data) {
      await this.selectPcrType(row["PCR"]);
      await expect(this.page.getByRole("heading").filter({ hasText: row["PCR"] })).toBeVisible();
      await this.backToRequest.click();
      await expect(this.requestHeading).toBeVisible();
    }
  }

  @Then("they will arrive lastly at the {string} page")
  async correctPageDisplayed(pcr: PcrType | string) {
    await this.selectPcrType(pcr);
    await expect(this.page.getByRole("heading").filter({ hasText: pcr })).toBeVisible();
  }

  @Given("the user can see the existing PCR in {string}")
  async seeExistingPCR(status: string, table: DataTable) {
    const data = table.hashes();

    const rowEnd = [this.commands.dateToday(false), status, this.commands.dateToday(false)];
    let i = 0;
    for (const header of this.existingPcrTableHeadings) {
      await expect(this.page.getByRole("table").locator("thead").locator("th").nth(i)).toHaveText(header);
      i++;
    }
    await expect(this.tbodyRowCell.nth(0)).toHaveText(/^[1-10]$/);
    for (const row of data) {
      await expect(this.tbodyRowCell.nth(1).filter({ hasText: row["PCR"] })).toBeVisible();
    }
    let cellNum = 2;
    for (const cell of rowEnd) {
      await expect(this.tbodyRowCell.nth(cellNum)).toHaveText(cell);
      cellNum++;
    }
    await expect(this.tbodyRowCell.nth(5).filter({ has: this.editLink })).toBeVisible();
    await expect(this.tbodyRowCell.nth(5).filter({ has: this.deleteLink })).toBeVisible();
  }

  @When("the user clicks the Delete link")
  async clickDeleteLink() {
    await this.deleteLink.nth(0).click();
    await expect(this.deleteDraftRequestHeading).toBeVisible();
  }

  @Then("the user will see the Delete PCR page")
  async deletePCRPage(table: DataTable) {
    const data = table.hashes();
    await expect(this.deleteDraftRequestHeading).toBeVisible();
    await expect(this.backtoPcr).toBeVisible();
    await this.commands.validationNotification(this.deleteGuidance);
    await this.commands.getListItemFromKey("Request", /^[1-10]$/, true, false, "requestNumber");
    for (const row of data) {
      await this.commands.getListItemFromKey("Types", row["PCR"], false, false, "types");
    }
    await this.commands.getListItemFromKey("Started", this.commands.dateToday(false), true, false, "started");
    await this.commands.getListItemFromKey("Last updated", this.commands.dateToday(false), true, false, "lastUpdated");
    await expect(this.deleteRequestButton).toBeVisible();
  }

  @When("the user clicks the Delete request button")
  async clickDeleteRequestButton() {
    await this.deleteRequestButton.click();
  }

  @Then("the PCR will no longer exist")
  async noPcrCreated() {
    await this.pcrPageHeading.isVisible();
    await expect(this.page.getByTestId("pcr-table")).not.toBeVisible();
  }

  /**
   * METHODS
   */
  async markAsCompleteSection(markAndSubmit: boolean) {
    await this.markAsComplete.isVisible();
    if (markAndSubmit) {
      await this.agreeWithChange.check();
      await this.saveAndReturnButton.click();
    } else {
      await this.agreeWithChange.isVisible();
      await this.saveAndReturnButton.isVisible();
    }
  }

  async pcrCheckBox(name: string, disabled: boolean) {
    if (disabled) {
      const span = this.page.locator("css=span").filter({ hasText: name });
      await expect(this.page.getByRole("checkbox").filter({ has: span })).toBeDisabled();
    } else {
      const span = this.page.locator("css=span").filter({ hasText: name });
      await expect(this.page.getByRole("checkbox").filter({ has: span })).not.toBeDisabled();
    }
  }

  async clickCreateRequest() {
    await this.commands.button("Create request").click();
  }

  async validatePcrTaskList(expectedSection: string, expectedTask: string) {
    const taskText = await this.page.textContent(this.pcrTask1);

    if (!taskText?.includes(expectedSection)) {
      throw new Error(`task section:'${expectedSection}' not found.`);
    }

    if (!taskText?.includes(expectedTask)) {
      throw new Error(`task:'${expectedTask}' not found.`);
    }
  }

  async validatePcrDetails(expectedRequestNumber: string, expectedTypes: string) {
    const requestNumber = await this.page.textContent(this.pcrSummaryRowValue);
    const types = await this.page.textContent(this.pcrSummaryRowlist);

    if (requestNumber !== expectedRequestNumber || types !== expectedTypes) {
      throw new Error("Validation failed.");
    }
  }

  async selectRadioButton(radioItem: string) {
    const radioButton = this.page.locator(this.iukRadioButton.replace("{text}", radioItem));
    await radioButton.click();
  }

  async clickTaskTodo(taskText: string) {
    const todoLink = this.taskLink.count();
    for (let i = 0; i < (await todoLink); i++) {
      const ele = this.taskLink.nth(i);
      const txt = ele.innerText();
      if ((await txt) === taskText) {
        await ele.click();
        return;
      }
    }
  }
  async clickCreateReq() {
    await this.createReq.click();
  }

  async validateSubmittedPcrDetails(fieldName: string, expectedValue: string | RegExp) {
    const element = this.submittedDetails.replace("%s", fieldName);

    const actualValue = await this.page.textContent(element);
    if (!actualValue) {
      throw new Error(`Field with name "${fieldName}" was not found.`);
    }

    expect(actualValue.trim()).toMatch(expectedValue);
  }
}
