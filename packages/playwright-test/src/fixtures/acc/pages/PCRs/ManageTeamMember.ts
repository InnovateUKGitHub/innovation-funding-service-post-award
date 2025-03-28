import { expect, Locator, Page } from "@playwright/test";
import { Fixture, Given, Then, When } from "playwright-bdd/decorators";
import { PageHeading } from "../../../../components/PageHeading";
import { Button } from "../../../../components/Button";
import { Commands } from "../../../Commands";
import { PcrType } from "../../../../typings/pcr";
import { getLorem } from "../../../../components/lorem";
import { AccProjectKtp } from "../../../projectFactory/AccProjectKTP";
import { AccUserSwitcher } from "../../AccUserSwitcher";
import { AccNavigation } from "../../AccNavigation";
import { ProjectChangeRequests } from "./ProjectChangeRequests";
import { ProjectState } from "../../../projectFactory/ProjectState";
import { TwoParticipantKTPProjectFactoryScriptContext } from "@innovateuk/project-factory-two/scripts/TwoParticipantKTPProjectFactoryScript";

export
@Fixture("manageTeamMember")
class ManageTeamMember {
  protected readonly page: Page;
  protected readonly commands: Commands;
  protected readonly accProjectKtp: AccProjectKtp;
  protected readonly accUserswitcher: AccUserSwitcher;
  protected readonly accNavigation: AccNavigation;
  protected readonly pcr: ProjectChangeRequests;
  protected readonly projectState: ProjectState;
  private readonly dashboardTitle: PageHeading;
  private readonly dashboardGuidance: Locator;
  private readonly backProject: Locator;
  private readonly createButton: Locator;
  private readonly cancelButton: Locator;
  private readonly pastRequests: Locator;
  private readonly showRequests: Locator;
  private readonly startTitle: PageHeading;
  private readonly startGuidance: Array<string>;
  private readonly startSubheading: Locator;
  private readonly backPcrs: Locator;
  private readonly backManageTeam: Locator;
  private readonly checkBoxes: Array<PcrType>;
  private readonly checkBoxHint: Array<string>;
  private readonly disabledBoxes: Array<string>;
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
  private readonly inviteFormNames: Array<string>;
  private readonly inviteOrgLabel: Locator;
  private readonly orgHint: Locator;
  private readonly confirmReplacementButton: Locator;
  private readonly submitEmptyValidation: Array<string>;
  private readonly replaceFcGuidance: string;
  private readonly fcDropdownList: Array<string>;
  private readonly replaceFcSubheading: Locator;
  private readonly replaceFcHint: string;
  private readonly replaceKbAdminGuidance: string;
  private readonly replaceKbAdminSubheading: string;
  private readonly replaceKbAdminHint: string;
  private readonly replaceMccGuidance: string;
  private readonly replaceMccSubheading: string;
  private readonly replaceMccHint: string;
  private readonly associateGuidance: string;
  private readonly associateStartDateList: Array<string>;
  private readonly associateFooter: string;
  private readonly supportEmail: string;
  private readonly confirmationPageGuidance: Locator;
  private readonly returnToPcrsButton: Locator;
  private readonly inviteButton: Locator;
  private readonly removeAssociateHeading: PageHeading;
  private readonly removeAssociateGuidance: Locator;
  private readonly removeAssociateTable: Array<[string, string]>;
  private readonly removeAssociateButton: Locator;
  private readonly cancelLink: Locator;
  private readonly dayLabel: Locator;
  private readonly monthLabel: Locator;
  private readonly yearLabel: Locator;

