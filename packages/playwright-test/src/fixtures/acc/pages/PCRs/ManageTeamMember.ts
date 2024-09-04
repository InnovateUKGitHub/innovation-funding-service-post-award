import { expect, Locator, Page } from "@playwright/test";
import { Fixture, Then, When } from "playwright-bdd/decorators";
import { PageHeading } from "../../../../components/PageHeading";
import { Button } from "../../../../components/Button";
import { Commands } from "../../../Commands";
import { PcrType } from "../../../../Typings/pcr";

export
@Fixture("manageTeamMember")
class TeamManagement {
  protected readonly page: Page;
  protected readonly commands: Commands;
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
  private readonly checkBoxes: Array<PcrType>;
  private readonly checkBoxHint: Array<string>;
  private readonly choiceDivider: RegExp;
  private readonly disabledBoxes: Array<PcrType>;
  private readonly manageTitle: PageHeading;

  constructor({ page, commands }: { page: Page; commands: Commands }) {
    this.page = page;
    this.commands = commands;
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
    this.manageTitle = PageHeading.fromTitle(page, "Manage team members");
  }

  //STEP DEFINITIONS//

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
  /**
   * Selects all PCR types that aren't 'Manage team members'
   */
  async uncheckPCR(label: PcrType) {
    await this.page.getByLabel(label).uncheck();
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
}
