import { expect, Locator, Page } from "@playwright/test";
import { Fixture, Then, When } from "playwright-bdd/decorators";
import { Commands } from "../../../Commands";
import { ProjectChangeRequests } from "./ProjectChangeRequests";
import { PageHeading } from "../../../../components/PageHeading";
import { Validators } from "../../../validators";
export
@Fixture("changeScope")
class ChangeProjectScope {
  protected readonly page: Page;
  protected readonly commands: Commands;
  protected readonly pcr: ProjectChangeRequests;
  protected readonly validators: Validators;
  private readonly pageTitle: PageHeading;
  private readonly backToRequest: Locator;
  private readonly guidance: Locator;
  private readonly guidanceCopyDescription: string;
  private readonly guidanceCopySummary: string;
  private readonly guidanceCopyList: Array<string>;
  private readonly listItem: Locator;
  private readonly proposedDescription: Locator;
  private readonly publishedDescriptionTitle: Locator;
  private readonly publishedPubDescription: Locator;
  private readonly publishedDescriptionDetails: Locator;
  private readonly descriptionHint: Locator;
  private readonly summaryHint: Locator;
  private readonly textBox: Locator;
  private readonly fullCharRemaining: Locator;
  private readonly saveContinueButton: Locator;
  private readonly publishedSummaryTitle: Locator;
  private readonly proposedPubSummary: Locator;
  private readonly publishedPubSummary: Locator;
  private readonly publishedSummaryDetails: Locator;
  private readonly emptySummary: Array<[string, string]>;
  private readonly completedSummary: Array<[string, string, string]>;
  private readonly bothEmptyValidation: Array<string>;
  private readonly descriptionEditLink: Locator;
  private readonly summaryEditLink: Locator;
  private readonly enterPubDescription: string;
  private readonly enterProjSummary: string;
  private readonly newPublicDescription: string;
  private readonly newProjectSummary: string;

  constructor({
    page,
    commands,
    projectChangeRequests,
    validators,
  }: {
    page: Page;
    commands: Commands;
    projectChangeRequests: ProjectChangeRequests;
    validators: Validators;
  }) {
    this.page = page;
    this.commands = commands;
    this.pcr = projectChangeRequests;
    this.validators = validators;
    this.pageTitle = this.pageTitle = PageHeading.fromTitle(page, "Change project scope");
    this.backToRequest = this.commands.backLink("Back to request");
    this.guidance = this.page.getByTestId("guidance");
    this.guidanceCopyDescription =
      "Your public description is published in line with government practice on openness and transparency of public-funded activities. It should describe your project in a way that will be easy for a non-specialist to understand. Do not include any information that is confidential, for example, intellectual property or patent details.";
    this.guidanceCopySummary = "Your project summary should provide a clear overview of the whole project, including:";
    this.guidanceCopyList = [
      "your vision for the project",
      "key objectives",
      "main areas of focus",
      "details of how it is innovative",
    ];
    this.listItem = this.page.getByTestId("guidance").locator("css=li");
    this.proposedDescription = this.page.locator("css=legend").filter({ hasText: "Proposed public description" });
    this.publishedDescriptionTitle = this.page
      .locator("css=summary")
      .filter({ hasText: "Published public description" });
    this.publishedPubDescription = this.page
      .locator("//details//div//p")
      .filter({ hasText: "This is a public description" });
    this.publishedDescriptionDetails = this.page
      .locator("css=details")
      .filter({ hasText: "Published public description" });
    this.descriptionHint = this.page
      .locator("css=#hint-for-description")
      .filter({ hasText: "This is required to complete this request." });
    this.summaryHint = this.page
      .locator("css=#hint-for-summary")
      .filter({ hasText: "This is required to complete this request." });
    this.textBox = this.page.getByRole("textbox");
    this.saveContinueButton = this.page.getByRole("button").filter({ hasText: "Save and continue" });
    this.proposedPubSummary = this.page.locator("css=legend").filter({ hasText: "Proposed project summary" });
    this.publishedSummaryTitle = this.page.locator("css=summary").filter({ hasText: "Published project summary" });
    this.publishedPubSummary = this.page.locator("//details//div//p").filter({ hasText: "This is a project summary" });
    this.publishedSummaryDetails = this.page.locator("css=details").filter({ hasText: "Published project summary" });
    this.emptySummary = [
      ["Existing public description", "This is a public description"],
      ["New public description", "Description test"],
      ["Existing project summary", "This is a project summary"],
      ["New project summary", "Summary test"],
    ];
    this.fullCharRemaining = this.page
      .getByRole("paragraph")
      .filter({ hasText: "You have 32000 characters remaining" });
    this.completedSummary = [
      ["Existing public description", "This is a public description", "currentPublicDescription"],
      ["New public description", this.newPublicDescription, "newPublicDescription"],
      ["Existing project summary", "This is a project summary", "currentProjectSummary"],
      ["New project summary", this.newProjectSummary, "newProjectSummary"],
    ];
    this.bothEmptyValidation = ["Enter project summary.", "Enter public description."];
    this.descriptionEditLink = this.page.locator("//dl//div[2]//dd[2]").getByRole("link").filter({ hasText: "Edit" });
    this.summaryEditLink = this.page.locator("//dl//div[4]//dd[2]").getByRole("link").filter({ hasText: "Edit" });
    this.enterPubDescription = "Enter public description.";
    this.enterProjSummary = "Enter project summary.";
    this.newPublicDescription = "This is the brand new public description.";
    this.newProjectSummary = "This is the brand new project summary.";
  }