  constructor({
    page,
    commands,
    accProjectKtp,
    accUserSwitcher,
    accNavigation,
    projectChangeRequests,
    projectState,
  }: {
    page: Page;
    commands: Commands;
    accProjectKtp: AccProjectKtp;
    accUserSwitcher: AccUserSwitcher;
    accNavigation: AccNavigation;
    projectChangeRequests: ProjectChangeRequests;
    projectState: ProjectState;
  }) {
    this.page = page;
    this.commands = commands;
    this.accProjectKtp = accProjectKtp;
    this.accUserswitcher = accUserSwitcher;
    this.accNavigation = accNavigation;
    this.pcr = projectChangeRequests;
    this.projectState = projectState;
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
    this.startSubheading = this.page.getByRole("heading").filter({ hasText: "Select request types" });
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
    this.disabledBoxes = [
      "Reallocate project costsThis allows you to move costs from one category to another.",
      "Remove a partnerUse this when a partner is leaving the project and is ready to submit their final claim.",
      "Add a partnerThis allows you to add a new partner to a project. When adding a new partner to replace an existing one, also use 'Remove a partner' to remove the existing one.",
      "Change project scopeUse this to update the public project description and the internal project summary.",
      "Change project durationThis allows you to request an extension or reduction to your project's duration.",
      "Change a partner's nameUse when a partner organisation's name has changed. If a partner is being replaced, use ‘Remove a partner’ to delete the old one and ‘Add a partner’ to add the new one.",
      "Put project on holdThis allows you to suspend a project for a specific period. You cannot submit any claims, costs, drawdown requests or raise project change requests when the project is on hold.",
    ];
    this.manageTeamTitle = PageHeading.fromTitle(page, "Manage team members");
    this.manageTeamSubheadings = ["Project manager", "Finance contacts", "Main company contact", "Associate"];
    this.manageTeamButtons = [
      "Replace project manager",
      "Replace finance contact",
      "Replace main company contact",
      "Invite associate",
    ];
    this.pmTable = this.page.getByTestId("projectManagers-table");
    this.fcTable = this.page.getByTestId("financeContacts-table");
    this.kbAdminTable = this.page.getByTestId("knowledgeBaseAdministrators-table");
    this.mainContactTable = this.page.getByTestId("mainCompanyContacts-table");
    this.associatesTable = this.page.getByTestId("associates-table");
    this.replacePmGuidance =
      "This page allows you to remove the current project manager and replace with a new project manager. Once removed, they will no longer have access to the project unless they are added to the team again.";
    this.replacePmSubheading = "Invite new project manager";
    this.replacePmHint = "Enter the new project manager details before sending invitation.";
    this.inviteFormNames = ["First name", "Last name"];
    this.inviteOrgLabel = this.page.locator("//fieldset[3]/div[1]/label").filter({ hasText: "Organisation" });
    this.orgHint = this.page.locator("#hint-for-partnerId").filter({ hasText: "Hedge's Primary Ltd." });
    this.confirmReplacementButton = Button.fromTitle(page, "Confirm replacement and send invitation");
    this.submitEmptyValidation = ["Enter a valid email address.", "Enter first name.", "Enter last name."];
    this.replaceFcGuidance =
      "This page allows you to select the finance contact to remove and replace them with a new finance contact. Once removed, they will no longer have access to the project unless they are added to the team again.";
    this.fcDropdownList = ["Main Finance Contact", "Secondary Finance Contact"];
    this.replaceFcSubheading = this.page.getByRole("heading").filter({ hasText: "Invite new finance contact" });
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
    this.associateStartDateList = ["Day", "Month", "Year"];
    this.associateFooter =
      "To change the email address, please contact customer support service by calling 0300 321 4357 or email";
    this.supportEmail = "support@iuk.ukri.org";
    this.manageTeamCancelLink = this.page
      .getByRole("link")
      .filter({ hasText: "Cancel and return to start a new request page" });
    this.confirmationPageGuidance = this.page
      .getByTestId("validation-message-content")
      .filter({ hasText: "Your project change request has been submitted." });
    this.returnToPcrsButton = this.page.getByRole("button").filter({ hasText: "Return to project change requests" });
    this.inviteButton = this.commands.button("Send invitation");
    this.removeAssociateHeading = PageHeading.fromTitle(this.page, "Confirm removal of associate");
    this.removeAssociateGuidance = this.page.getByRole("paragraph").filter({
      hasText:
        "This page allows you to remove the below associate. Once removed, they will no longer have access to the project unless they are added to the team again.",
    });
    this.removeAssociateTable = [
      ["Name", "Anna Sociate"],
      ["Organisation", "Hedge's Primary Ltd."],
    ];
    this.removeAssociateButton = this.page.getByRole("button").filter({ hasText: "Remove associate" });
    this.cancelLink = this.page.getByRole("link").filter({ hasText: "Cancel" });
    this.dayLabel = this.page.getByLabel("Day");
    this.monthLabel = this.page.getByLabel("Month");
    this.yearLabel = this.page.getByLabel("Year");
  }

