import { Locator, Page, expect } from "@playwright/test";
import { Fixture, Then, When } from "playwright-bdd/decorators";
import { PageHeading } from "../../components/PageHeading";
import { Button } from "../../components/Button";
import { ValidationMessage } from "../../components/ValidationMessage";
import { moAnswers } from "../../components/MonitoringAnswers";

export
@Fixture("monitoringReports")
class MonitoringReports {
  protected readonly page: Page;
  private readonly dashboardTitle: PageHeading;
  private readonly reportTitle: PageHeading;
  private readonly startButton: Locator;
  private readonly continueButton: Locator;
  private readonly saveAndReturnButton: Locator;
  private readonly openSubheading: Locator;
  private readonly archivedSubheading: Locator;
  private readonly periodSubheading: Locator;
  private readonly infoMessage: Locator;
  private readonly guidanceCopyOne: string;
  private readonly guidanceCopyTwo: string;
  private readonly period: Locator;
  private readonly legend: Locator;
  private readonly comments: Locator;
  private readonly submitComments: string;
  private readonly submitButton: Locator;
  private readonly periodValidationMessage: ValidationMessage;
  private readonly invalidPeriodCharMsg: ValidationMessage;
  private readonly invalidPeriodNumMsg: ValidationMessage;

  constructor({ page }: { page: Page }) {
    this.page = page;
    this.dashboardTitle = PageHeading.fromTitle(page, "Monitoring reports");
    this.reportTitle = PageHeading.fromTitle(page, "Monitoring Report");
    this.startButton = this.page.getByRole("link", { name: "Start a new report" });
    this.continueButton = Button.fromTitle(page, "Continue");
    this.saveAndReturnButton = Button.fromTitle(page, "Save and return to monitoring reports");
    this.openSubheading = this.page.getByRole("heading", { name: "Open" });
    this.archivedSubheading = this.page.getByRole("heading", { name: "Archived" });
    this.periodSubheading = this.page.getByRole("heading", { name: "Period" });
    this.legend = this.page.locator("css=legend");
    this.infoMessage = this.page.getByText(
      "You should submit reports for this project according to the schedule agreed with Innovate UK.",
    );
    this.guidanceCopyOne =
      "Each report refers to a period of the project. You may have more than one report per period.";
    this.guidanceCopyTwo =
      "For each section score the project against the criteria from 1 to 5, providing a comment explaining your reason. The report will be returned to you otherwise.";
    this.period = this.page.getByLabel("Period");
    this.periodValidationMessage = ValidationMessage.getByMessage(page, "Enter a period");
    this.invalidPeriodCharMsg = ValidationMessage.getByMessage(page, "Period must be a whole number, like 3.");
    this.invalidPeriodNumMsg = ValidationMessage.getByMessage(page, "Period must be between 1 and 11.");
    this.comments = this.page.getByRole("textbox");
    this.submitComments =
      "By submitting this report, you certify that from the project monitoring documents shown to you, this report represents your best opinion of the current progress of this project.";
    this.submitButton = this.page.getByRole("button", { name: "Submit report" });
  }

  @Then("the user sees the Monitoring Reports page")
  async isPage() {
    await expect(this.dashboardTitle.get()).toBeVisible();
    await expect(this.startButton).toBeVisible();
    await expect(this.infoMessage).toBeVisible();
    await expect(this.openSubheading).toBeVisible();
    await expect(this.archivedSubheading).toBeVisible();
  }

  @Then("the user can start a new report")
  async startReport() {
    await this.startButton.click();
    await expect(this.reportTitle.get()).toBeVisible();
    await expect(this.page.getByText(this.guidanceCopyOne)).toBeVisible();
    await expect(this.page.getByText(this.guidanceCopyTwo)).toBeVisible();
    await expect(this.period)
      .toBeVisible()
      .then(() => {
        this.page.getByRole("textbox").clear();
      });
    await expect(this.saveAndReturnButton).toBeVisible();
    await this.period.clear();
    await this.period.fill("1");
    await this.continueButton.click();
    await expect(this.periodSubheading).toContainText("Period 1");
  }

  @Then("the user can complete section {int}, {string}")
  async validRadioButtons(n: number, section: keyof typeof moAnswers) {
    await expect(this.periodSubheading).toBeVisible();
    await expect(this.legend).toContainText(section);
    for (const answer of moAnswers[section]) {
      await expect(this.page.getByLabel(answer)).toBeVisible();
    }
    await this.page.getByLabel(String(moAnswers[section][0])).click();
    await this.comments.clear();
    await this.comments.fill(`These are comments for ${String(section)}`);
    await this.continueButton.click();
  }

  @Then("the user can complete {string}")
  async fillOutText(section: string) {
    await expect(this.periodSubheading).toBeVisible();
    await expect(this.legend).toContainText(section);
    await expect(this.legend).toContainText(section);
    await this.comments.fill(`These are comments for ${String(section)}`);
    await this.continueButton.click();
  }

  @When("the user clicks submit")
  async clickSubmit() {
    await this.page.getByText(this.submitComments);
    await this.comments.fill("Now submitting complete Monitoring Report");
    await this.submitButton.click();
  }

  @Then("the user will see the report status {string}")
  async submittedStatus(status: string) {
    await expect(this.dashboardTitle.get()).toBeVisible();
    expect(this.page.getByRole("table")).toContainText(status);
  }
}

/**
 * Validation steps for later use.
 */
//await this.continueButton.click();
//await this.periodValidationMessage;
//for (const invalid of ["Lorem", "-", "1.1", "0.5", "100.5", "3000.5", "£$%^&*()", "dasq123cc", "1asd", "asff1"]) {
//  await this.period.clear();
//  await this.period.fill(invalid);
//  await this.continueButton.click();
//  await expect(this.invalidPeriodCharMsg);
//  await expect(this.paragraph).toContainText("Period must be a whole number, like 3.");
//}
//for (const invalid of ["-1", "-999999999999", "0", "12", "100", "99999999999999999999999999999999999999999"]) {
//  await this.period.clear();
//  await this.period.fill(invalid);
//  await this.continueButton.click();
//  await expect(this.invalidPeriodNumMsg);
//  await expect(this.paragraph).toContainText("Period must be between 1 and 11.");
//}
