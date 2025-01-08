import { expect, Locator, Page, Project } from "@playwright/test";
import { Fixture, Then, When } from "playwright-bdd/decorators";
import { Commands } from "../../../Commands";
import { ProjectChangeRequests } from "./ProjectChangeRequests";
import { PageHeading } from "../../../../components/PageHeading";
import { Validators } from "../../../validators";
import { DataTable } from "playwright-bdd";

export
@Fixture("removePartner")
class RemovePartner {
  protected readonly page: Page;
  protected readonly commands: Commands;
  protected readonly pcr: ProjectChangeRequests;
  protected readonly validators: Validators;
  private readonly pageTitle: PageHeading;
  private readonly projectTitle: Locator;
  private readonly backToRequest: Locator;
  private readonly selectSubheading: Locator;
  private readonly partners: Array<string>;
  private readonly lastPeriodSubheading: Locator;
  private readonly lastPeriodGuidance: Locator;
  private readonly lastPeriodBox: Locator;
  private readonly saveAndContinueButton: Locator;
  private readonly validationMessage: string;
  private readonly certificateSubheading: Locator;
  private readonly certificateGuidance: Locator;
  private readonly certificateBullet1: Locator;
  private readonly certificateBullet2: Locator;
  private readonly certificateBullet3: Locator;
  private readonly uploadButton: Locator;
  private readonly fileInput: Locator;
  private readonly fileHeading: Locator;
  private readonly noDocMsg: Locator;
  private readonly noDocValidation: string;
  private readonly removalPartner: string;
  private readonly docSuccessMsg: Locator;
  private readonly summaryData: Array<[string, string]>;
  private readonly markCompleteHeading: Locator;
  private readonly iAgreeCheckBox: Locator;
  private readonly saveAndReturnToRequest: Locator;

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
    this.pageTitle = PageHeading.fromTitle(page, "Remove a partner");
    this.projectTitle = this.page.getByTestId("page-title").filter({ hasText: ".100" });
    this.backToRequest = this.commands.backLink("Back to request");
    this.selectSubheading = this.page.locator("css=legend").filter({ hasText: "Select partner to remove" });
    this.partners = ["Hedge's Primary Ltd.", "Hedge's Secondary Ltd."];
    this.lastPeriodSubheading = this.page.getByText("When is their last period?");
    this.lastPeriodGuidance = this.page.locator("#hint-for-removalPeriod").filter({
      hasText:
        "The partner can make a claim for this period before being removed. If they have a claim in progress, they will be removed once that claim has been paid.",
    });
    this.lastPeriodBox = this.page.getByLabel("Removal period");
    this.saveAndContinueButton = this.page.getByRole("button").filter({ hasText: "Save and continue" });
    this.validationMessage = "Removal period must be a number.";
    this.certificateSubheading = this.page
      .locator("css=legend")
      .filter({ hasText: "Upload withdrawal of partner certificate" });
    this.certificateGuidance = this.page.getByRole("paragraph").filter({ hasText: "You must upload these documents:" });
    this.certificateBullet1 = this.page.getByRole("list").filter({
      hasText:
        "a confirmation letter on headed paper from the partner who is leaving, signed by someone with financial authority",
    });
    this.certificateBullet2 = this.page.getByRole("list").filter({
      hasText: "a brief list of the outstanding deliverables, and who each will be assigned to once the partner leaves",
    });
    this.certificateBullet3 = this.page.getByRole("list").filter({
      hasText: "copies of signed letters from all other project partners to show they have agreed to this change",
    });
    this.uploadButton = this.page.getByRole("button").filter({ hasText: "Upload documents" });
    this.fileInput = this.page.locator("#files");
    this.fileHeading = this.page.getByRole("heading").filter({ hasText: "Files uploaded" });
    this.noDocMsg = this.page.getByRole("paragraph").filter({ hasText: "No documents uploaded." });
    this.noDocValidation = "Choose a file to upload.";
    this.removalPartner = this.partners[1];
    this.docSuccessMsg = this.commands.validationNotification("Your document has been uploaded.");
    this.summaryData = [
      ["Partner being removed", this.removalPartner],
      ["Last period", "5"],
      ["Documents", "add.png"],
    ];
    this.markCompleteHeading = this.page.locator("css=legend").filter({ hasText: "Mark as complete" });
    this.iAgreeCheckBox = this.page.getByLabel("I agree with this change.");
    this.saveAndReturnToRequest = this.page.getByRole("button").filter({ hasText: "Save and return to request" });
  }
  //TODO: This is not a thorough and complete test yet. Further validation steps are required.

  @Then("the user sees the Remove a partner selection page")
  async selectionPage() {
    await expect(this.backToRequest).toBeVisible();
    await this.pageTitle.isVisible();
    await expect(this.projectTitle).toBeVisible();
    await expect(this.selectSubheading).toBeVisible();
    for (const partner of this.partners) {
      await expect(this.page.getByLabel(partner)).toBeVisible();
    }
    await this.page.getByLabel(this.partners[1]).click();
    await expect(this.lastPeriodSubheading).toBeVisible();
    await expect(this.lastPeriodGuidance).toBeVisible();
    await expect(this.lastPeriodBox).toBeVisible();
    await expect(this.saveAndContinueButton).toBeVisible();
    await expect(this.page.getByLabel(this.removalPartner)).toBeVisible();
  }

  @When("the user enters an invalid last period number")
  async invalidPeriod() {
    await this.validators.validatePositiveWholeNumber(
      "Removal period",
      "Removal period",
      "5",
      false,
      "Save and continue",
    );
    await this.lastPeriodBox.fill("wibble");
    await this.saveAndContinueButton.click();
  }

  @Then("the correct validation message will display")
  async validationMessageDisplays() {
    await this.commands.validationLink(this.validationMessage);
  }

  @When("the user enters a valid last period")
  async validPeriod() {
    await this.lastPeriodBox.fill("5");
  }

  @Then("the partner certificate page is displayed")
  async certificatePage() {
    await expect(this.certificateSubheading).toBeVisible();
    await expect(this.certificateGuidance).toBeVisible();
    await expect(this.certificateBullet1).toBeVisible();
    await expect(this.certificateBullet2).toBeVisible();
    await expect(this.certificateBullet3).toBeVisible();
    await this.commands.learnFiles();
    await expect(this.uploadButton).toBeVisible();
    await expect(this.fileInput).toBeVisible();
    await expect(this.fileHeading).toBeVisible();
    await expect(this.noDocMsg).toBeVisible();
    await expect(this.saveAndContinueButton).toBeVisible();
  }

  @When("the user clicks upload without selecting a document")
  async validateNoFile() {
    await this.uploadButton.click();
  }

  @Then("a choose file validation message is displayed")
  async chooseFileMessage() {
    await this.commands.validationLink(this.noDocValidation);
    await expect(this.page.getByRole("paragraph").filter({ hasText: this.noDocValidation })).toBeVisible();
  }

  @When("the user uploads a file")
  async uploadRemoveCertificate() {
    await this.page.locator("css=#files").setInputFiles("src/components/testFiles/add.png");
    await this.uploadButton.click();
    await expect(this.docSuccessMsg).toBeVisible();
  }

  @Then("the Remove a partner summary page is displayed")
  async removePartnerSummary() {
    let i = 0;
    for (const [key, list] of this.summaryData)
      await this.commands.getListItemFromKey(key, list, true, false, "name-change-summary-list");
    i++;
  }

  @When("the user marks as complete and saves")
  async markCompleteSave() {
    await expect(this.markCompleteHeading).toBeVisible();
    await this.iAgreeCheckBox.click();
    await this.saveAndReturnToRequest.click();
  }

  @Then("the user can see the Remove a partner PCR summary")
  async removePartnerMOSummary(table: DataTable) {
    let data = table.hashes();
    for (const row of data) {
      await this.commands.getListItemFromKey(row["Section"], row["Content"], true, false, "name-change-summary-list");
    }
  }
}
