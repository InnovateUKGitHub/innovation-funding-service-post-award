import { expect, Locator, Page } from "@playwright/test";
import { Fixture, Given, Then, When } from "playwright-bdd/decorators";
import { PageHeading } from "../../../../components/PageHeading";
import { Button } from "../../../../components/Button";
import { Commands } from "../../../Commands";
import { PcrType } from "../../../../Typings/pcr";
import { getLorem } from "../../../../components/lorem";
import { AccProjectKTP } from "../../../projectFactory/AccProjectKTP";
import { AccUserSwitcher } from "../../AccUserSwitcher";
import { AccNavigation } from "../../AccNavigation";
export
@Fixture("manageTeamMember")
class ManageTeamMember {
  protected readonly page: Page;
  protected readonly commands: Commands;
  protected readonly ktp: AccProjectKTP;
  protected readonly userswitcher: AccUserSwitcher;
  protected readonly navigation: AccNavigation;
  private readonly dashboardTitle: PageHeading;
  private readonly dashboardGuidance: Locator;
  private readonly backProject: Locator;
  private readonly createButton: Locator;
  private readonly cancelButton: Locator;
  private readonly pastRequests: Locator;
  private readonly showRequests: Locator;
  private readonly startTitle: PageHeading;
  private readonly startGuidance: Array<string>;
  private readonly startSubheading: string;
  private readonly backPcrs: Locator;
  private readonly backManageTeam: Locator;
  private readonly checkBoxes: Array<PcrType>;
  private readonly checkBoxHint: Array<string>;
  private readonly choiceDivider: RegExp;
  private readonly disabledBoxes: Array<PcrType>;
  private readonly manageTeamTitle: PageHeading;
  private readonly manageTeamSubheadings: Array<string>;
  private readonly manageTeamButtons: Array<string>;
  private readonly manageTeamCancelLink: Locator;
  private readonly pmTable: Locator;
  private readonly fcTable: Locator;
  private readonly kbAdminTable: Locator;
  private readonly mainContactTable: Locator;
  private readonly associatesTable: Locator;
  private readonly replacePmGuidance: string;
  private readonly replacePmSubheading: string;
  private readonly replacePmHint: string;
  private readonly inviteContactForm: Array<string>;
  private readonly inviteOrgLabel: string;
  private readonly confirmReplacementButton: Locator;
  private readonly submitEmptyValidation: Array<string>;
  private readonly replaceFcGuidance: string;
  private readonly fcDropdownLabel: string;
  private readonly fcDropdownList: Array<string>;
  private readonly replaceFcSubheading: string;
  private readonly replaceFcHint: string;
  private readonly replaceKbAdminGuidance: string;
  private readonly replaceKbAdminSubheading: string;
  private readonly replaceKbAdminHint: string;
  private readonly replaceMccGuidance: string;
  private readonly replaceMccSubheading: string;
  private readonly replaceMccHint: string;
  private readonly associateGuidance: string;
  private readonly associateDropdownList: Array<string>;
  private readonly associateStartDateList: Array<string>;
  private readonly associateFooter: string;
  private readonly supportEmail: string;

