import { expect, Page, Project } from "@playwright/test";
import { Fixture, Then, When } from "playwright-bdd/decorators";

import { BaseCrndProjectScriptContext } from "@innovateuk/project-factory-two/scripts/BaseCrndProjectScript";
import { DataTable } from "playwright-bdd";
import { Commands } from "../../../Commands";
import { SfdcApi } from "../../../sfdc/SfdcApi";
import { SfdcLightningPage } from "../../../sfdc/SfdcLightningPage";
import { ProjectState } from "../../../projectFactory/ProjectState";

export
@Fixture("pocSalesforce2")
class PocSalesforce2 {
  protected readonly page: Page;
  protected readonly commands: Commands;
  protected readonly sfdcApi: SfdcApi;
  protected readonly sfdcPage: SfdcLightningPage;
  protected readonly projectState: ProjectState;

  constructor({
    page,
    commands,
    sfdcApi,
    projectState,
    sfdcPage,
  }: {
    page: Page;
    commands: Commands;
    sfdcApi: SfdcApi;
    projectState: ProjectState;
    sfdcPage: SfdcLightningPage;
  }) {
    this.page = page;
    this.commands = commands;
    this.sfdcApi = sfdcApi;
    this.sfdcPage = sfdcPage;
    this.projectState = projectState;
  }

  getContext() {
    const contextVal = this.projectState.context as BaseCrndProjectScriptContext;
    return contextVal;
  }

  /**
   * Tool to locate elements using a SF-specific id.
   */
  getByFieldID(label: string) {
    return this.page.locator(`[data-field-id="${label}"]`);
  }

  getByDataComponentID(id: string) {
    return this.page.locator(`[data-component-id="${id}"]`);
  }

  async checkNavBar(table: DataTable) {
    const data = table.hashes();
    for (const row of data) {
      await expect(this.page.getByTitle(row["tab"]).filter({ hasText: row["tab"] })).toBeVisible();
    }
  }

  getTab(tabName: string) {
    return this.page.getByRole("tablist").getByRole("tab").filter({ hasText: tabName });
  }

  async getProjectTabData(apiName: string, label: string) {
    let fieldId = `Record${apiName}Field`;
    await expect(this.getByFieldID(fieldId).getByRole("listitem").filter({ hasText: label })).toBeVisible();
  }

  @When("the user accesses the Project Factory project in Salesforce")
  async accessProject() {
    const context = this.projectState.context as BaseCrndProjectScriptContext;
    const iD = String(context.project.Acc_ProjectNumber__c);
    console.log(iD);

    type QueryProjectId = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: string; url: string };
        Id: string;
      }[];
    };
    const conn = await this.sfdcApi.getTsforceConnection();
    await conn.executeApex({ query: "System.debug('Run an Apex query');" });

    const response: QueryProjectId = await conn.executeSOQL({
      query: `SELECT Id FROM Acc_Project__c WHERE Acc_ProjectNumber__c = '${iD}'`,
    });

    const myJSON = JSON.stringify(response);
    console.log(myJSON);
    const projectId = response.records[0].Id;
    let path = String(`/lightning/r/Acc_Project__c/${projectId}/view`);
    console.log(iD);
    await this.sfdcPage.loginAndGoto(path);
  }

  @Then("the user can see the project Lightning page")
  async seeSfData(table: DataTable) {
    await expect(this.page.getByTitle("App Launcher")).toHaveAttribute("aria-expanded", "false");
    await expect(this.page.getByTitle("IFS Post Award")).toHaveText("IFS Post Award");
    await this.checkNavBar(table);
    await expect(
      this.getByDataComponentID("force_highlightsPanel").getByRole("heading").filter({ hasText: "Project" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("presentation").getByRole("listitem").filter({ hasText: "Project Number" }),
    ).toBeVisible();
  }

  @Then("the user sees the project data")
  async contextDataOnPage(table: DataTable) {
    let data = table.hashes();

    //Wait to double-check DOM is built
    await this.page.waitForTimeout(5000);

    //Context data values from project factory used during setup of project
    const projectNumber = this.getContext().project.Acc_ProjectNumber__c;
    const compType = this.getContext().competition.Acc_CompetitionType__c;
    const startDate = this.getContext().project.Acc_StartDate__c.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    const projectStatus = this.getContext().project.Acc_ProjectStatus__c;
    const duration = String(this.getContext().project.Acc_Duration__c);

    await expect(this.getTab("Details")).toBeVisible();

    for (const row of data) {
      await this.getProjectTabData(row["id"], row["label"]);
    }

    //Asserting for data values from project factory appear on page
    await this.getProjectTabData("Acc_ProjectNumber__c", projectNumber);
    await this.getProjectTabData("Acc_CompetitionType__c", compType);
    await this.getProjectTabData("Acc_StartDate__c", startDate);
    await this.getProjectTabData("Acc_Duration__c", duration);
    await this.getProjectTabData("Acc_ProjectStatus__c", projectStatus);
  }

  @When("the user clicks Edit and changes the Project Title to {string}")
  async updatedProjectTitle(newTitle: string) {
    await this.page.getByRole("presentation").getByRole("button").filter({ hasText: "Edit" }).click();
    await this.page.getByRole("dialog").getByLabel("Project Title").fill(newTitle);
    await this.page
      .getByRole("dialog")
      .getByRole("button")
      .filter({ hasText: /^Save$/ })
      .click();
  }

  @Then("the project title is correctly saved as {string}")
  async updatedTitleSaved(newTitle: string) {
    await this.getProjectTabData("Acc_ProjectTitle__c", newTitle);
  }
}
