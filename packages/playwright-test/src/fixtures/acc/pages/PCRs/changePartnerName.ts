import { expect, Locator, Page } from "@playwright/test";
import { Fixture, Given, Then, When } from "playwright-bdd/decorators";
import { Commands } from "../../../Commands";
import { ProjectChangeRequests } from "./ProjectChangeRequests";
import { AccNavigation } from "../../AccNavigation";
import { getLorem } from "../../../../components/lorem";
import { Validators } from "../../../validators";
import { DataTable } from "playwright-bdd";

export
@Fixture("changePartnerName")
class ChangePartnerName {
  protected readonly page: Page;
  protected readonly commands: Commands;
  protected readonly pcr: ProjectChangeRequests;
  protected readonly navigation: AccNavigation;
  protected readonly validators: Validators;
  private readonly changeNamePageHeading: Locator;
  private readonly backToRequest: Locator;
  private readonly changeNameGuidance: string;
  private readonly changeNameGuidanceParagraph: Locator;
  private readonly selectPartnerSubheading: Locator;
  private readonly existingPartnerNames: Array<string>;
  private readonly enterNewNameSubheading: Locator;
  private readonly newNameHint: Locator;
  private readonly saveAndContinueButton: Locator;
  private readonly certificateSubheading: Locator;
  private readonly markAsCompleteSubheading: string;
  private readonly agreeWithChangeBox: string;
  private readonly saveAndReturn: Locator;
  private readonly enterNameValidationMessage: string;
  private readonly selectPartnerValidationMessage: string;
  private readonly newNameCharLimitMessage: string;
  private readonly existingPartnerName: string;
  private readonly newPartnerName: string;

  constructor({
    page,
    commands,
    projectChangeRequests,
    accNavigation,
    validators,
  }: {
    page: Page;
    commands: Commands;
    projectChangeRequests: ProjectChangeRequests;
    accNavigation: AccNavigation;
    validators: Validators;
  }) {
    this.page = page;
    this.commands = commands;
    this.pcr = projectChangeRequests;
    this.navigation = accNavigation;
    this.validators = validators;
    this.changeNamePageHeading = this.page.getByRole("heading").filter({ hasText: "Change a partner's name" });
    this.backToRequest = this.commands.backLink("Back to request");
    this.changeNameGuidance =
      "This will change the partner's name in all projects they are claiming funding for. You must upload a change of name certificate from Companies House as evidence of the change.";
    this.changeNameGuidanceParagraph = this.page.getByRole("paragraph").filter({ hasText: this.changeNameGuidance });
    this.selectPartnerSubheading = this.page.locator("css=legend").filter({ hasText: "Select partner" });
    this.existingPartnerNames = ["Hedge's Primary Ltd.", "Hedge's Secondary Ltd."];
    this.enterNewNameSubheading = this.page.getByLabel("Enter new name");
    this.newNameHint = this.page
      .locator("#hint-for-accountName")
      .filter({ hasText: "This is required to complete this request." });
    this.saveAndContinueButton = this.commands.button("Save and continue");
    this.certificateSubheading = this.page
      .locator("css=legend")
      .filter({ hasText: "Upload change of name certificate" });
    this.markAsCompleteSubheading = "Mark as complete";
    this.agreeWithChangeBox = "I agree with this change.";
    this.saveAndReturn = this.commands.button("Save and return to request");
    this.enterNameValidationMessage = "Enter new partner name.";
    this.selectPartnerValidationMessage = "Select existing partner to change.";
    this.newNameCharLimitMessage = "New partner name must be 256 characters or less.";
    this.existingPartnerName = "Hedge's Primary Ltd.";
    this.newPartnerName = "Bob's Burgers";
  }

  @When("the user has created a new Change a partner's name PCR")
  async createNewChangePartnerPCR() {
    await this.navigation.gotoProjectChangeRequests();
    await this.pcr.clickCreateRequest();
    await this.pcr.createPCR("Change a partner's name");
  }

  @Then("the Change a partner's name PCR is displayed")
  async changePartnerPageDisplayed() {
    await this.pcr.viewRequestPage("Change a partner's name");
    await this.pcr.requestPagePcrStatus("Change a partner's name", "To do");
    await this.pcr.selectPcrType("Change a partner's name");
    await this.assertExistingPartnerNames();
  }