  //**STEP DEFINITIONS**//

  @Given("a PM of a KTP project has created a new Project Change Request")
  async ktpPCRCreated() {
    await this.accProjectKtp.ktpMultiProject();
    await this.accUserswitcher.switchToUser("pmUser");
    await this.accNavigation.gotoProjectChangeRequests();
    await this.userClicksCreate();
    await this.startRequestPage();
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
    await this.startSubheading.isVisible();
    for (const checkbox of this.checkBoxes) {
      await this.page.getByRole("checkbox").filter({ hasText: checkbox }).isVisible();
    }
    for (const hint of this.checkBoxHint) {
      await expect(this.page.getByLabel(hint)).toBeVisible();
    }
    await expect(this.createButton).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
  }

  @When("the user selects the PCR type {string}")
  async selectPcrType(label: PcrType | string) {
    await this.page.getByLabel(label).check();
  }

  @Then("other PCR Types are disabled and cannot be selected")
  async allPcrsDisabled() {
    for (const pcr of this.disabledBoxes) {
      const input = this.page.getByLabel(pcr);
      await expect(input).toBeDisabled();
    }
  }

  @When("the user selects each PCR type")
  async selectEachType() {
    /**
     * Selects each box in turn and asserts for Manage team member to be disabled followed by unchecking and moving to the next.
     */
    for (const pcr of this.disabledBoxes) {
      await this.page.getByLabel(pcr).check();
    }
  }

  @Then("the Manage team members PCR type is still enabled")
  async manageTeamMemberEnabled() {
    const label = this.page.getByLabel("Manage Team Member");
    await expect(label).toBeEnabled();
  }

  @When("the user selects Manage team member")
  async selectManageTeamMember() {
    await this.page.getByLabel("Manage Team Member").click();
  }

  @Then("the other PCR types are then disabled")
  async cannotCheckManageTeamMember() {
    for (const pcr of this.disabledBoxes) {
      await expect(this.page.getByLabel(pcr)).toBeDisabled();
    }
  }

  // **MANAGE TEAM MEMBERS PAGE**
  @Then("the user will see the Manage team member page")
  async manageTeamPcrPage() {
    await expect(this.manageTeamTitle.get()).toBeVisible();
    await expect(this.backPcrs).toBeVisible();
    for (const heading of this.manageTeamSubheadings) {
      await expect(this.page.getByRole("heading").filter({ hasText: heading })).toBeVisible();
    }
    await this.checkManageTeamMemberTable(this.pmTable, "Project Manager", "Hedge's Primary Ltd.", false);
    await this.checkManageTeamMemberTable(this.fcTable, "Main Finance Contact", "Hedge's Primary Ltd.", false);
    await this.checkManageTeamMemberTable(this.kbAdminTable, "Knowledge Base", "Hedge's Primary Ltd.", false);
    await this.checkManageTeamMemberTable(this.mainContactTable, "Main Contact", "Hedge's Primary Ltd.", false);
    await this.checkManageTeamMemberTable(this.associatesTable, "Anna Sociate", "Hedge's Primary Ltd.", true);
    for (const button of this.manageTeamButtons) {
      await expect(this.page.getByRole("button").filter({ hasText: button })).toBeVisible();
    }
    await expect(this.manageTeamCancelLink).toBeVisible();
  }

