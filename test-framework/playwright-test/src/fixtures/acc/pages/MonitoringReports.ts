import { Locator, Page, expect } from "@playwright/test";
import { Fixture, Given, Then, When } from "playwright-bdd/decorators";
import { PageHeading } from "../../../components/PageHeading";
import { Button } from "../../../components/Button";
import { moAnswers } from "../../../components/Monitoring/MonitoringAnswers";
import { getLorem } from "../../../components/lorem";
export
@Fixture("monitoringReports")
class MonitoringReports {
  protected readonly page: Page;
  private readonly dashboardTitle: PageHeading;
  private readonly reportTitle: PageHeading;
  private readonly startButton: Locator;
  private readonly continueButton: Locator;
  private readonly saveAndReturnButton: Locator;
  private readonly saveAndReturnSummary: Locator;
  private readonly saveAndReturnProject: Locator;
  private readonly openSubheading: Locator;
  private readonly archivedSubheading: Locator;
  private readonly periodSubheading: Locator;
  private readonly infoMessage: Locator;
  private readonly guidanceCopyOne: string;
  private readonly guidanceCopyTwo: string;
  private readonly period: Locator;
  private readonly legend: Locator;
  private readonly scopeEditLink: Locator;
  private readonly statusCommentsLog: Locator;
  private readonly addComments: string;
  private readonly commentsLabel: Locator;
  private readonly commentsBox: Locator;
  private readonly commentHint: Locator;
  private readonly characterCounter5k: Locator;
  private readonly submitComments: string;
  private readonly submitButton: Locator;
  private readonly sectioncopyComments: Array<string>;
  private readonly sectioncopyScore: Array<string>;
  private readonly summarySubheadings: Array<string>;
  private readonly alert: Locator;
  private readonly summarySectionGuidance: string;
  private readonly issuesSectionGuidance: string;
  private readonly submissionGuidance: string;

  constructor({ page }: { page: Page }) {
    this.page = page;
    this.dashboardTitle = PageHeading.fromTitle(page, "Monitoring reports");
    this.reportTitle = PageHeading.fromTitle(page, "Monitoring Report");
    this.startButton = this.page.getByRole("link", { name: "Start a new report" });
    this.continueButton = Button.fromTitle(page, "Continue");
    this.saveAndReturnButton = Button.fromTitle(page, "Save and return to monitoring reports");
    this.saveAndReturnSummary = Button.fromTitle(page, "Save and return to summary");
    this.saveAndReturnProject = Button.fromTitle(page, "Save and return to project");
    this.openSubheading = this.page.getByRole("heading", { name: "Open" });
    this.archivedSubheading = this.page.getByRole("heading", { name: "Archived" });
    this.periodSubheading = this.page.getByRole("heading", { name: "Period" });
    this.legend = this.page.locator("css=legend");
    this.scopeEditLink = this.page.getByTestId("question-1-score").getByRole("link");
    this.addComments = "Add comments";
    this.statusCommentsLog = Button.fromTitle(page, "Status and comments log");
    this.infoMessage = this.page.getByText(
      "You should submit reports for this project according to the schedule agreed with Innovate UK.",
    );
    this.guidanceCopyOne =
      "Each report refers to a period of the project. You may have more than one report per period.";
    this.guidanceCopyTwo =
      "For each section score the project against the criteria from 1 to 5, providing a comment explaining your reason. The report will be returned to you otherwise.";
    this.submissionGuidance =
      "By submitting this report, you certify that from the project monitoring documents shown to you, this report represents your best opinion of the current progress of this project.";
    this.period = this.page.getByLabel("Period");
    this.alert = this.page.getByRole("alert").filter({ has: page.getByRole("list") });
    this.commentsLabel = this.page
      .locator("[data-qa=label-additional-comments-text-area]")
      .filter({ hasText: "Comment" });
    this.commentsBox = this.page.getByRole("textbox");
    this.commentHint = this.page
      .locator("[data-qa=hint-additional-comments-text-area]")
      .filter({ hasText: "If you want to explain anything to Innovate UK, add it here." });
    this.sectioncopyComments = [
      "scope",
      "time",
      "cost",
      "exploitation",
      "risk management",
      "project planning",
      "summary",
      "issues and actions",
    ];
    this.summarySubheadings = [
      "Scope",
      "Time",
      "Cost",
      "Exploitation",
      "Risk management",
      "Project planning",
      "Summary",
      "Issues and actions",
    ];
    this.sectioncopyScore = ["scope", "time", "cost", "exploitation", "risk management", "project planning"];
    this.characterCounter5k = this.page.getByText("You have 5000 characters remaining");
    this.submitComments =
      "By submitting this report, you certify that from the project monitoring documents shown to you, this report represents your best opinion of the current progress of this project.";
    this.submitButton = this.page.getByRole("button", { name: "Submit report" });
    this.summarySectionGuidance =
      "Please summarise the project's key achievements and the key issues and risks that it faces.";
    this.issuesSectionGuidance =
      "Please confirm any specific issues that require Technology Strategy Board intervention - e.g. apparent scope change, partner changes, budget virements or time extensions.";
  }