  @When("the user attempts to submit an empty Change a partner's name PCR")
  async submitEmpty() {
    await this.saveAndContinueButton.click();
    await this.page.getByLabel(this.existingPartnerName).isDisabled();
    await this.certificateSubheading.isVisible();
    await this.saveAndContinueButton.click();
    await this.commands.getByLegend(this.markAsCompleteSubheading);
    await this.page.getByLabel(this.agreeWithChangeBox).check();
    await this.saveAndReturn.click();
  }

  @Then("validation messages will advise the PCR is empty")
  async validateEmptyPcr() {
    await this.commands.validationMessage(this.enterNameValidationMessage);
    await this.commands.validationMessage(this.selectPartnerValidationMessage);
    const editLinkRow = this.page.getByTestId("currentPartnerName");
    await editLinkRow.getByRole("link").filter({ hasText: "Edit" }).click();
    await this.selectPartnerSubheading.isVisible();
    await this.commands.validationMessage(this.enterNameValidationMessage);
    await this.commands.validationMessage(this.selectPartnerValidationMessage);
    await this.commands.paragraph(this.enterNameValidationMessage);
    await this.commands.paragraph(this.selectPartnerValidationMessage);
  }

  @When("the user exceeds 256 characters in New partner name")
  async exceedPartnerName() {
    await this.page.getByLabel(this.existingPartnerName).check();
    await this.commands.textValidation("New partner name", 256, "Save and continue", false, false, "Enter new name");
    await expect(
      this.page.getByTestId("validation-summary").filter({ hasText: this.enterNameValidationMessage }),
    ).not.toBeVisible();
    await this.certificateSubheading.isVisible();
    await expect(
      this.page.getByTestId("validation-summary").filter({ hasText: this.enterNameValidationMessage }),
    ).not.toBeVisible();
    await this.saveAndContinueButton.click();
    await this.commands.getByLegend(this.markAsCompleteSubheading);
    const editLinkRow = this.page.getByTestId("currentPartnerName");
    await editLinkRow.getByRole("link").filter({ hasText: "Edit" }).click();
    await this.page.getByLabel(this.existingPartnerName).isVisible();
    let largeText = getLorem(257);
    await this.page.getByLabel("Enter new name").fill(largeText);
  }

  @Then("validation message will advice of character limit")
  async charLimitValidationMessage() {
    await this.commands.validationMessage(this.newNameCharLimitMessage);
  }

  @When("the user submits a valid Change a partner's name PCR")
  async submitValidPCR() {
    await this.page.getByLabel("Enter new name").fill(this.newPartnerName);
    await this.saveAndContinueButton.click();
    await this.validators.testFileComponent(
      "request",
      "Request",
      "Change a partner's name",
      true,
      false,
      "Change of name certificate",
    );
    await this.commands.fileInput(["testfile.doc"]);
    await this.commands.validationNotification("has been uploaded.").isVisible();
    await this.page.locator("css=td").filter({ hasText: "Certificate of name change" }).isVisible();
    await this.saveAndContinueButton.click();
    await this.completedSummary();
    await this.commands.getByLabel(this.agreeWithChangeBox).check();
    await this.saveAndReturn.click();
    await this.page.getByRole("heading").filter({ hasText: "Request" }).isVisible();
    await this.pcr.viewRequestPage("Change a partner's name");
    await this.pcr.completePcrReasons();
    await this.pcr.submitRequest();
  }

  @Then("the user can see a read-only Change a partner's name PCR with reasoning")
  async changeNameInReview(data: DataTable) {
    await this.completedSummary();
    await this.pcr.nextReasoning();
    await this.pcr.reasoningPageDisplayed(data);
  }

  /**
   * METHODS
   */

  async viewChangePartnerPage() {
    await this.changeNamePageHeading.isVisible();
    await this.backToRequest.isVisible();
    await this.changeNameGuidanceParagraph.isVisible();
    await this.selectPartnerSubheading.isVisible();
    await this.enterNewNameSubheading.isVisible();
    await this.newNameHint.isVisible();
    await this.saveAndContinueButton.isVisible();
  }

  async assertExistingPartnerNames() {
    for (const label of this.existingPartnerNames) {
      await this.page.getByLabel(label).isVisible();
    }
  }

  async completedSummary() {
    const data = [
      ["Existing name", this.existingPartnerName],
      ["Proposed name", this.newPartnerName],
      ["Change of name certificate", "testfile.doc"],
    ];
    for (const [key, item] of data) {
      await this.commands.getListItemFromKey(key, item);
    }
  }
}