  constructor({
    page,
    commands,
    ktp,
    userswitcher,
    navigation,
  }: {
    page: Page;
    commands: Commands;
    ktp: AccProjectKTP;
    userswitcher: AccUserSwitcher;
    navigation: AccNavigation;
  }) {
    this.page = page;
    this.commands = commands;
    this.ktp = ktp;
    this.userswitcher = userswitcher;
    this.navigation = navigation;
    this.dashboardTitle = PageHeading.fromTitle(page, "Project change request");
    this.backProject = this.commands.backLink("Back to project");
    this.dashboardGuidance = this.page.getByText("You have no ongoing requests.");
    this.createButton = this.createButton = Button.fromTitle(page, "Create request");
    this.cancelButton = this.cancelButton = Button.fromTitle(page, "Cancel");
    this.pastRequests = Button.fromTitle(page, "Past requests");
    this.showRequests = Button.fromTitle(page, "Show");
    this.startTitle = PageHeading.fromTitle(page, "Start a new request");
    this.startGuidance = [
      "Before you submit, you must:",
      "ensure all project partners have approved the change(s)",
      "discuss this request with your monitoring officer",
    ];
    this.startSubheading = "Select request types";
    this.backPcrs = this.commands.backLink("Back to project change requests");
    this.backManageTeam = this.commands.backLink("Back to manage team members");
    this.checkBoxes = [
      "Reallocate project costs",
      "Remove a partner",
      "Add a partner",
      "Change project scope",
      "Change project duration",
      "Change a partner's name",
      "Put project on hold",
      "Manage team members",
    ];
    this.checkBoxHint = [
      "This allows you to move costs from one category to another.",
      "Use this when a partner is leaving the project and is ready to submit their final claim.",
      "This allows you to add a new partner to a project. When adding a new partner to replace an existing one, also use 'Remove a partner' to remove the existing one.",
      "Use this to update the public project description and the internal project summary.",
      "This allows you to request an extension or reduction to your project's duration.",
      "Use when a partner organisation's name has changed. If a partner is being replaced, use ‘Remove a partner’ to delete the old one and ‘Add a partner’ to add the new one.",
      "This allows you to suspend a project for a specific period. You cannot submit any claims, costs, drawdown requests or raise project change requests when the project is on hold.",
      "This allows you to add a new project team member or to change the role of an existing team member.",
    ];
    this.choiceDivider = /^or$/;
    this.disabledBoxes = [
      "Reallocate project costs",
      "Remove a partner",
      "Add a partner",
      "Change project scope",
      "Change project duration",
      "Change a partner's name",
      "Put project on hold",
    ];
    this.manageTeamTitle = PageHeading.fromTitle(page, "Manage team members");
    this.manageTeamSubheadings = ["Project manager", "Finance contacts", "Main company contact", "Associate"];
    this.manageTeamButtons = [
      "Replace project manager",
      "Replace finance contact",
      "Replace main company contact",
      "Invite associate",
    ];
    this.manageTeamCancelLink = this.page.getByRole("link").getByText("Cancel and return to start a new request page");
    this.pmTable = this.page.getByTestId("projectManagers-table");
    this.fcTable = this.page.getByTestId("financeContacts-table");
    this.kbAdminTable = this.page.getByTestId("knowledgeBaseAdministrators-table");
    this.mainContactTable = this.page.getByTestId("mainCompanyContacts-table");
    this.associatesTable = this.page.getByTestId("associates-table");
    this.replacePmGuidance =
      "This page allows you to remove the current project manager and replace with a new project manager. Once removed, they will no longer have access to the project unless they are added to the team again.";
    this.replacePmSubheading = "Invite new project manager";
    this.replacePmHint = "Enter the new project manager details before sending invitation.";
    this.inviteContactForm = ["First name", "Last name", "Email"];
    this.inviteOrgLabel = "Organisation";
    this.confirmReplacementButton = Button.fromTitle(page, "Confirm replacement and send invitation");
    this.submitEmptyValidation = ["Enter email address.", "Enter first name.", "Enter last name."];
    this.replaceFcGuidance =
      "This page allows you to select the finance contact to remove and replace them with a new finance contact. Once removed, they will no longer have access to the project unless they are added to the team again.";
    this.fcDropdownLabel = "Finance contacts";
    this.fcDropdownList = ["Ferris Colton"];
    this.replaceFcSubheading = "Invite new finance contact";
    this.replaceFcHint = "Enter the new finance contact details before sending invitation.";
    this.replaceKbAdminGuidance =
      "This page allows you to remove the current knowledge base administrator and replace with a new knowledge base administrator. Once removed, they will no longer have access to the project unless they are added to the team again.";
    this.replaceKbAdminSubheading = "Invite new knowledge base administrator";
    this.replaceKbAdminHint = "Enter the new knowledge base administrator details before sending invitation.";
    this.replaceMccGuidance =
      "This page allows you to remove the current main company contact and replace with a new main company contact. Once removed, they will no longer have access to the project unless they are added to the team again.";
    this.replaceMccSubheading = "Invite new main company contact";
    this.replaceMccHint = "Enter the new main company contact details before sending invitation.";
    this.associateGuidance = "Enter the new associate's details before sending invitation.";
    this.associateDropdownList = ["Hedge's Consulting Ltd."];
    this.associateStartDateList = ["Day", "Month", "Year"];
    this.associateFooter =
      "To change the email address, please contact customer support service by calling 0300 321 4357 or email";
    this.supportEmail = "support@iuk.ukri.org";
  }

  //**STEP DEFINITIONS**//

  @Given("a PM of a KTP project has created a new Project Change Request")
  async ktpPCRCreated() {
    this.ktp.create();
    this.userswitcher.switchToProjectManager();
    this.navigation.gotoPCRPage();
    this.userClicksCreate();
    this.startRequestPage();
  }

  @Then("the user sees the project change requests page")
  async userSeesPcrPage() {
    await expect(this.dashboardTitle.get()).toBeVisible();
    await expect(this.dashboardGuidance).toBeVisible();
    await expect(this.backProject).toBeVisible();
    await expect(this.createButton).toBeVisible();
    await expect(this.pastRequests).toBeVisible();
    await expect(this.showRequests).toBeVisible();
  }