  async validationMessage(message: string) {
    await expect(this.alert.filter({ has: this.page.getByRole("link", { name: message }) })).toBeVisible();
  }

  async paragraph(content: string) {
    await expect(this.page.getByRole("paragraph").filter({ hasText: content })).toBeVisible();
  }

  async summaryListItem(qaTag: string, content: string) {
    await expect(this.page.locator(`[data-qa=${qaTag}]`).filter({ hasText: content })).toBeVisible();
  }

  async heading(content: string) {
    await expect(this.page.getByRole("heading").filter({ hasText: content })).toBeVisible();
  }

  //STEP DEFINITIONS//

  /**
   * Monitoring dashboard is visible.
   */
  @Then("the user sees the monitoring reports page")
  async isPage() {
    await expect(this.dashboardTitle.get()).toBeVisible();
    await expect(this.startButton).toBeVisible();
    await expect(this.infoMessage).toBeVisible();
    await expect(this.openSubheading).toBeVisible();
    await expect(this.archivedSubheading).toBeVisible();
  }
  //

  @Given("the user is on the monitoring reports dashboard")
  async isOnMonitoringReports() {
    await this.dashboardTitle.isVisible();
  }

  @When("the user clicks start a new report")
  async clickStartReport() {
    await this.startButton.click();
  }

  /**
   * Creation page is visible.
   */
  @Then("the user will see the create page with period box")
  async periodPage() {
    await expect(this.reportTitle.get()).toBeVisible();
    await this.paragraph(this.guidanceCopyOne);
    await this.paragraph(this.guidanceCopyTwo);
    await expect(this.period).toBeVisible();
    await expect(this.saveAndReturnButton).toBeVisible();
  }
  //

  /**
   * Completing every section of the report on after the other with validation.
   */
  @When("the user completes the monitoring report")
  async completeAllMonitoringReportSections() {
    await this.inputInvalid();
    await this.continueToSectionOne();
    await this.backLinkVisible("Monitoring reports");
    await this.clickSaveReturnValidateSummary();
    await this.seeMOSectionHeading("Scope");
    await this.validateMonitoringSection("scope", 32001, true);
    await this.completeNumberedMonitoringReportSection("Scope");
    await this.seeMOSectionHeading("Time");
    await this.validateMonitoringSection("time", 32001, true);
    await this.backLinkVisible("scope");
    await this.completeNumberedMonitoringReportSection("Time");
    await this.seeMOSectionHeading("Cost");
    await this.validateMonitoringSection("cost", 32001, true);
    await this.backLinkVisible("time");
    await this.completeNumberedMonitoringReportSection("Cost");
    await this.seeMOSectionHeading("Exploitation");
    await this.validateMonitoringSection("exploitation", 32001, true);
    await this.backLinkVisible("cost");
    await this.completeNumberedMonitoringReportSection("Exploitation");
    await this.seeMOSectionHeading("Risk");
    await this.validateMonitoringSection("risk management", 32001, true);
    await this.backLinkVisible("exploitation");
    await this.completeNumberedMonitoringReportSection("Risk");
    await this.seeMOSectionHeading("Project planning");
    await this.validateMonitoringSection("project planning", 32001, true);
    await this.backLinkVisible("risk");
    await this.completeNumberedMonitoringReportSection("planning");
    await this.seeMOSectionHeading("Summary");
    await this.validateMonitoringSection("summary", 32001, false);
    await this.backLinkVisible("project planning");
    await this.completeTextOnlySection("Summary");
    await this.seeMOSectionHeading("Issues and actions");
    await this.validateMonitoringSection("issues and actions", 32001, false);
    await this.backLinkVisible("summary");
    await this.completeTextOnlySection("Issues and actions");
  }
  //

