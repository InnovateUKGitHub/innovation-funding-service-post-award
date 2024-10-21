import { expect, Locator, Page } from "@playwright/test";
import { Fixture, Given, Then, When } from "playwright-bdd/decorators";
import { Commands } from "../../../Commands";
import { ProjectChangeRequests } from "./pcrGeneral";
import { getLorem } from "../../../../components/lorem";
import { DataTable } from "playwright-bdd";
import { PageHeading } from "../../../../components/PageHeading";
export
@Fixture("approveNewSubcontractor")
class ApproveNewSubcontractor {
  protected readonly page: Page;
  protected readonly commands: Commands;
  protected readonly pcr: ProjectChangeRequests;
  private readonly pageTitle: PageHeading;
  private readonly markComplete: string;
  private readonly agreeWithChange: Locator;
  private readonly emptyValidationList: Array<string>;
  private readonly relationshipValidation: string;
  private readonly subcontractorGuidance: string;
  private readonly eachTextField: Array<string>;
  private readonly costField: string;
  private readonly valQa: string;
  private readonly charLimitValidation: Array<string>;
  private readonly currencyValidationMessages: Array<string>;
  private readonly summaryQaList: Array<string>;
  private readonly summaryKey: Locator;
  private readonly summaryValue: Locator;
  private readonly isThereRelationship: string;
  private readonly relationshipBoxLabel: Locator;
  private readonly summaryCost: string;
  private readonly relationshipCounter: Locator;
  private readonly descriptionCounter: Locator;
  private readonly justificationCounter: Locator;
  private readonly backToRequest: Locator;
  private readonly saveContinue: Locator;
  private readonly saveAndReturn: Locator;
  private readonly costTobeCarriedOut: Locator;

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
    this.pageTitle = PageHeading.fromTitle(page, "Approve a new subcontractor");
    this.markComplete = "Mark as complete";
    this.agreeWithChange = this.page.getByLabel("I agree with this change.");
    this.emptyValidationList = [
      "Enter subcontractor's name.",
      "Enter subcontractor's registration number.",
      "Enter country where the subcontractor's work will be carried out.",
      "Enter description of work to be carried out by the subcontractor.",
      "Enter justification for including the subcontractor.",
      "Enter the cost of work to be carried out by the new subcontractor.",
    ];
    this.relationshipValidation = "Enter relationship between the partner and the subcontractor.";
    this.subcontractorGuidance =
      "Let us know if you are working with a new subcontractor. We will need to undertake viability checks, as stated in the application process.";
    this.eachTextField = [
      "Company name of subcontractor",
      "Company registration number",
      "Country where the subcontractor's work will be carried out",
      "Brief description of work to be carried out by subcontractor",
      "Justification",
    ];
    this.costField = "Cost of work to be carried out by the new subcontractor";
    this.valQa = "validation-summary";
    this.charLimitValidation = [
      "Subcontractor's name must be 255 characters or less.",
      "Subcontractor's registration number must be 20 characters or less.",
      "Relationship between the partner and the subcontractor must be 16000 characters or less.",
      "Country where the subcontractor's work will be carried out must be 100 characters or less.",
      "Description of work to be carried out by the subcontractor must be 255 characters or less.",
      "Justification for including the subcontractor must be 32000 characters or less.",
    ];
    this.currencyValidationMessages = [
      "The cost of work to be carried out by the new subcontractor must be a number.                 ",
      "The cost of work to be carried out by the new subcontractor must be in pounds (£).            ",
      "The cost of work to be carried out by the new subcontractor must be 2 decimal places or fewer.",
    ];
    this.summaryQaList = [
      "subcontractorName",
      "subcontractorRegistrationNumber",
      "subcontractorRelationship",
      "subcontractorRelationshipJustification",
      "subcontractorLocation",
      "subcontractorDescription",
      "subcontractorCost",
      "subcontractorJustification",
    ];
    this.summaryKey = this.page.locator("css=dt");
    this.summaryValue = this.page.locator("css=dd");
    this.isThereRelationship = "Is there a relationship between the partner and the subcontractor?";
    this.summaryCost = "£1,000.33";
    this.relationshipBoxLabel = this.page.getByLabel(
      "Please describe the relationship between the collaborator and the new subcontractor",
    );
    this.relationshipCounter = this.page.locator("//div[4]//div[2]//p");
    this.descriptionCounter = this.page.locator("//div[4]//fieldset[5]//p");
    this.justificationCounter = this.page.locator("//div[4]//fieldset[7]//p");
    this.backToRequest = this.commands.backLink("Back to request");
    this.saveAndReturn = this.commands.button("Save and return to request");
    this.saveContinue = this.commands.button("Save and continue");
    this.costTobeCarriedOut = this.page.getByLabel("Cost of work to be carried out by the new subcontractor");
  }

  @When("the user attempts to mark as complete and save")
  async markAsCompleteSave() {
    await this.commands.button("Save and continue").click();
    await expect(this.page.locator("css=legend")).toHaveText(this.markComplete);
    await this.agreeWithChange.click();
    await this.saveAndReturn.click();
  }

  @Then("validation messages will advise of empty fields")
  async validateApproveSubcontractor() {
    for (const msg of this.emptyValidationList) {
      await this.commands.validationLink(msg);
    }
    await expect(this.page.getByTestId(this.valQa).getByText(this.relationshipValidation)).not.toBeVisible();
  }

  @When("the user clicks one of the Edit links")
  async clickEditLink() {
    await this.page.getByTestId("subcontractorName").getByText("Edit").click();
  }

  @Then("the user is on the editable page")
  async editablePage() {
    await expect(this.page.getByText(this.subcontractorGuidance)).toBeVisible();
  }

  @Then("the validation messages will persist")
  async valMessagePersist() {
    await this.validateApproveSubcontractor();
  }

  @When("the user enters text into each field")
  async enterTextEachField() {
    for (const box of this.eachTextField) {
      await this.page.getByLabel(box).clear();
      await this.page.getByLabel(box).fill("Lorem");
    }
    await this.page.getByLabel(this.costField).fill("100");
    await this.page.getByLabel("Yes").click();
    await this.page.getByLabel("No").click();
  }

  @Then("the approve subcontractor validation messages will dynamically disappear")
  async noValidationMessage() {
    for (const msg of this.emptyValidationList) {
      await expect(this.page.getByTestId(this.valQa).getByText(msg)).not.toBeVisible();
    }
    await expect(this.page.getByTestId(this.valQa).getByText(this.relationshipValidation)).not.toBeVisible();
  }

  @Given("the user has created and is in Approve a new subcontractor")
  async accessedApproveSubPcr() {
    await this.pcr.createPCR("Approve a new subcontractor");
    await this.pcr.selectPcrType("Approve a new subcontractor");
    await expect(this.backToRequest).toBeVisible();
    await this.pageTitle.isVisible();
  }

  @When("the user exceeds the allowed character limit")
  async exceedAllCharacterLimit(table: DataTable) {
    await this.page.getByLabel("Yes").click();
    const dataMap = table.hashes();
    for (const row of dataMap) {
      await this.completeText(row["Field name"], Number(row["Character limit"]), 1);
    }
  }

  @Then("clicks save and continue")
  async saveAndContinue() {
    await this.saveContinue.click();
  }

  @Then("character limit validation messages are displayed")
  async boundaryValidationMsg() {
    for (const msg of this.charLimitValidation) {
      await this.commands.validationLink(msg);
      await expect(this.page.getByRole("paragraph").filter({ hasText: msg })).toBeVisible();
    }
  }

  @When("the user enters text within the character limit")
  async enterValidTextLength(table: DataTable) {
    const data = table.hashes();
    for (const row of data) {
      await this.completeText(row["Field name"], Number(row["Character limit"]), 0);
    }
  }

  @Then("the characters remaining will read {int}")
  async charactersRemaining(charNumber: number) {
    if (charNumber == 0) {
      await expect(
        this.relationshipCounter.filter({ hasText: `You have ${charNumber} characters remaining` }),
      ).toBeVisible();
      await expect(
        this.descriptionCounter.filter({ hasText: `You have ${charNumber} characters remaining` }),
      ).toBeVisible();
      await expect(
        this.justificationCounter.filter({ hasText: `You have ${charNumber} characters remaining` }),
      ).toBeVisible();
    } else {
      let relationship = 16000;
      let description = 255;
      let justification = 32000;
      await expect(
        this.relationshipCounter.filter({ hasText: `You have ${relationship - charNumber} characters remaining` }),
      ).toBeVisible();
      await expect(
        this.descriptionCounter.filter({ hasText: `You have ${description - charNumber} characters remaining` }),
      ).toBeVisible();
      await expect(
        this.justificationCounter.filter({ hasText: `You have ${justification - charNumber} characters remaining` }),
      ).toBeVisible();
    }
  }

  @Then("the validation messages will no longer appear")
  async noLengthValidation() {
    for (const msg of this.charLimitValidation) {
      await expect(this.page.getByTestId(this.valQa).filter({ hasText: msg })).not.toBeVisible();
    }
  }

  @When("the user enters invalid characters in Cost of work")
  async validateCurrency(table: DataTable) {
    const data = table.hashes();
    for (const row of data) {
      await this.page.getByLabel("Cost of work to be carried out by the new subcontractor").clear();
      await this.page
        .getByLabel("Cost of work to be carried out by the new subcontractor")
        .fill(row["Characters to enter"]);
      await this.commands.button("Save and continue").click();
      await this.commands.validationLink(row["Validation message"]);
    }
  }

  //This looks at the last entry of the validateCurrency() function.
  @Then("the correct validation message is displayed")
  async correctValidation() {
    await expect(
      this.page.getByTestId(this.valQa).filter({
        hasText: "The cost of work to be carried out by the new subcontractor must be £0.00 or more.",
      }),
    ).toBeVisible();
  }

  @When("the user enters {string} pounds in the currency field")
  async enterCurrency(value: string) {
    await this.costTobeCarriedOut.clear();
    await this.costTobeCarriedOut.fill(value);
  }

  @Then("the currency validation will dynamically disappear")
  async noCurrencyValidation() {
    for (const msg of this.currencyValidationMessages) {
      await expect(this.page.getByTestId(this.valQa).filter({ hasText: msg })).not.toBeVisible();
    }
  }

  @When("the user clicks Save and continue")
  async clicksContinue() {
    await this.commands.button("Save and continue").click();
  }

  @Then("the summary page correctly displays the saved information")
  async correctSummaryPage(table: DataTable) {
    const data = table.hashes();
    for (const row of data) {
      let lorem = getLorem(Number(row["Lorem"]));
      (await this.commands.getListItemFromKey(row["Field name"], lorem)).isVisible();
    }
    await expect(this.summaryKey.filter({ hasText: this.isThereRelationship })).toBeVisible();
    await expect(this.page.getByTestId(this.summaryQaList[2]).filter({ hasText: "Yes" })).toBeVisible();
    await expect(
      this.summaryKey.filter({ hasText: "Cost of work to be carried out by the new subcontractor" }),
    ).toBeVisible();
    await expect(this.page.getByTestId(this.summaryQaList[6]).filter({ hasText: this.summaryCost })).toBeVisible();
  }

  @When("the user enters comment in the relationship box")
  async fillRelationshipBox() {
    await this.page.getByLabel("Yes").click();
    await this.relationshipBoxLabel.fill("Text to be deleted");
  }

  @Then("the saved text will appear on the summary screen")
  async savedTextOnSummary() {
    await expect(this.page.getByTestId(this.summaryQaList[3]).filter({ hasText: "Text to be deleted" })).toBeVisible();
  }

  @Then("the user selects relationship as {string}")
  async selectRelationship(selection: string) {
    await this.page.getByLabel(selection).click();
  }

  @Then("the information will have been deleted")
  async informationDeleted() {
    await expect(this.page.locator("css=legend")).toHaveText(this.markComplete);
    await expect(
      this.page.getByTestId(this.summaryQaList[3]).filter({ hasText: "Text to be deleted" }),
    ).not.toBeVisible();
  }

  @When("the user completes the Approve a new subcontractor form")
  async completeApproveSub() {
    await this.page.getByLabel("Yes").click();
    for (const field of this.eachTextField) {
      let i = 1;
      await this.page.getByLabel(field).fill(`Lorem ${i}`);
      i++;
    }
    await this.relationshipBoxLabel.fill("Lorem 7");
    await this.page.getByLabel(this.costField).fill("1000.33");
    this.charactersRemaining(7);
    this.clicksContinue();
  }

  /**
   * METHODS
   */
  async completeText(inputField: string, charLimit: number, additionalChar: number) {
    let lorem = getLorem(charLimit + additionalChar);
    await this.page.getByLabel(inputField).clear();
    await this.page.getByLabel(inputField).fill(lorem);
  }
}
