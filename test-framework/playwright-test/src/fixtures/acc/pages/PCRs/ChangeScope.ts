import { expect, Locator, Page } from "@playwright/test";
import { Fixture, Then, When } from "playwright-bdd/decorators";
import { Commands } from "../../../Commands";
import { ProjectChangeRequests } from "./ProjectChangeRequests";
import { PageHeading } from "../../../../components/PageHeading";
import { getLorem, loremIpsum32k } from "../../../../components/lorem";

export
@Fixture("changeScope")
class ChangeProjectScope {
  protected readonly page: Page;
  protected readonly commands: Commands;
  protected readonly pcr: ProjectChangeRequests;
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
  private readonly textBox: Locator;
  private readonly fullCharRemaining: Locator;
  private readonly saveContinueButton: Locator;
  private readonly publishedSummaryTitle: Locator;
  private readonly proposedPubSummary: Locator;
  private readonly publishedPubSummary: Locator;
  private readonly publishedSummaryDetails: Locator;
  private readonly emptySummary: Array<[string, string]>;
  private readonly completedSummary: Array<[string, string]>;
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
  }: {
    page: Page;
    commands: Commands;
    projectChangeRequests: ProjectChangeRequests;
  }) {
    this.page = page;
    this.commands = commands;
    this.pcr = projectChangeRequests;
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
    this.publishedPubDescription = this.page.locator("css=summary").getByRole("paragraph");
    this.publishedDescriptionDetails = this.page
      .locator("css=details")
      .filter({ hasText: "Published public description" });
    this.descriptionHint = this.page
      .locator("#hint-for-description")
      .filter({ hasText: "This is required to complete this request." });
    this.textBox = this.page.getByRole("textbox");
    this.saveContinueButton = this.page.getByRole("button").filter({ hasText: "Save and continue" });
    this.proposedPubSummary = this.page.locator("css=legend").filter({ hasText: "Proposed public summary" });
    this.publishedSummaryTitle = this.page.locator("css=summary").filter({ hasText: "Published project summary" });
    this.publishedPubSummary = this.page.locator("css=summary").getByRole("paragraph");
    this.publishedSummaryDetails = this.page.locator("css=details").filter({ hasText: "Published project summary" });
    this.emptySummary = [
      ["Existing public description", "This is the public description."],
      ["New public description", "Description test"],
      ["Existing project summary", "This is the public summary."],
      ["New project summary", "Summary test"],
    ];
    this.fullCharRemaining = this.page
      .getByRole("paragraph")
      .filter({ hasText: "You have 32000 characters remaining" });
    this.completedSummary = [
      ["Existing public description", "This is the public description."],
      ["New public description", this.newPublicDescription],
      ["Existing project summary", "This is the project summary."],
      ["New project summary", this.newProjectSummary],
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
    await this.pageTitle.isVisible();
    await this.backToRequest.isVisible();
    await this.checkGuidance();
    await this.proposedDescription.isVisible();
    await this.publishedDescriptionTitle.isVisible();
    await this.publishedPubDescription.filter({ hasText: "This is the public description." }).isVisible();
    await this.descriptionHint.isVisible();
    await expect(this.textBox).toHaveValue("This is the public description.");
    await this.textBox.clear();
    await this.fullCharRemaining.isVisible();
    await this.saveContinueButton.isVisible();
    await this.clickDetailsExpand(false);
  }

  @When("the user navigates through to summary and marks as complete")
  async navigateToSummary() {
    await this.saveContinueButton.click();
    await this.publishedSummaryTitle.isVisible();
    await this.proposedPubSummary.isVisible();
    await this.publishedPubSummary.filter({ hasText: "This is the project summary." }).isVisible();
    await this.clickDetailsExpand(true);
    await this.descriptionHint.isVisible();
    await expect(this.textBox).toHaveValue("This is the project summary.");
    await this.textBox.clear();
    await this.saveContinueButton.click();
    await this.completedSummaryPageList();
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
    await this.descriptionEditLink.click();
    await this.publishedDescriptionTitle.isVisible();
    await this.commands.validationLink(this.enterPubDescription);
    await this.page.getByRole("paragraph").filter({ hasText: this.enterPubDescription }).isVisible();
    await this.textBox.fill("Description test");
    await this.saveContinueButton.click();
    await this.publishedSummaryTitle.isVisible();
    await this.commands.validationLink(this.enterProjSummary);
    await this.page.getByRole("paragraph").filter({ hasText: this.enterProjSummary }).isVisible();
    await this.textBox.fill("Summary test");
    await this.saveContinueButton.click();
    await this.emptySummaryPage();
    await this.summaryEditLink.click();
    await this.publishedSummaryTitle.isVisible();
    await this.saveContinueButton.click();
  }

  @Then("the user is brought to the correct page")
  async correctPage() {
    await this.emptySummaryPage();
    await this.descriptionEditLink.click();
    await this.publishedDescriptionTitle.isVisible();
  }

  @When("the user validates 32000 characters in each section correctly")
  async valTexBox() {
    await this.commands.textValidation("Public description", 32000, "Save and continue", true);
    await this.publishedSummaryTitle.isVisible();
    await this.backToRequest.isVisible();
    await this.commands.textValidation("Project summary", 32000, "Save and continue", true);
    await this.descriptionEditLink.click();
    await this.publishedDescriptionTitle.isVisible();
    await this.textBox.fill(this.newPublicDescription);
    await this.saveContinueButton.click();
    await this.publishedSummaryTitle.isVisible();
    await this.textBox.fill(this.newProjectSummary);
    await this.saveContinueButton.click();
  }

  @Then("a completed summary page is displayed")
  async completedSummaryPageList() {
    for (const [dt, dd] of this.completedSummary) {
      await this.commands.getListItemFromKey(dt, dd);
    }
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

  /**
   * METHODS
   */
  async checkGuidance() {
    await this.guidance.filter({ hasText: this.guidanceCopyDescription }).isVisible();
    await this.guidance.filter({ hasText: this.guidanceCopySummary }).isVisible();
    for (const li of this.guidanceCopyList) {
      await this.listItem.filter({ hasText: li }).isVisible();
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
    for (const [section, content] of this.emptySummary) {
      await this.commands.getListItemFromKey(section, content);
    }
  }
}