  @When("the user clicks the Create request button")
  async userClicksCreate() {
    await this.createButton.click();
  }

  @Then("the user is taken to the 'Start a new request' page")
  async startRequestPage() {
    await expect(this.startTitle.get()).toBeVisible();
    await expect(this.backPcrs).toBeVisible();
    for (const copy of this.startGuidance) {
      await expect(this.page.getByText(copy)).toBeVisible();
    }
    await expect(this.page.getByRole("heading")).toHaveText(this.startSubheading);
    for (const checkbox of this.checkBoxes) {
      await expect(this.page.getByRole("checkbox")).toHaveText(checkbox);
    }
    for (const hint of this.checkBoxHint) {
      await expect(this.page.getByLabel(hint)).toBeVisible();
    }
    await expect(this.page.getByText(this.choiceDivider)).toBeVisible();
    await expect(this.createButton).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
  }

  @When("the user selects the PCR type {string}")
  async selectPcrType(label: PcrType) {
    await this.page.getByLabel(label).check();
  }

  @Then("other PCR Types are disabled and cannot be selected")
  async allPcrsDisabled() {
    for (const pcrs of this.disabledBoxes) {
      await expect(this.page.getByRole("checkbox").getByText(pcrs)).toBeDisabled();
    }
  }

  @When("the user selects each PCR type")
  async selectEachType() {
    /**
     * Selects each box in turn and asserts for Manage team member to be disabled followed by unchecking and moving to the next.
     */
    for (const pcr of this.disabledBoxes) {
      this.selectPcrType(pcr);
      await expect(this.page.getByRole("checkbox").getByText("Manage team member")).toBeDisabled();
      this.uncheckPCR(pcr);
    }
    for (const pcr of this.disabledBoxes) {
      this.selectPcrType(pcr);
    }
  }

  @Then("the Manage team members PCR type is disabled")
  async manageTeamMemberDisabled() {
    await expect(this.page.getByRole("checkbox").getByText("Manage team member")).toBeDisabled();
  }

  @Then("the user cannot select Manage team members")
  async cannotCheckManageTeamMember() {
    await this.page.getByRole("checkbox").getByText("Manage team member").click();
    await expect(this.page.getByRole("checkbox").getByText("Manage team member").isChecked()).toBeFalsy();
  }

  // **MANAGE TEAM MEMBERS PAGE**
  @Then("the user will see the Manage team member page")
  async manageTeamPcrPage() {
    await expect(this.manageTeamTitle.get()).toBeVisible();
    await expect(this.backPcrs).toBeVisible();
    for (const heading of this.manageTeamSubheadings) {
      expect(this.page.getByRole("heading")).toHaveText(heading);
    }
    await this.checkManageTeamMemberTable(this.pmTable, "Peter May", "Participant name here", false);
    await this.checkManageTeamMemberTable(this.fcTable, "Ferris Colton", "Participant name here", false);
    await this.checkManageTeamMemberTable(this.kbAdminTable, "Kristoff Baseman", "Hedge's Consulting Ltd.", false);
    await this.checkManageTeamMemberTable(this.mainContactTable, "Mary Cabrera", "Hedge's Consulting Ltd.", false);
    await this.checkManageTeamMemberTable(this.associatesTable, "Anna Sociate", "Hedge's Consulting Ltd.", true);
    for (const button of this.manageTeamButtons) {
      expect(this.page.getByRole("button")).toHaveText(button);
    }
    expect(this.manageTeamCancelLink).toBeVisible();
  }

  // **REPLACE PROJECT MANAGER PAGE**
  @Then("the user will see the Replace project manager page")
  async replacePmPage() {
    this.viewPage(
      true,
      false,
      false,
      "Replace project manager",
      this.replacePmGuidance,
      "Peter May",
      "Hedge's Consulting Ltd.",
      this.replacePmSubheading,
      this.replacePmHint,
    );
  }

  // **REPLACE FINANCE CONTACT PAGE**

  @Then("the user will see the Replace finance contact page")
  async replaceFcPage() {
    this.viewPage(false, true, false);
  }

  @Then("the user selects a Finance contact")
  async selectFc() {
    await this.page.getByLabel(this.fcDropdownLabel).selectOption("Ferris Colton");
  }