  // **REPLACE PROJECT MANAGER PAGE**
  @Then("the user will see the Replace project manager page")
  async replacePmPage() {
    await this.viewPage(
      true,
      false,
      false,
      "Replace project manager",
      this.replacePmGuidance,
      "Project Manager",
      "Hedge's Primary Ltd.",
      this.replacePmSubheading,
      this.replacePmHint,
    );
  }

  // **REPLACE FINANCE CONTACT PAGE**

  @Then("the user will see the Replace finance contact page")
  async replaceFcPage() {
    await this.viewPage(false, true, false);
  }

  @Then("the user selects a Finance contact")
  async selectFc() {
    await this.page.getByRole("combobox").selectOption("Main Finance Contact");
  }

  // **REPLACE KNOWLEDGE BASE ADMINISTRATOR PAGE**
  @Then("the user will see the Replace knowledge base administator page")
  async replaceKbAdminPage() {
    await this.viewPage(
      true,
      false,
      false,
      "Replace knowledge base administrator",
      this.replaceKbAdminGuidance,
      "Knowledge Base",
      "Hedge's Primary Ltd.",
      this.replaceKbAdminSubheading,
      this.replaceKbAdminHint,
    );
  }

  // **REPLACE MAIN COMPANY CONTACT PAGE**

  @Then("the user will see the Replace main company contact page")
  async replaceMainCcPage() {
    await this.viewPage(
      true,
      false,
      false,
      "Replace main company contact",
      this.replaceMccGuidance,
      "Main Contact",
      "Hedge's Primary Ltd.",
      this.replaceMccSubheading,
      this.replaceMccHint,
    );
  }

  @Then("the user will see the Invite a new associate page")
  async inviteAssociatePage() {
    await this.viewPage(false, false, true);
  }

  // **FORM STEPS**

  @Then("the user clicks the {string} button")
  async userClicksButton(buttonName: string) {
    await this.page.getByRole("button").filter({ hasText: buttonName }).click();
  }

  @Then("a standard validation message will advise of empty fields")
  async standardEmptyValidation() {
    await this.emptyFormValidation(false);
  }

  @Then("an associate page validation message will advise of empty fields")
  async associateEmptyValidation() {
    await this.emptyFormValidation(true);
  }

  @When("the user exceeds 80 characters in the form fields")
  async exceedFormCharacterLimits() {
    for (const input of this.inviteFormNames) {
      await this.completeToCharacterLimit(81, input, false);
    }
    await this.completeToCharacterLimit(75, "Email", true);
  }

  @Then("validation messages for each field will confirm length of 80 characters")
  async exceedCharacterValMessages() {
    await this.validateLength("First name", "80");
    await this.validateLength("Last name", "80");
    await this.validateLength("Email", "80");
  }

  @When("the email entered is not in an email format")
  async enterInvalidEmail() {
    await this.completeToCharacterLimit(75, "Email", false);
  }

  @Then("the validation message will confirm an invalid email")
  async invalidEmailValidation() {
    await this.commands.validationMessage("Enter a valid email address ");
  }

  @When("the form is completed with 80 characters")
  async completeFormValidInput() {
    let lorem = getLorem(80);

    for (const input of this.inviteFormNames) {
      await this.page.getByLabel(input).fill(lorem);
    }
    await this.completeToCharacterLimit(80, "Email", true, true);
    await this.page.getByLabel("Email").press("Delete");
  }

