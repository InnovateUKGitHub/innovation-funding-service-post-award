import { expect, Locator, Page } from "@playwright/test";
import { Fixture, When, Then } from "playwright-bdd/decorators";
import { Commands } from "../../../Commands";
import { PcrType } from "../../../../typings/pcr";
import { Button } from "../../../../components/Button";
import { loremIpsum100Char } from "../../../../components/lorem";
import { DataTable } from "playwright-bdd";
export
@Fixture("projectChangeRequests")
class ProjectChangeRequests {
  protected readonly page: Page;
  protected readonly commands: Commands;
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
  private readonly pmStatusComment: Locator;
  private readonly finalComments: string;

  constructor({ page, commands }: { page: Page; commands: Commands }) {
    this.page = page;
    this.commands = commands;
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
    this.pmStatusComment = this.page
      .getByTestId("projectChangeRequestStatusChangeTable")
      .filter({ hasText: this.commentsForMo });
    this.finalComments = "These are the final comments for Innovate UK.";
  }

  /**
   * This assumes the user is on the Start a request page and can see all PCR checkboxes.
   */
  @When("the user creates a {string} PCR")
  async createPCR(pcr: PcrType) {
    await this.commands.button("Create request").click();
    await this.commands.heading(this.startRequestHeader);
    await this.page.getByLabel(pcr).click();
    await this.createButton.click();
    await this.commands.heading("Request");
  }

  @Then("the user clicks the {string} PCR type")
  async selectPcrType(pcr: PcrType) {
    await this.page.getByRole("link").getByText(pcr).click();
    await this.commands.heading(pcr);
  }

  @Then("the request page will show {string} as {string}")
  async requestPagePcrStatus(pcr: PcrType, status: string) {
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
    await this.page.getByRole("textbox").fill(loremIpsum100Char);
    await this.commands.button("Save and continue").click();
    await expect(this.page.getByTestId("numberRow").filter({ hasText: "Request number" })).toBeVisible();
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
    let submissionList = [
      ["Request number", String(/[0-9]/)],
      ["Request type", pcr],
      ["Request started", String(this.commands.dateToday())],
      ["Request status", "Submitted to monitoring officer"],
      ["Request last updated", String(this.commands.dateToday())],
    ];
    for (const [key, list] of submissionList) {
      await await this.commands.getListItemFromKey(key, list);
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
    await this.requestHeading.isVisible();
    await this.detailsHeading.isVisible();
    const parent = this.page.locator("li").getByRole("heading").filter({ hasText: "Give us information" });
    await parent.getByRole("link").filter({ hasText: pcrType }).isVisible();
    await this.page.waitForTimeout(5000);
  }

  @When("the user clicks Next - Reasoning")
  async nextReasoning() {
    await this.page.getByTestId("arrow-left").filter({ hasText: "Next" }).isVisible();
    await this.page.getByTestId("arrow-left").filter({ hasText: "Reasoning" }).click();
  }

  @Then("the reasoning page displays the following")
  async reasoningPageDisplayed(table: DataTable) {
    const data = table.hashes();
    for (const row of data) await this.commands.getListItemFromKey(row["Key"], row["List item"]);
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
    this.sendRadioButton.click();
  }

  @Then("the user enters comments for the {string}")
  async enterComments(recipient: string) {
    if (recipient === "Project Manager") {
      await this.page.getByRole("textbox").fill(this.commentsForPm);
    } else if (recipient === "Monitoring Officer") {
      await this.page.getByRole("textbox").fill(this.commentsForMo);
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
    await row.locator("td").nth(4).filter({ hasText: status }).isVisible();
    /**
     * Setting a manual wait to ensure the snapshot is recorded.
     */
    await this.page.waitForTimeout(5000);
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
}