  // **REPLACE KNOWLEDGE BASE ADMINISTRATOR PAGE**
  @Then("the user will see the Replace knowledge base administator page")
  async replaceKbAdminPage() {
    this.viewPage(
      true,
      false,
      false,
      "Replace knowledge base administrator",
      this.replaceKbAdminGuidance,
      "Kristoff Baseman",
      "Hedge's Consulting Ltd.",
      this.replaceKbAdminSubheading,
      this.replaceKbAdminHint,
    );
  }

  // **REPLACE MAIN COMPANY CONTACT PAGE**

  @Then("the user will see the Replace main company contact page")
  async replaceMainCcPage() {
    this.viewPage(
      true,
      false,
      false,
      "Replace main company contact",
      this.replaceMccGuidance,
      "Mary Cabrera",
      "Hedge's Consulting Ltd.",
      this.replaceMccSubheading,
      this.replaceMccHint,
    );
  }

  @Then("the user will see the Invite a new associate page")
  async inviteAssociatePage() {
    this.viewPage(false, false, true);
  }

  // **FORM STEPS**

  @Then("the user clicks the {string} button")
  async userClicksButton(buttonName: string) {
    await Button.fromTitle(this.page, buttonName).click();
  }

  @Then("a standard validation message will advise of empty fields")
  async standardEmptyValidation() {
    this.emptyFormValidation(false);
  }

  @Then("an associate page validation message will advise of empty fields")
  async associateEmptyValidation() {
    this.emptyFormValidation(true);
  }

  @When("the user exceeds 100 characters in the form fields")
  async exceedFormCharacterLimits() {
    for (const input of this.inviteContactForm) {
      this.completeToCharacterLimit(101, input);
    }
  }

  @Then("validation messages for each field will confirm length of 100 characters")
  async exceedCharacterValMessages() {
    for (const input of this.inviteContactForm) {
      this.validateLength(input, "100");
    }
  }

  @When("the user enters alpha characters in the start date form")
  async alphaDateForm() {
    for (const input of this.associateStartDateList) {
      await this.page.getByLabel(input).fill("Lorem");
    }
  }

  @When("the user enters special characters in the start date form")
  async specialDateForm() {
    const specialList = ["!", "£", "$", "%", "^", "&", "*", "(", ")", "+", "-", "=", "@", "#", "<", ">"];
    for (const input of specialList) {
      for (const label of this.associateStartDateList) {
        await this.page.getByLabel(label).clear();
        await this.page.getByLabel(label).fill(input);
      }
      this.invalidCharacterMsg();
    }
  }

  @Then("the validation messages for each field will confirm invalid characters")
  async confirmInvalidChar() {
    this.invalidCharacterMsg();
  }

  @When("the form is completed with 100 characters")
  async completeFormValidInput() {
    for (const input of this.inviteContactForm) {
      await this.page.getByLabel(input).clear();
      await this.completeToCharacterLimit(100, input);
    }
  }

  @When("a valid date is entered in the start date form")
  async validStartDate() {
    let month = this.monthFromNow();
    let year = this.yearNow();
    const data = [
      ["Day", "01"],
      ["Month", month],
      ["Year", year],
    ];

    for (const [label, input] of data) {
      await this.page.getByLabel(label).clear();
      await this.page.getByLabel(label).fill(input);
    }
  }

  @Then("the validation messages will dynamically disappear")
  async validationMessagesNotExist() {
    await expect(this.page.getByTestId("validation-summary")).toHaveCount(0);
  }

  @When("the user submits a valid {string} PCR")
  async completeAndSubmit(pcr: string) {
    if (pcr === "Invite associate") {
      this.validStartDate();
    }
    this.completeContactForm("Joe", "Bloggs", "joe.bloggs@bloggs.test.test");
    await this.confirmReplacementButton.click();
  }

  //TODO: This needs automating once this page is built and ready
  @Then("a {string} confirmation screen is displayed")
  async confirmationScreen(pcr: string) {}

  // **METHODS**

  /**
   * Unchecks a pcr box
   */
  async uncheckPCR(label: PcrType) {
    await this.page.getByLabel(label).uncheck();
  }

  /**
   * Function to assert for different tables based on QA tags listed within POM above.
   */
  async checkManageTeamMemberTable(locator: Locator, name: string, organisation: string, associate: boolean) {
    await expect(locator.locator("th").nth(1)).toHaveText("Name");
    await expect(locator.locator("td").nth(1)).toHaveText(name);
    await expect(locator.locator("th").nth(2)).toHaveText("Organisation");
    await expect(locator.locator("td").nth(2)).toHaveText(organisation);
    if (associate) {
      await expect(locator.locator("th").nth(3)).toHaveText("Manage");
      await expect(locator.locator("td").nth(3).getByRole("link")).toHaveText("Remove");
    }
  }