  @When("a correct and valid date is entered as the start date")
  async validStartDate() {
    let month = this.monthNow();
    let year = this.yearFromNow();
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
    if (pcr === "Replace project manager") {
      await this.completeContactForm("Joe", "Bloggs", "joe.bloggs@bloggs.test.test");
      await expect(this.confirmReplacementButton).toHaveCSS("background-color", "rgb(212, 53, 28)");
      await this.confirmReplacementButton.click();
    } else if (pcr === "Replace finance contact") {
      await this.selectFc();
      await this.completeContactForm("Joe", "Bloggs", "joe.bloggs@bloggs.test.test");
      await expect(this.confirmReplacementButton).toHaveCSS("background-color", "rgb(212, 53, 28)");
      await this.confirmReplacementButton.click();
      await expect(this.page.getByRole("combobox")).toBeDisabled();
    } else if (pcr === "Invite a new associate") {
      await this.validStartDate();
      await this.completeContactForm("Joe", "Bloggs", "joe.bloggs@bloggs.test.test");
      await this.inviteButton.click();
    } else {
      await this.completeContactForm("Joe", "Bloggs", "joe.bloggs@bloggs.test.test");
      await expect(this.confirmReplacementButton).toHaveCSS("background-color", "rgb(212, 53, 28)");
      await this.confirmReplacementButton.click();
    }
  }

  @Then("a {string} confirmation screen is displayed")
  async confirmationScreen(pcr: string) {
    await this.confirmationPageGuidance.isVisible();
    let status: string;
    if (pcr === "Manage team members") {
      status = "Approved";
    } else {
      status = "Submitted to Innovate UK";
    }
    const data = [
      ["Request number", /^(\d?[1-9]|[1-9]0)$/],
      ["Request type", "Manage team members"],
      ["Request started", this.commands.dateToday(true)],
      ["Request status", status],
      ["Request last updated", this.commands.dateToday(true)],
    ];

    for (const [key, item] of data) {
      await this.commands.getListItemFromKey(key, item, true);
    }

    await this.returnToPcrsButton.isVisible();
    await this.page.getByRole("link").filter({ hasText: "Review request" }).click();
    if (pcr === "Invite a new associate") {
      await this.reviewScreenReasoning(true, false);
      await this.reviewScreenNew(pcr);
    } else if (pcr === "Manage team members") {
      await this.reviewScreenReasoning(false, true);
      await this.reviewScreenExisting(pcr);
    } else {
      await this.reviewScreenReasoning(false, false);
      await this.reviewScreenExisting(pcr);
      await this.reviewScreenNew(pcr);
    }
  }

  @Then("the user clicks Remove next to the existing associate")
  async clickRemoveAssociateLink() {
    await this.page
      .getByTestId("associates-table")
      .locator("tbody")
      .locator("td")
      .nth(2)
      .getByRole("link")
      .filter({ hasText: "Remove" })
      .click();
  }

  @Then("the Remove associate page is displayed")
  async removeAssociatePage() {
    await this.removeAssociateHeading.isVisible();
    await expect(this.backManageTeam).toBeVisible();
    await expect(this.removeAssociateGuidance).toBeVisible();
    let i = 0;
    for (const [header, cell] of this.removeAssociateTable) {
      await expect(this.page.locator("table").locator("thead").locator("th").nth(i)).toHaveText(header);
      await expect(this.page.locator("table").locator("tbody").locator("td").nth(i)).toHaveText(cell);
      i++;
    }
    await expect(this.removeAssociateButton).toBeVisible();
    await expect(this.removeAssociateButton).toHaveCSS("background-color", "rgb(212, 53, 28)");
    await expect(this.cancelLink).toBeVisible();
  }

  @When("the user clicks the Remove associate button")
  async clickRemoveAssociateButton() {
    await this.removeAssociateButton.click();
  }

  @When("the user enters invalid {string} in the date {string}")
  async validateDateField(info: string, field: string) {
    //first complete form so it's in a valid state
    await this.completeFormValidInput();
    await this.validStartDate();
    await this.page.getByLabel(field).fill(info);
  }

  @Then("the user will see the date validation {string}")
  async valMessageVisible(message: string) {
    await this.commands.validationLink(message);
    await expect(this.page.getByRole("paragraph").filter({ hasText: message })).toBeVisible();
  }

