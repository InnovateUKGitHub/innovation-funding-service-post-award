import { Page } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { Fixture, Given } from "playwright-bdd/decorators";
import { SfdcApi } from "../../../sfdc/SfdcApi";
import { SfdcLightningPage } from "../../../sfdc/SfdcLightningPage";

export
@Fixture("poc3")
class Poc3 {
  protected readonly sfdcApi: SfdcApi;
  protected readonly page: Page;
  protected readonly sfdcPage: SfdcLightningPage;
  private readonly uniqueCompId: string;
  constructor({ page, sfdcApi, sfdcPage }: { page: Page; sfdcApi: SfdcApi; sfdcPage: SfdcLightningPage }) {
    this.page = page;
    this.sfdcPage = sfdcPage;
    this.sfdcApi = sfdcApi;
    this.uniqueCompId = String(`PW-${Math.floor(Math.random() * (99999 + 100000) + 1)}`);
  }

  async selectDropdown(label: string, option: string) {
    await this.page.getByRole("combobox", { name: label }).click();
    await this.page.locator("lightning-base-combobox-item").filter({ hasText: option }).click();
  }

  @Given("there is a Competition created using the UI")
  async createCompetition() {
    // Create Competition using the UI
    //const uniqueCompId = Math.floor(Math.random() * (99999 + 100000) + 1);

    let pathComp = String(`/lightning/o/Competition__c/list?filterName=All`);
    await this.sfdcPage.loginAndGoto(pathComp);

    await this.page.locator("//div[@title='New' or class='forceActionLink']").click();

    /**
     * Alternatively to xpath below you can simply use the following:
     *  await this.page.getByLabel("Competition ID").fill("Playwright-" + uniqueCompId);
     * and a new function above:
     * await this.selectDropdown("Competition Type", "CR&D")
     *
     */
    await this.page.locator("(//input[@class='slds-input'])[2]").fill(this.uniqueCompId);
    await this.page.locator("//button[@aria-label='Competition Type']").click();
    await this.page.locator("//lightning-base-combobox-item[@data-value='KTP']").click();

    await this.page
      .getByRole("button")
      .filter({ hasText: /^Save$/ })
      .click();

    //this.page.waitForTimeout(1000);
  }

  @Given("there is a Project created using the UI")
  async createCRndProject() {
    // Definition for SOQL results
    type QueryCompetitionId = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: string; url: string };
        Id: string;
      }[];
    };

    const conn = await this.sfdcApi.getTsforceConnection();

    // Get Competition Id
    let query = `SELECT Id FROM Competition__c  WHERE Name = '${this.uniqueCompId}'`;
    console.log("Competition Query SOQL:  " + query);
    const responseComp: QueryCompetitionId = await conn.executeSOQL({
      query,
    });

    const myJSON = JSON.stringify(responseComp);
    console.log(myJSON);
    const competitionId = responseComp.records[0].Id;

    let pathProject = String(`/lightning/o/Acc_Project__c/list?filterName=All`);
    await this.sfdcPage.loginAndGoto(pathProject);
    await this.page.locator("//div[@title='New' or class='forceActionLink']").click();
    await this.page
      .locator("(//input[@class='slds-input'])[2]")
      .fill("Playwright Test - " + Math.floor(Math.random() * (99999 + 100000) + 1));
    await this.page.locator("(//input[@class='slds-combobox__input slds-input'])[1]").fill(this.uniqueCompId);
    await this.page.waitForTimeout(5000);
    await this.page.keyboard.press("ArrowDown");
    //await this.page.locator("//*[@data-value='`${competitionId}`']").click();

    // Identify the Compeition from the list
    //*[@data-value="a00Pu00000HcQXbIAN"]
  }
}