  @Then("the Change project scope page is displayed")
  async changeScopeMainPage() {
    await expect(this.pageTitle.get()).toBeVisible();
    await expect(this.backToRequest).toBeVisible();
    await this.checkGuidance();
    await expect(this.proposedDescription).toBeVisible();
    await this.publishedDescriptionTitle.click();
    await expect(this.publishedPubDescription).toHaveText("This is a public description");
    await this.publishedDescriptionTitle.click();
    await expect(this.descriptionHint).toBeVisible();
    await expect(this.textBox).toHaveValue("This is a public description");
    await this.textBox.clear();
    await expect(this.fullCharRemaining).toBeVisible();
    await expect(this.saveContinueButton).toBeVisible();
    await this.clickDetailsExpand(false);
  }

  @When("the user navigates through to summary and marks as complete")
  async navigateToSummary() {
    await this.saveContinueButton.click();
    await expect(this.publishedSummaryTitle).toBeVisible();
    await expect(this.proposedPubSummary).toBeVisible();
    await expect(this.publishedPubSummary).toHaveText("This is a project summary");
    await this.clickDetailsExpand(true);
    await expect(this.summaryHint).toBeVisible();
    await expect(this.textBox).toHaveValue("This is a project summary");
    await this.textBox.clear();
    await this.saveContinueButton.click();
    await this.commands.getListItemFromKey("Existing public description", "This is a public description", true);
    await this.pcr.markAsCompleteSection(true);
  }

  @Then("validation messages will advise of empty sections")
  async validateEmptySection() {
    for (const msg of this.bothEmptyValidation) {
      await this.commands.validationLink(msg);
    }
  }

  @When("the user clicks an Edit button")
  async followEditToCorrectPage() {
    await this.clickPubDescriptionEdit();
    await this.commands.validationLink(this.enterPubDescription);
    await expect(this.page.getByRole("paragraph").filter({ hasText: this.enterPubDescription })).toBeVisible();
    await this.textBox.fill("Description test");
    await this.saveContinueButton.click();
    await expect(this.publishedSummaryTitle).toBeVisible();
    await this.commands.validationLink(this.enterProjSummary);
    await expect(this.page.getByRole("paragraph").filter({ hasText: this.enterProjSummary })).toBeVisible();
    await this.textBox.fill("Summary test");
    await this.saveContinueButton.click();
    await this.emptySummaryPage();
    await this.summaryEditLink.click();
    await expect(this.publishedSummaryTitle).toBeVisible();
    await this.saveContinueButton.click();
  }

  @When("the user clicks Edit against Public description")
  async clickPubDescriptionEdit() {
    await this.descriptionEditLink.click();
    await expect(this.publishedDescriptionTitle).toBeVisible();
  }