  @When("the user sets a date in the future as 01 {string} in the date {string}")
  async setDateInFuture(month: string, year: string) {
    await this.completeContactForm("Joe", "Bloggs", "joe.bloggs@bloggs.test.test");
    await this.validStartDate();
    await this.page.getByLabel("Day").fill("01");
    await this.page.getByLabel("Month").fill(month);
    await this.page.getByLabel("Year").fill(year);
  }

  // **METHODS**

  /**
   * Unchecks a pcr box
   */
  async uncheckPCR(label: PcrType | string | RegExp) {
    await this.page.getByLabel(label).uncheck();
  }

  /**
   * Function to assert for different tables based on QA tags listed within POM above.
   */
  async checkManageTeamMemberTable(locator: Locator, name: string, organisation: string, associate: boolean) {
    await expect(locator.locator("th").nth(0).filter({ hasText: "Name" })).toBeVisible();
    await expect(locator.locator("td").nth(0).filter({ hasText: name })).toBeVisible();
    await expect(locator.locator("th").nth(1).filter({ hasText: "Organisation" })).toBeVisible();
    await expect(locator.locator("td").nth(1).filter({ hasText: organisation })).toBeVisible();
    if (associate) {
      await expect(locator.locator("th").nth(2).filter({ hasText: "Manage" })).toBeVisible();
      await expect(locator.locator("td").nth(2).getByRole("link").filter({ hasText: "Remove" })).toBeVisible();
    }
  }

  async completeToCharacterLimit(charlength: number, inputField: string, email: boolean, accurateEmail?: boolean) {
    if (email) {
      //let emailLorem = `IfyoueverneedareasontogototheofficeinSwindonconsiderthefactthateverythirdwednesdaypippindonuts@x.comm`;
      let emailLorem = "IfyoueverneedareasontogototheofficeinSwindonconsiderthefactthateverythirdw@x.comm";
      await this.page.getByLabel(inputField).fill(emailLorem);
      if (accurateEmail) {
        await this.page.getByLabel(inputField).press("End");
        await this.page.getByLabel(inputField).press("Backspace");
      }
    } else {
      let lorem = getLorem(charlength);
      await this.page.getByLabel(inputField).fill(lorem);
    }
  }

  async validateLength(fieldName: string, length: string) {
    await this.commands.validationMessage(`${fieldName} must be ${length} characters or less.`);
  }

  async checkInviteLabelsExist() {
    for (const input of this.inviteFormNames) {
      await expect(this.page.getByLabel(input)).toBeVisible();
    }
    await expect(this.page.getByLabel("Email")).toBeVisible();
  }