  async completeToCharacterLimit(charlength: number, inputField: string) {
    let lorem = getLorem(charlength);
    await this.page.getByLabel(inputField).fill(lorem);
  }

  async validateLength(fieldName: string, length: string) {
    await this.commands.validationMessage(`${fieldName} must be ${length} characters or less.`);
  }

  async checkInviteLabelsExist() {
    for (const input of this.inviteContactForm) {
      await expect(this.page.getByLabel(input)).toBeVisible();
    }
  }

  /**
   * Method to view the replace pages.
   */
  async viewPage(
    standard: boolean,
    fc: boolean,
    associate: boolean,
    heading?: string,
    guidance?: string,
    name?: string,
    partner?: string,
    subheading?: string,
    hint?: string,
  ) {
    if (standard) {
      await expect(this.page.getByRole("heading")).toHaveText(heading);
      await expect(this.backManageTeam).toBeVisible();
      await expect(this.page.getByText(guidance)).toBeVisible();
      await expect(this.page.locator("th").nth(1)).toHaveText("Name");
      await expect(this.page.locator("td").nth(1)).toHaveText(name);
      await expect(this.page.locator("th").nth(2)).toHaveText("Organisation");
      await expect(this.page.locator("td").nth(2)).toHaveText(partner);
      await expect(this.page.getByRole("heading")).toHaveText(subheading);
      await expect(this.page.getByText(hint)).toBeVisible();
      await this.checkInviteLabelsExist();
      await expect(this.page.getByLabel(this.inviteOrgLabel)).toBeVisible();
      await expect(this.confirmReplacementButton).toBeVisible();
      await expect(this.page.getByRole("link")).toHaveText("Cancel");
    } else if (fc) {
      await expect(this.page.getByRole("heading")).toHaveText("Replace finance contact");
      await expect(this.backManageTeam).toBeVisible();
      await expect(this.page.getByText(this.replaceFcGuidance)).toBeVisible();
      await expect(Button.fromTitle(this.page, "Confirm replacement and send invitation")).toHaveAttribute("disabled");
      await expect(this.page.getByRole("link")).toHaveText("Cancel");
      for (const fc of this.fcDropdownList) {
        await this.page.getByLabel(this.fcDropdownLabel).selectOption(fc);
      }
      await expect(Button.fromTitle(this.page, "Confirm replacement and send invitation")).toBeEnabled();
      await this.checkInviteLabelsExist();
      await expect(this.page.getByRole("heading")).toHaveText(this.replaceFcSubheading);
      await expect(this.page.getByText(this.replaceFcHint)).toBeVisible();
      await expect(this.confirmReplacementButton).toBeVisible();
      await expect(this.page.getByRole("link")).toHaveText("Cancel");
    } else if (associate) {
      await expect(this.page.getByRole("heading")).toHaveText("Invite a new associate");
      await expect(this.backManageTeam).toBeVisible();
      await expect(this.page.getByText(this.associateGuidance)).toBeVisible();
      await this.checkInviteLabelsExist();
      for (const partner of this.associateDropdownList) {
        await this.page.getByLabel(this.inviteOrgLabel).selectOption(partner);
      }
      for (const date of this.associateStartDateList) {
        await expect(this.page.getByLabel(date)).toBeVisible();
      }
      await expect(this.page.getByText(this.associateFooter)).toBeVisible();
      await expect(this.page.getByRole("link")).toHaveText(this.supportEmail);
    }
  }

  async emptyFormValidation(associate: boolean) {
    for (const valMsg of this.submitEmptyValidation) {
      await expect(this.page.getByTestId("validation-summary")).toHaveText(valMsg);
    }
    if (associate) {
      await expect(this.page.getByTestId("validation-summary")).toHaveText("Enter start date.");
    }
  }

  async invalidCharacterMsg() {
    for (const input of this.associateStartDateList) {
      let valLabel = input.toLowerCase();
      await this.commands.validationMessage(`Start ${valLabel} must be a valid number.`);
      await this.commands.validationMessage(`Enter a valid start date`);
    }
  }

  monthFromNow() {
    let date = new Date();
    let month = date.getMonth() + 2;
    return month.toString();
  }

  yearNow() {
    let date = new Date();
    let year = date.getFullYear();
    return year.toString();
  }

  async completeContactForm(firstName: string, lastName: string, email: string) {
    await this.page.getByLabel(this.inviteContactForm[0]).fill(firstName);
    await this.page.getByLabel(this.inviteContactForm[1]).fill(lastName);
    await this.page.getByLabel(this.inviteContactForm[2]).fill(email);
  }
}
