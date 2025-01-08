import { expect, Locator, Page } from "@playwright/test";
import { Fixture, Then, When } from "playwright-bdd/decorators";
import { Commands } from "../../../Commands";
import { ProjectChangeRequests } from "./ProjectChangeRequests";
import { DataTable } from "playwright-bdd";

export
@Fixture("changeProjectDuration")
class ChangeProjectDuration {
  protected readonly page: Page;
  private readonly commands: Commands;
  private readonly pcr: ProjectChangeRequests;
  private readonly durationHeading: Locator;
  private readonly guidanceText: Array<string>;
  private readonly existingDetailsSubheading: Locator;
  private readonly proposedDetailsSubheading: Locator;
  private readonly selectionHint: Locator;
  private readonly saveContinueButton: Locator;
  private readonly dropDownMenu: Locator;
  private readonly startAndEndLabel: Locator;
  private readonly durationLabel: Locator;
  private readonly currentDateSelection: Locator;
  private readonly existingDetailsHeading: Locator;
  private readonly existingDetails: Array<[string, string]>;
  private readonly proposedDetailsHeading: Locator;
  private readonly proposedDetails: Array<[string, string]>;
  private readonly markAsComplete: Locator;
  private readonly agreeWithChange: Locator;
  private readonly saveReturntoRequest: Locator;
  private readonly backToRequest: Locator;

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
    this.durationHeading = this.page.getByRole("heading").filter({
      hasText: "Change project duration",
    });
    this.guidanceText = [
      "Use this page to request an extension or reduction to your project’s duration. Values are set by month.",
      "Select the new project end date you require. Project durations cannot be reduced beyond the current month.",
    ];
    this.existingDetailsSubheading = this.page.getByRole("heading").filter({ hasText: "Existing project details" });
    this.proposedDetailsSubheading = this.page.locator("css=legend").filter({ hasText: "Proposed project details" });
    this.selectionHint = this.page.getByLabel("Please select a new date from the available list");
    this.saveContinueButton = this.page.getByRole("button").filter({ hasText: "Save and continue" });
    this.dropDownMenu = this.page.getByRole("combobox");
    this.startAndEndLabel = this.page.locator("//div[5]/div/label[1]").filter({ hasText: "Start and end date" });
    this.durationLabel = this.page.locator("//div[5]/div/label[2]").filter({ hasText: "Duration" });
    this.currentDateSelection = this.page.getByRole("option").filter({ hasText: "Current project end date" });
    this.existingDetailsHeading = this.page.getByRole("heading").filter({ hasText: "Existing project details" });
    this.existingDetails = [
      ["Start and end date", `1 ${this.getMonthAndYear()}`],
      ["Duration", "36 months"],
    ];
    this.proposedDetailsHeading = this.page.getByRole("heading").filter({ hasText: "Proposed project details" });
    this.proposedDetails = [
      ["Start and end date", `1 ${this.getMonthAndYear()}`],
      ["Duration", "37 months"],
    ];
    this.markAsComplete = this.page.locator("css=legend").filter({ hasText: "Mark as complete" });
    this.agreeWithChange = this.page.getByLabel("I agree with this change.");
    this.saveReturntoRequest = this.page.getByRole("button").filter({ hasText: "Save and return to request" });
    this.backToRequest = this.commands.backLink("Back to request");
  }

  @Then("the user will see the Change project duration PCR page")
  async viewChangeDurationPage() {
    await expect(this.durationHeading).toBeVisible();
    for (const guidance of this.guidanceText) {
      await expect(this.page.getByRole("paragraph").filter({ hasText: guidance })).toHaveText(guidance);
    }
    await expect(this.existingDetailsSubheading).toBeVisible();
    await expect(this.proposedDetailsSubheading).toBeVisible();
    await expect(this.selectionHint).toBeVisible();
    await expect(this.dropDownMenu.filter({ has: this.currentDateSelection })).toBeVisible();
    await expect(this.startAndEndLabel).toBeVisible();
    await expect(this.durationLabel).toBeVisible();
    await expect(this.saveContinueButton).toBeVisible();
    await this.durationChange();
  }

  @When("the user submits a Change project duration PCR")
  async submitChangeDuration() {
    await this.dropDownMenu.selectOption({ value: `1` });
    await expect(this.page.locator("//form/div[1]/div/p[2]/span").filter({ hasText: `37 months` })).toBeVisible();
    await this.saveContinueButton.click();
    await this.summaryPage(true);
    await this.pcr.requestPagePcrStatus("Change project duration", "Complete");
    await this.pcr.completePcrReasons();
    await this.pcr.submitRequest();
  }

  @Then("the user can see the Change project duration summary with reasoning")
  async changeDurationSummaryPage(data: DataTable) {
    await this.summaryPage(false);
    await this.pcr.nextReasoning();
    await this.pcr.reasoningPageDisplayed(data);
  }

  /**
   * METHODS
   */

  async durationChange() {
    for (let i = -35; i < 60; i++) {
      let duration = 36 + i;
      await this.dropDownMenu.selectOption({ value: `${i}` });
      if (duration === 1) {
        let suffix = "month";
        await expect(
          this.page.locator("//form/div[1]/div/p[2]/span").filter({ hasText: `${duration} ${suffix}` }),
        ).toBeVisible();
      } else {
        let suffix = "months";
        await expect(
          this.page.locator("//form/div[1]/div/p[2]/span").filter({ hasText: `${duration} ${suffix}` }),
        ).toBeVisible();
      }
    }
  }

  getMonthAndYear() {
    return new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  }

  async summaryPage(pm: boolean) {
    for (const [key, item] of this.existingDetails) {
      await this.commands.getListItemFromKey(key, item, false, false, "existingProjectDetails");
    }
    await expect(this.proposedDetailsHeading).toBeVisible();
    for (const [key, item] of this.proposedDetails) {
      await this.commands.getListItemFromKey(key, item, false, false, "proposedProjectDetails");
    }
    await expect(this.existingDetailsHeading).toBeVisible();
    await expect(this.backToRequest).toBeVisible();
    await expect(this.durationHeading).toBeVisible();
    if (pm) {
      await expect(this.markAsComplete).toBeVisible();
      await this.agreeWithChange.check();
      await this.saveReturntoRequest.click();
    }
  }
}