  /**
   * Method to view the replace pages.
   */
  //TODO:Assert for functionality of the cancel link.
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
      await this.commands.heading(heading);
      await expect(this.backManageTeam).toBeVisible();
      await expect(this.page.getByText(guidance)).toBeVisible();
      await expect(this.page.locator("th").nth(0).filter({ hasText: "Name" })).toBeVisible();
      await expect(this.page.locator("td").nth(0).filter({ hasText: name })).toBeVisible();
      await expect(this.page.locator("th").nth(1).filter({ hasText: "Organisation" })).toBeVisible();
      await expect(this.page.locator("td").nth(1).filter({ hasText: partner })).toBeVisible();
      await expect(this.page.getByRole("heading").filter({ hasText: subheading })).toBeVisible();
      await expect(this.page.getByText(hint)).toBeVisible();
      await this.checkInviteLabelsExist();
      await expect(this.inviteOrgLabel).toHaveText("Organisation");
      await expect(this.confirmReplacementButton).toBeVisible();
      await expect(this.confirmReplacementButton).toHaveCSS("background-color", "rgb(212, 53, 28)");
      await expect(this.page.getByRole("link").filter({ hasText: "Cancel" })).toBeVisible();
    } else if (fc) {
      await this.commands.heading("Replace finance contact");
      await expect(this.backManageTeam).toBeVisible();
      await expect(this.page.getByText(this.replaceFcGuidance)).toBeVisible();
      await expect(
        this.page.getByRole("button").filter({ hasText: "Confirm replacement and send invitation" }),
      ).toBeDisabled();
      await this.page.getByRole("link").filter({ hasText: "Cancel" }).isVisible();
      for (const fc of this.fcDropdownList) {
        await this.page.getByRole("combobox").selectOption(fc);
      }
      await expect(
        this.page.getByRole("button").filter({ hasText: "Confirm replacement and send invitation" }),
      ).not.toBeDisabled();
      await this.checkInviteLabelsExist();
      await expect(this.replaceFcSubheading).toBeVisible();
      await expect(this.page.getByText(this.replaceFcHint)).toBeVisible();
      await expect(this.confirmReplacementButton).toBeVisible();
      await expect(this.confirmReplacementButton).toHaveCSS("background-color", "rgb(212, 53, 28)");
      await expect(this.cancelLink).toBeVisible();
    } else if (associate) {
      await expect(this.page.getByRole("heading").filter({ hasText: "Invite a new associate" })).toBeVisible();
      await expect(this.backManageTeam).toBeVisible();
      await expect(this.page.getByText(this.associateGuidance)).toBeVisible();
      await this.checkInviteLabelsExist();
      await expect(this.inviteOrgLabel).toBeVisible();
      await expect(
        this.page.locator("css=#hint-for-partnerId").filter({ hasText: "Hedge's Secondary Ltd." }),
      ).toBeVisible();
      for (const date of this.associateStartDateList) {
        await expect(this.page.getByLabel(date)).toBeVisible();
      }
      await expect(this.page.getByText(this.associateFooter)).toBeVisible();
      await expect(this.page.getByRole("link").filter({ hasText: this.supportEmail })).toBeVisible();
    }
  }

  async emptyFormValidation(associate: boolean) {
    for (const valMsg of this.submitEmptyValidation) {
      await expect(this.page.getByTestId("validation-summary").filter({ hasText: valMsg })).toBeVisible();
    }
    if (associate) {
      await expect(
        this.page.getByTestId("validation-summary").filter({ hasText: "Enter a start date." }),
      ).toBeVisible();
    }
  }

  async invalidAlphaCharacterMsg() {
    for (const input of this.associateStartDateList) {
      let valLabel = input.toLowerCase();
      if (valLabel === "year") {
        await this.commands.validationMessage(`Start ${valLabel} must be a valid 4 digit number.`);
      } else {
        await this.commands.validationMessage(`Start ${valLabel} must be a valid number.`);
      }
      await this.commands.validationMessage(`Enter a valid start date`);
    }
  }

  monthNow() {
    let date = new Date();
    let month = date.getMonth();
    let accurateMonth = month + 1;
    return accurateMonth.toString();
  }

  yearFromNow() {
    const date = new Date();
    let year = date.getFullYear() + 1;
    return String(year);
  }

  async completeContactForm(firstName: string, lastName: string, email: string) {
    await this.page.getByLabel(this.inviteFormNames[0]).fill(firstName);
    await this.page.getByLabel(this.inviteFormNames[1]).fill(lastName);
    await this.page.getByLabel("Email").fill(email);
  }

  async reviewScreenReasoning(inviteAssociate: boolean, removeAssociate: boolean) {
    let actiontype: string;
    if (inviteAssociate) {
      actiontype = "Invite a team member";
    } else if (removeAssociate) {
      actiontype = "Remove a team member";
    } else {
      actiontype = "Replace a team member";
    }
    const listData = [
      ["Request number", /[1-9]/],
      ["Type", "Manage team members"],
      ["Action", actiontype],
    ];
    for (const [key, list] of listData) {
      await this.commands.getListItemFromKey(key, list, true);
    }
  }

  async getUserDetails(pcr: string) {
    let firstName: string;
    let lastName: string;
    let emailAddress: string;
    let role: string;
    const context = this.projectState.context as TwoParticipantKTPProjectFactoryScriptContext;
    if (pcr === "Replace project manager") {
      firstName = "Project";
      lastName = "Manager";
      emailAddress = String(context.pmPcl.Acc_EmailOfSFContact__c);
      role = "Project Manager";
    } else if (pcr === "Replace finance contact") {
      firstName = "Main Finance";
      lastName = "Contact";
      emailAddress = String(context.mainFcPcl.Acc_EmailOfSFContact__c);
      role = "Finance contact";
    } else if (pcr === "Replace knowledge base administrator") {
      firstName = "Knowledge";
      lastName = "Base";
      emailAddress = String(context.kbAdminPcl.Acc_EmailOfSFContact__c);
      role = "Knowledge base administrator";
    } else if (pcr === "Replace main company contact") {
      firstName = "Main";
      lastName = "Contact";
      emailAddress = String(context.mccPcl.Acc_EmailOfSFContact__c);
      role = "Main company contact";
    } else if (pcr === "Manage team members") {
      firstName = "Anna";
      lastName = "Sociate";
      emailAddress = String(context.assPcl.Acc_EmailOfSFContact__c);
      role = "Associate";
    }
    return { firstName, lastName, emailAddress, role };
  }

  async reviewScreenExisting(pcr: string) {
    let firstName = (await this.getUserDetails(pcr)).firstName;
    let lastName = (await this.getUserDetails(pcr)).lastName;
    let emailAddress = (await this.getUserDetails(pcr)).emailAddress;
    let role = (await this.getUserDetails(pcr)).role;
    const existingData = [
      ["First name", firstName, "before-firstName"],
      ["Last name", lastName, "before-lastName"],
      ["Email address", emailAddress, "before-email"],
      ["Role", role, "before-role"],
    ];
    if (pcr === "Manage team members") {
      await expect(this.page.getByRole("heading").filter({ hasText: "Team member being removed" })).toBeVisible();
    } else {
      await expect(this.page.getByRole("heading").filter({ hasText: "Team member being replaced" })).toBeVisible();
    }
    for (const [key, list, qa] of existingData) {
      await this.commands.getListItemFromKey(key, list, true, false, qa);
    }
  }

  async reviewScreenNew(pcr: string) {
    let role: string;
    if (pcr === "Replace project manager") {
      role = "Project Manager";
    } else if (pcr === "Replace finance contact") {
      role = "Finance contact";
    } else if (pcr === "Replace main company contact") {
      role = "Main company contact";
    } else if (pcr === "Replace knowledge base administrator") {
      role = "Knowledge base administrator";
    } else if (pcr === "Invite a new associate") {
      role = "Associate";
    }

    const newData = [
      ["First name", "Joe", "after-firstName"],
      ["Last name", "Bloggs", "after-lastName"],
      ["Email address", "joe.bloggs@bloggs.test.test", "after-email"],
      ["Role", role, "after-role"],
    ];
    await expect(this.page.getByRole("heading").filter({ hasText: "Team member being invited" })).toBeVisible();
    for (const [key, list, qa] of newData) {
      await this.commands.getListItemFromKey(key, list, true, false, qa);
    }
  }

  @Then("the PM has logged in and created a PCR")
  async noFcCreatePcr() {
    await this.accUserswitcher.switchToUser("pmUser");
    await this.accNavigation.gotoProjectChangeRequests();
    await this.userClicksCreate();
    await this.startRequestPage();
  }

  @Then("the {string} button should not exist")
  async pageWithoutFc(buttonName: string) {
    await expect(this.page.getByRole("paragraph").filter({ hasText: "No contacts exist." })).toBeVisible();
    await expect(this.page.getByRole("button")).not.toContainText(buttonName);
  }
}