  @Then("the user will see the completed summary page")
  async completedSummaryPage() {
    this.completedSummaryItemWithAnswers("Scope", 1);
    this.completedSummaryItemWithAnswers("Time", 2);
    this.completedSummaryItemWithAnswers("Cost", 3);
    this.completedSummaryItemWithAnswers("Exploitation", 4);
    this.completedSummaryItemWithAnswers("Risk", 5);
    this.completedSummaryItemWithAnswers("planning", 6);
    this.completedSummaryItemCommentsOnly();
  }

  async completedSummaryItemWithAnswers(sectionName: keyof typeof moAnswers, sectionNumber: number) {
    await this.summaryListItem(`summary-question-${String(sectionNumber)}`, moAnswers[sectionName][0]);
    await this.summaryListItem(`summary-question-${String(sectionNumber)}`, `These are comments for ${sectionName}`);
  }

  async completedSummaryItemCommentsOnly() {
    await this.summaryListItem(`summary-question-7`, `These are comments for Summary`);
    await this.summaryListItem(`summary-question-8`, `These are comments for Issues and actions`);
  }

  /**
   * Validating the period box.
   */
  async inputInvalid() {
    await this.period.clear();
    await this.continueButton.click();
    await this.validationMessage("Enter period.");
    await this.inputInvalStep(
      ["Lorem", "-", "1.1", "0.5", "100.5", "3000.5", "£$%^&*()", "dasq123cc", "1asd", "asff1"],
      "Period must be a whole number, like 3.",
    );
    await this.inputInvalStep(
      ["-1", "-999999999999", "0", "12", "100", "99999999999999999999999999999999999999999"],
      "Period must be 1.",
    );
  }
  //

  /**
   * Method relating to 'the user submits invalid characters' definition.
   */
  private async inputInvalStep(values: string[], errormsg: string) {
    for (const invalid of values) {
      await this.period.clear();
      await this.period.fill(invalid);
      await this.continueButton.click();
      await this.validationMessage(errormsg);
      await this.paragraph(errormsg);
    }
  }
  //

  async continueToSectionOne() {
    await this.period.clear();
    await this.period.fill("1");
    await this.continueButton.click();
  }

  async clickSaveReturnValidateSummary() {
    await this.saveAndReturnSummary.click();
    await this.summaryPage();
    await this.submitButton.click();
    await this.validateSummaryPage();
    await expect(this.scopeEditLink).toHaveText("Edit");
    await this.scopeEditLink.click();
    await this.seeQuestionsSection("Scope");
  }

  /**
   * Summary page is visible
   */

  async summaryPage() {
    for (let i = 1; i < 6; i++) {
      await this.summaryListItem(`summary-question-${i}`, "Score");
      await this.summaryListItem(`summary-question-${i}`, "Comments");
    }
    await this.summaryListItem(`summary-question-7`, "Comments");
    await this.summaryListItem(`summary-question-8`, "Comments");
    for (const header of this.summarySubheadings) {
      await this.heading(header);
    }
    await expect(this.statusCommentsLog).toBeVisible();
    await expect(this.legend.filter({ hasText: this.addComments })).toBeVisible();
    await expect(this.commentsBox).toBeVisible();
    await expect(this.commentsLabel).toBeVisible();
    await expect(this.commentHint).toBeVisible();
    await expect(this.characterCounter5k).toBeVisible();
    await this.paragraph(this.submissionGuidance);
    await expect(this.submitButton).toBeVisible();
    await expect(this.saveAndReturnProject).toBeVisible();
  }
  //

  @When("the user clicks the Submit button")
  async clickSubmitButton() {
    await this.submitButton.click();
  }

