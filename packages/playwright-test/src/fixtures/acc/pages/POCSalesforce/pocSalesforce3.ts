import { expect, Page } from "@playwright/test";
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

  @Given("there is a Competition created using the UI")
  async createCompetition() {
    let pathComp = String(`/lightning/o/Competition__c/list?filterName=All`);
    await this.sfdcPage.loginAndGoto(pathComp);
    await this.page.locator("//div[@title='New' or class='forceActionLink']").click();
    await this.page.getByRole("dialog").getByLabel("Competition ID").fill(this.uniqueCompId);
    await this.selectDropdown("Competition Type", "KTP");
    await this.page
      .getByRole("button")
      .filter({ hasText: /^Save$/ })
      .click();
  }

  @Given("there is a Project created using the UI")
  async createProject() {
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

    // Navgate to Project
    let pathProject = String(`/lightning/o/Acc_Project__c/list?filterName=All`);
    await this.sfdcPage.loginAndGoto(pathProject);
    await this.page.locator("//div[@title='New' or class='forceActionLink']").click();

    await this.page
      .getByRole("dialog")
      .getByLabel("Project Title")
      .fill("Playwright Test - " + Math.floor(Math.random() * (99999 + 100000) + 1));

    // *****   Need to enter the Competition rather than click then select ******
    await this.getByFieldID("RecordAcc_CompetitionId__cField").getByLabel("Competition").click();
    await this.page.waitForTimeout(500); /*
    await this.getByFieldID("RecordAcc_CompetitionId__cField")
      .getByLabel("Competition")
      .getByRole("combobox")
      .fill(this.uniqueCompId); */
    await this.page.locator("lightning-base-combobox-item").filter({ hasText: this.uniqueCompId }).click();

    await this.getByFieldID("RecordAcc_Duration__cField").getByLabel("Duration").fill("12");
    await this.getByFieldID("RecordAcc_TSBProjectNumber__cField")
      .getByLabel("TSB Project Number")
      .fill(Math.floor(Math.random() * (99999 + 100000) + 1).toString());

    // Click Save button
    await this.page
      .getByRole("button")
      .filter({ hasText: /^Save$/ })
      .click();
  }

  @Given("Contacts and Participants are added by the UI")
  async editProject() {
    type QueryProjectId = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: string; url: string };
        Id: string;
      }[];
    };

    type QueryUserDetails = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: string };
        Id: string;
        ContactId: string;
        AccountId: string;
        Name: string;
        AccountName: string;
        Email: string;
      }[];
    };

    const conn = await this.sfdcApi.getTsforceConnection();
    await this.page.waitForTimeout(5000);

    // Get Project Id
    let query = `SELECT Id FROM Acc_Project__c  WHERE Acc_CompetitionId__r.Name = '${this.uniqueCompId}'`;
    console.log("Project Query SOQL:  " + query);
    const responseProject: QueryProjectId = await conn.executeSOQL({
      query,
    });

    const myJSON = JSON.stringify(responseProject);
    console.log(myJSON);
    const projectId = responseProject.records[0].Id;

    // Identify Users that can be used for Project Manager, Monitoring Officer and Finance Contact
    query = `SELECT id, contactId, accountId, contact.Name, account.Name AccountName, contact.email
FROM USER 
WHERE profile.name IN ('IUK Customer Community Plus Login User','Customer Community Plus User', 'Customer Community Plus Login User') and contactid!=null
GROUP BY accountId,contactId,Id,contact.Name,account.Name,contact.email HAVING count(id)>=1 order by count(id)
LIMIT 3`;

    console.log("Users Query SOQL:  " + query);
    const responseUsers: QueryUserDetails = await conn.executeSOQL({
      query,
    });

    const myJSONUsers = JSON.stringify(responseUsers);
    console.log(myJSONUsers);

    // Navigate to Project
    let path = String(`/lightning/r/Acc_Project__c/${projectId}/view`);
    await this.sfdcPage.loginAndGoto(path);

    // Add PCLs
    // ********************************************************************
    await this.page.getByLabel("Tabs").locator("li").filter({ hasText: "Contacts" }).click();

    // Project Manager
    let externalUser = responseUsers.records[0].Name;
    let externalUserAccount = responseUsers.records[0].AccountName;
    let externalUserEmail = responseUsers.records[0].Email;
    await this.addPCL(externalUser, externalUserAccount, "Project Manager", externalUserEmail);

    // Monitoring Officer
    externalUser = responseUsers.records[1].Name;
    externalUserAccount = responseUsers.records[1].AccountName;
    externalUserEmail = responseUsers.records[1].Email;
    await this.addPCL(externalUser, externalUserAccount, "Monitoring Officer", externalUserEmail);

    // Finance Contact
    externalUser = responseUsers.records[2].Name;
    externalUserAccount = responseUsers.records[2].AccountName;
    externalUserEmail = responseUsers.records[2].Email;
    await this.addPCL(externalUser, externalUserAccount, "Finance Contact", externalUserEmail);

    // Add Participants
    // ********************************************************************

    await this.page.getByLabel("Tabs").locator("li").filter({ hasText: "Participants" }).click();

    // Project Manager
    externalUser = responseUsers.records[0].Name;
    externalUserAccount = responseUsers.records[0].AccountName;
    externalUserEmail = responseUsers.records[0].Email;
    await this.addParticipant(externalUser, externalUserAccount, "Project Lead");

    // Finance Contact
    externalUser = responseUsers.records[2].Name;
    externalUserAccount = responseUsers.records[2].AccountName;
    externalUserEmail = responseUsers.records[2].Email;
    await this.addParticipant(externalUser, externalUserAccount, "Collaborator");

    await this.page.waitForTimeout(10000);
  }

  @Given("Stattdate added and Project status changed to Live using the UI")
  async changeProjectStatus() {
    await this.page.getByLabel("Tabs").locator("li").filter({ hasText: "Details" }).click();

    // Select pen icon
    await this.getByFieldID("RecordAcc_ProjectTitle__cField").getByTitle("Edit Project Title").click();

    await this.selectDropdown("Claim Frequency", "Monthly");
    await this.getByFieldID("RecordAcc_StartDate__cField").getByLabel("Start Date").fill("01/06/2024");
    await this.selectDropdown("Project Reporting Type", "Public");
    await this.selectDropdown("Monitoring Level", "Gold");
    //    await this.selectDropdown("Monitoring Report Schedule", "Quarterly");
    // ******** Had issues with the selectDropdown function returning multiple values ************
    await this.page.getByRole("combobox", { name: "Monitoring Report Schedule" }).click();
    await this.page.keyboard.type("Yearly");
    await this.page.keyboard.press("Enter");

    await this.getByFieldID("RecordAcc_WorkdayProjectSetupComplete__cField")
      .getByLabel("Workday Project Setup Complete")
      .check();

    // Click Save button
    await this.page
      .getByRole("button")
      .filter({ hasText: /^Save$/ })
      .click();

    // Select Live
    await this.page.waitForTimeout(10000);
    await this.page.getByRole("listbox").locator("li").filter({ hasText: "Live" }).click();
    await this.page.locator("button").filter({ hasText: "Mark as Current Project Status" }).click();
    //await this.page.getByRole("listbox").locator("li").filter({ hasText: "Mark as Current Project Status" }).click();
  }

  // Functions
  // *************************************************************************************************************

  getByFieldID(label: string) {
    return this.page.locator(`[data-field-id="${label}"]`);
  }

  async selectDropdown(label: string, option: string) {
    await this.page.getByRole("combobox", { name: label }).click();
    await this.page.locator("lightning-base-combobox-item").filter({ hasText: option }).click();
  }

  // Adds Participant
  async addParticipant(externalUserVal: string, externalUserAccountVal: string, projectRoleVal: string) {
    console.log("External User: " + externalUserVal);
    console.log("External User Account: " + externalUserAccountVal);

    // Click New button
    await this.page.getByRole("presentation").getByTitle("New").filter({ hasText: /^New$/ }).click();

    await this.getByFieldID("RecordAcc_AccountId__cField").getByLabel("Account").click();
    await this.getByFieldID("RecordAcc_AccountId__cField").getByLabel("Account").fill(externalUserAccountVal);
    await this.getByFieldID("RecordAcc_AccountId__cField")
      .locator("li")
      .locator("lightning-base-combobox-item")
      .filter({ hasText: externalUserAccountVal })
      .first()
      .click();

    await this.selectDropdown("Project Role", projectRoleVal);

    await this.selectDropdown("Participant Type", "Business");

    await this.selectDropdown("Organisation Type", "Industrial");

    await this.getByFieldID("RecordAcc_WorkdaySupplierSetupComplete__cField")
      .getByLabel("Workday Supplier Setup Complete")
      .check();

    // Click Save button
    await this.page
      .getByRole("button")
      .filter({ hasText: /^Save$/ })
      .click();
  }

  // Adds PCL
  async addPCL(
    externalUserVal: string,
    externalUserAccountVal: string,
    projectRoleVal: string,
    externalUserEmailVal: string,
  ) {
    console.log("External User: " + externalUserVal);
    console.log("External User Account: " + externalUserAccountVal);

    // Click New button
    await this.page.getByRole("presentation").getByTitle("New").filter({ hasText: /^New$/ }).click();

    await this.selectDropdown("Project Role", projectRoleVal);

    await this.getByFieldID("RecordAcc_ContactId_cField").getByLabel("External User").click();
    await this.getByFieldID("RecordAcc_ContactId_cField").getByLabel("External User").fill(externalUserVal);
    await this.getByFieldID("RecordAcc_ContactId_cField")
      .locator("li")
      .locator("lightning-base-combobox-item")
      .filter({ hasText: externalUserVal })
      .first()
      .click();

    await this.getByFieldID("RecordAcc_AccountId_cField").getByLabel("Account").click();
    await this.getByFieldID("RecordAcc_AccountId_cField").getByLabel("Account").fill(externalUserAccountVal);
    await this.getByFieldID("RecordAcc_AccountId_cField")
      .locator("li")
      .locator("lightning-base-combobox-item")
      .filter({ hasText: externalUserAccountVal })
      .first()
      .click();

    await this.getByFieldID("RecordAcc_EmailOfSFContact_cField")
      .getByLabel("Project Contact Email")
      .fill(externalUserEmailVal + ".noemail");

    // Click Save button
    await this.page
      .getByRole("button")
      .filter({ hasText: /^Save$/ })
      .click();
  }
}
