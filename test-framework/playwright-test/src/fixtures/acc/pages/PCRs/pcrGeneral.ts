import { expect, Locator, Page } from "@playwright/test";
import { Fixture, When, Then } from "playwright-bdd/decorators";
import { Commands } from "../../../Commands";
import { PcrType } from "../../../../typings/pcr";
import { Button } from "../../../../components/Button";
import { loremIpsum100Char } from "../../../../components/lorem";
export
@Fixture("projectChangeRequests")
class ProjectChangeRequests {
  protected readonly page: Page;
  protected readonly commands: Commands;
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

  constructor({ page, commands }: { page: Page; commands: Commands }) {
    this.page = page;
    this.commands = commands;
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
      await (await this.commands.getListItemFromKey(key, list)).isVisible();
    }
    await expect(this.page.getByRole("link").filter({ hasText: "Review request" })).toBeVisible();
    await expect(this.commands.button("Return to project change requests")).toBeVisible();
  }
}