  @Then("the user is brought to the project description page")
  async correctPage() {
    await this.emptySummaryPage();
    await this.descriptionEditLink.click();
    await expect(this.publishedDescriptionTitle).toBeVisible();
  }

  @When("the user validates 32000 characters in each section correctly")
  async valTexBox() {
    await this.validators.textValidation("Public description", 32000, "Save and continue", true);
    await expect(this.publishedSummaryTitle).toBeVisible();
    await expect(this.backToRequest).toBeVisible();
    await this.validators.textValidation("Project summary", 32000, "Save and continue", true);
    await this.descriptionEditLink.click();
    await expect(this.publishedDescriptionTitle).toBeVisible();
    await this.textBox.fill(this.newPublicDescription);
    await this.saveContinueButton.click();
    await expect(this.publishedSummaryTitle).toBeVisible();
    await this.textBox.fill(this.newProjectSummary);
    await this.saveContinueButton.click();
  }

  @Then("a completed summary page is displayed")
  async completedSummaryPageList() {
    await expect(this.page.locator("css=legend").filter({ hasText: "Mark as complete" })).toBeVisible();
    await this.commands.getListItemFromKey(
      "Existing public description",
      "This is a public description",
      true,
      false,
      "currentPublicDescription",
    );
    await this.commands.getListItemFromKey(
      "New public description",
      this.newPublicDescription,
      true,
      false,
      "newPublicDescription",
    );
    await this.commands.getListItemFromKey(
      "Existing project summary",
      "This is a project summary",
      true,
      false,
      "currentProjectSummary",
    );
    await this.commands.getListItemFromKey(
      "New project summary",
      this.newProjectSummary,
      true,
      false,
      "newProjectSummary",
    );
  }

  @When("the user clicks Save and return to request")
  async clickSaveAndReturn() {
    await this.pcr.markAsCompleteSection(true);
  }

  /**
   * Note that I was unable to utilise getListItemFromKey on this specific page, despite experimentation.
   * As a result I adopted xpath on this occasion to get the test to run and pass.
   */
  @Then("a read-only summary page is displayed")
  async readonlySummary() {
    let i = 1;
    for (const [dt, dd] of this.completedSummary) {
      await expect(this.page.locator(`//dl//div[${i}]//dt[1]`).filter({ hasText: dt })).toBeVisible();
      await expect(this.page.locator(`//dl//div[${i}]//dd[1]//p`).filter({ hasText: dd })).toBeVisible();
      await expect(this.page.locator(`//dl//div[${i}]//dd[2]`).filter({ hasText: "Edit" })).not.toBeVisible();
      i++;
    }
  }

  @Then("the user will see the Proposed project summary page")
  async proposeSummaryPage() {
    await expect(this.proposedPubSummary).toBeVisible();
  }

  @When("the user saves a change to the Project description")
  async updateTextBoxAndSave() {
    await this.page.getByRole("textbox").fill("This is a test message.");
    await this.saveContinueButton.click();
  }

  /**
   * METHODS
   */
  async checkGuidance() {
    await expect(this.guidance.filter({ hasText: this.guidanceCopyDescription })).toBeVisible();
    await expect(this.guidance.filter({ hasText: this.guidanceCopySummary })).toBeVisible();
    for (const li of this.guidanceCopyList) {
      await expect(this.listItem.filter({ hasText: li })).toBeVisible();
    }
  }

  async clickDetailsExpand(summary: boolean) {
    if (summary) {
      await this.publishedSummaryTitle.click();
      await expect(this.publishedSummaryDetails).toHaveAttribute("open");
      await this.publishedSummaryTitle.click();
      await expect(this.publishedSummaryDetails).not.toHaveAttribute("open");
    } else {
      await this.publishedDescriptionTitle.click();
      await expect(this.publishedDescriptionDetails).toHaveAttribute("open");
      await this.publishedDescriptionTitle.click();
      await expect(this.publishedDescriptionDetails).not.toHaveAttribute("open");
    }
  }

  async emptySummaryPage() {
    let i = 1;
    for (const [section, content] of this.emptySummary) {
      await this.commands.getListItemFromKey(section, content, true);
      i++;
    }
  }
}
