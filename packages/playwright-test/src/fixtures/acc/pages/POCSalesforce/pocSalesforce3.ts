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
  constructor({ page, sfdcApi, sfdcPage }: { page: Page; sfdcApi: SfdcApi; sfdcPage: SfdcLightningPage }) {
    this.page = page;
    this.sfdcPage = sfdcPage;
    this.sfdcApi = sfdcApi;
  }

  @Given("there is a Competition created using the UI")
  async createCRndProject() {
    // Create Competition using the UI

    let pathComp = String(`/lightning/o/Competition__c/list?filterName=All`);
    await this.sfdcPage.loginAndGoto(pathComp);
    this.page.waitForTimeout(5000);
    await this.page.locator("//div[@title='New' or class='forceActionLink']").click();
    const uniqueCompId = Math.floor(Math.random() * (99999 + 100000) + 1);
    await this.page.locator("(//input[@class='slds-input'])[2]").fill("PW-" + uniqueCompId);
    await this.page.getByRole("dialog").getByLabel("Competition Type").getByRole("combobox").click();
    await this.page
      .getByRole("dialog")
      .getByLabel("Competition Type")
      .getByRole("combobox")
      .selectOption({ value: "CR&D" });
    await this.page
      .getByRole("button")
      .filter({ hasText: /^Save&/ })
      .click();
  }
}