  /**
   * Validating summary page with incomplete sections.
   */
  async validateSummaryPage() {
    for (const val of this.sectioncopyComments) {
      await this.validationMessage(`Enter comments for ${val}.`);
    }
    for (const val of this.sectioncopyScore) {
      await this.validationMessage(`Enter a score for ${val}.`);
    }
    await this.validationMessage("Enter comments.");
  }
  //

  async seeQuestionsSection(section: string) {
    await expect(this.periodSubheading).toBeVisible();
    await expect(this.legend).toContainText(section);
    for (const answer of moAnswers[section]) {
      await expect(this.page.getByLabel(answer)).toBeVisible();
    }
  }

  /**
   * Viewing specific section information that doesn't have monitoring answers.
   */
  @Then("the user can see the text-only {string} page")
  async seeTextSection(section: string) {
    if ((section = "Summary")) {
      await this.paragraph(this.summarySectionGuidance);
    } else if ((section = "Issues and actions")) {
      await this.paragraph(this.issuesSectionGuidance);
    }
    await expect(this.periodSubheading).toBeVisible();
    await expect(this.legend).toContainText(section);
  }
  //

  async backLinkVisible(section: string) {
    await expect(this.page.getByRole("link").filter({ hasText: `Back to ${section}` })).toBeVisible();
  }

  async validateMonitoringSection(section: string, length: number, hasquestions: boolean) {
    if (hasquestions) {
      await this.commentsBox.fill("Test");
      await this.continueButton.click();
      await this.validationMessage(`Enter score for ${section}`);
    }
    let lorem = getLorem(length);
    let validNumber = length - 1;
    let characters = validNumber.toString();
    await this.commentsBox.clear();
    await this.commentsBox.fill(lorem);
    await this.continueButton.click();
    await this.validationMessage(`Comments for ${section} must be ${characters} characters or less.`);
  }

  @Given("the user can see the {string} heading")
  async seeMOSectionHeading(section: string) {
    await expect(this.legend).toContainText(section);
  }

  @Then("the user can see the period subheading")
  async seePeriodSubheading() {
    await expect(this.periodSubheading).toBeVisible();
  }

  @When("the user clicks each {string} answer")
  async completeMoReportAnswers(section: keyof typeof moAnswers) {
    for (const answer of moAnswers[section]) {
      await this.page.getByLabel(answer).click();
    }
  }

  /**
   * Method used in 'the user can complete the monitoring report' definition.
   */
  async completeMonitoringReportSection(section: string) {
    await expect(this.periodSubheading).toBeVisible();
    await expect(this.legend).toContainText(section);
    await this.commentsBox.fill(`These are comments for ${String(section)}`);
    await this.continueButton.click();
  }
  //

  /**
   * Completes a specific section with multiple choice answers.
   */
  @Then("the user completes the monitoring report section {int}, {string}")
  async completeNumberedMonitoringReportSection(section: keyof typeof moAnswers) {
    await expect(this.periodSubheading).toBeVisible();
    await expect(this.legend).toContainText(section);
    for (const answer of moAnswers[section]) {
      await expect(this.page.getByLabel(answer)).toBeVisible();
    }
    await this.page.getByLabel(String(moAnswers[section][0])).click();
    await this.commentsBox.clear();
    await this.commentsBox.fill(`These are comments for ${String(section)}`);
    await this.continueButton.click();
  }
  //

  /**
   * Completes a specific section that does not have multiple-choice
   */
  @Then("the user completes the text-only section {int}, {string}")
  async completeTextOnlySection(section: string) {
    await expect(this.periodSubheading).toBeVisible();
    await expect(this.legend).toContainText(section);
    await this.commentsBox.clear();
    await this.commentsBox.fill(`These are comments for ${String(section)}`);
    await this.continueButton.click();
  }
  //

  @When("the user submits the report")
  async clickSubmit() {
    await this.paragraph(this.submitComments);
    await this.commentsBox.fill("Now submitting complete Monitoring Report");
    await this.submitButton.click();
  }

  @Then("the user sees the report status is {string}")
  async submittedStatus(status: string) {
    await expect(this.dashboardTitle.get()).toBeVisible();
    await expect(this.page.getByRole("table")).toContainText(status);
  }
}
