import { expect, Page } from "@playwright/test";
import path from "path";
import { Fixture, Given, When } from "playwright-bdd/decorators";
import { SfdcApi } from "../../../sfdc/SfdcApi";
import { SfdcLightningPage } from "../../../sfdc/SfdcLightningPage";
import { DataTable } from "playwright-bdd";
import { awaitResults } from "@innovateuk/project-factory-two/helpers/awaitResults";
const fs = require("fs");

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
    await this.selectDropdown("Competition Type", "CR&D");
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

  @Given("AwardRate and CapLimit updated using UI then Claim Shell batch job ran using Apex")
  async claimShells() {
    const conn = await this.sfdcApi.getTsforceConnection();

    type QueryParticipantId = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: string; url: string };
        Id: string;
      }[];
    };

    // Get Participant Ids
    let query = `SELECT Id FROM  Acc_ProjectParticipant__c WHERE Acc_ProjectId__r.Acc_CompetitionId__r.Name = '${this.uniqueCompId}'`;
    console.log("Participant Query SOQL:  " + query);
    const responseParticipant: QueryParticipantId = await conn.executeSOQL({
      query,
    });
    console.log(responseParticipant);
    const myJSONParticipant = JSON.stringify(responseParticipant);
    console.log(myJSONParticipant);

    let participantId = responseParticipant.records[0].Id;

    // Navigate to Participant
    let pathPage = String(`/lightning/r/Acc_ProjectParticipant__c/${participantId}/view`);
    await this.sfdcPage.loginAndGoto(pathPage);

    // Select pen icon
    await this.getByFieldID("RecordAcc_ParticipantStatus__cField").getByTitle("Edit Participant Status").click();
    await this.page.waitForTimeout(10000);

    // Set AwardRate and CapLimit
    await this.getByFieldID("RecordAcc_Award_Rate__cField").getByLabel("Award Rate").fill("80");
    await this.getByFieldID("RecordAcc_Cap_Limit__cField").getByLabel("Cap Limit").clear();
    await this.getByFieldID("RecordAcc_Cap_Limit__cField").getByLabel("Cap Limit").fill("90");

    // Click Save button
    await this.page
      .getByRole("button")
      .filter({ hasText: /^Save$/ })
      .click();

    // Run batch jobs to create Claim shells
    console.log("Run batch job to create Claim shells");
    let createClaimShells = fs.readFileSync(path.join(__dirname, "../../../../../apex/runClaimCreationBatchJob.apex"), {
      encoding: "utf-8",
    });

    console.log(createClaimShells);

    const apexresponseCreateClaimShells = await conn.executeApex({
      query: createClaimShells,
    });

    console.log("Apex response: ", apexresponseCreateClaimShells);
  }

  @Given("Profiles have been updated using Apex")
  async updateProfiles(table: DataTable) {
    const data = table.rowsHash();
    const conn = await this.sfdcApi.getTsforceConnection();

    type QueryProjectParticipantId = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: string; url: string };
        Id: string;
        Acc_ProjectId__c: string;
      }[];
    };

    // Get Participant/Project Ids
    let query = `SELECT Id,  Acc_ProjectId__c FROM  Acc_ProjectParticipant__c WHERE Acc_ProjectId__r.Acc_CompetitionId__r.Name = '${this.uniqueCompId}'`;
    console.log("Participant/Project Query SOQL:  " + query);
    const responseProjectParticipant: QueryProjectParticipantId = await conn.executeSOQL({
      query,
    });
    console.log(responseProjectParticipant);
    const myJSONProjectParticipant = JSON.stringify(responseProjectParticipant);
    console.log(myJSONProjectParticipant);

    let participantId = responseProjectParticipant.records[0].Id;
    let projectId = responseProjectParticipant.records[0].Acc_ProjectId__c;

    // Update Profiles
    console.log("Update Profiles");
    let updateProfiles = fs
      .readFileSync(path.join(__dirname, "../../../../../apex/updateProfiles.apex"), { encoding: "utf-8" })
      .replaceAll("{AccProjectId}", projectId)
      .replaceAll("{Acc_ParticipantId}", participantId)
      .replaceAll("{CompetitionType}", data["CompetitionType"])
      .replaceAll("{OrganisationType}", data["OrganisationType"])
      .replaceAll("{CostCategoriesData}", data["CostCategoriesData"])
      .replaceAll("{CostCategoryArray}", data["CostCategoryArray"])
      .replaceAll("{PeriodNumberArray}", data["PeriodNumberArray"])
      .replaceAll("{ValueArray}", data["ValueArray"]);

    console.log(updateProfiles);

    const apexresponseProfiles = await conn.executeApex({
      query: updateProfiles,
    });

    console.log("Apex response: ", apexresponseProfiles);
  }

  @Given("a claim has been added using the UI")
  async addClaimUsingUI() {
    type QueryProjectParticipantId = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: string; url: string };
        Id: string;
        Acc_ProjectId__c: string;
      }[];
    };

    type QueryClaimApproval = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: number };
        expr0: number;
      }[];
    };

    const conn = await this.sfdcApi.getTsforceConnection();

    // Get Participant/Project Ids
    let query = `SELECT Id,  Acc_ProjectId__c FROM  Acc_ProjectParticipant__c WHERE Acc_ProjectId__r.Acc_CompetitionId__r.Name = '${this.uniqueCompId}'`;
    console.log("Participant/Project Query SOQL:  " + query);
    const responseProjectParticipant: QueryProjectParticipantId = await conn.executeSOQL({
      query,
    });
    console.log(responseProjectParticipant);
    const myJSONProjectParticipant = JSON.stringify(responseProjectParticipant);
    console.log(myJSONProjectParticipant);

    let participantId = responseProjectParticipant.records[0].Id;
    let projectId = responseProjectParticipant.records[0].Acc_ProjectId__c;

    // Creates and Approves 3 Claims
    await this.createAndApproveClaim(participantId, conn, 1);
    await this.createAndApproveClaim(participantId, conn, 2);
    await this.createAndApproveClaim(participantId, conn, 3);

    await this.page.waitForTimeout(50000);
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

  // Create and Approve a Claim using the UI
  async createAndApproveClaim(participantId: string, conn, periodNo: number) {
    type QueryClaimId = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: string; url: string };
        Id: string;
      }[];
    };

    type QueryProjectProfile = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: string; url: string };
        Acc_ProjectPeriodNumber__c: string;
        Acc_CostCategory__r: { type: string; url: string; Name: string };
        Acc_LatestForecastCost__c: string;
        Acc_ClaimDetail__r: { type: string; url: string; Acc_ParentId__c: string };
      }[];
    };

    // Get Claim Id
    let queryClaim = `SELECT Id
    FROM Acc_Claims__c
    WHERE Acc_ProjectParticipant__c ='${participantId}'
    AND recordType.Name = 'Total Project Period'
    AND	Acc_ProjectPeriodNumber__c = ${periodNo}`;

    console.log("Claim Query SOQL:  " + queryClaim);
    const responseClaim: QueryClaimId = await conn.executeSOQL({
      query: queryClaim,
    });
    console.log(responseClaim);
    const myJSONProjectClaim = JSON.stringify(responseClaim);
    console.log(myJSONProjectClaim);

    // Get Profile values to add to Claim
    let queryProfile = `SELECT Acc_ProjectPeriodNumber__c,Acc_CostCategory__r.name, Acc_LatestForecastCost__c
    FROM Acc_Profile__c
    WHERE Acc_ProjectParticipant__r.Id ='${participantId}'
    AND RecordType.Name = 'Profile Detail'
    AND Acc_ProjectPeriodNumber__c = ${periodNo}
    AND Acc_LatestForecastCost__c  > 0`;

    console.log("Profile Query SOQL:  " + queryProfile);
    const responseProfile: QueryProjectProfile = await conn.executeSOQL({
      query: queryProfile,
    });
    console.log(responseProfile);
    const myJSONProjectProfile = JSON.stringify(responseProfile);
    console.log("*********************", myJSONProjectProfile);

    // Add Claims Line item
    // Navigate to Project
    let path = String(`/lightning/r/Acc_ProjectParticipant__c /${participantId}/view`);
    await this.sfdcPage.loginAndGoto(path);
    await this.page.getByLabel("Tabs").locator("li").filter({ hasText: "Claims" }).click();

    // Loop thought each Line Item then add
    for (const element of responseProfile.records) {
      let costCategoryName = element.Acc_CostCategory__r.Name;
      let costCategoryType = element.Acc_CostCategory__r.type;
      let latestForecaseCosts = element.Acc_LatestForecastCost__c;
      let projectPeriodNumber = element.Acc_ProjectPeriodNumber__c;

      // Click New button
      await this.page.getByRole("button").filter({ hasText: /^New$/ }).click();

      // Click Next button
      await this.page
        .getByRole("button")
        .filter({ hasText: /^Next$/ })
        .click();

      // Add Cost Category
      await this.getByFieldID("RecordAcc_CostCategory__cField").getByLabel("Cost Category").click();
      await this.getByFieldID("RecordAcc_CostCategory__cField").getByLabel("Cost Category").fill(costCategoryName);
      await this.getByFieldID("RecordAcc_CostCategory__cField")
        .locator("li")
        .locator("lightning-base-combobox-item")
        .filter({ hasText: costCategoryName })
        .first()
        .click();
      // Add Line Item Cost
      await this.getByFieldID("RecordAcc_LineItemCost__cField")
        .getByLabel("Line Item Cost")
        .fill(latestForecaseCosts.toString());
      // Add Period Number
      await this.getByFieldID("RecordAcc_ProjectPeriodNumber__cField")
        .getByLabel("Project period number")
        .fill(projectPeriodNumber.toString());

      // Click Save button
      await this.page
        .getByRole("button")
        .filter({ hasText: /^Save$/ })
        .click();
    }

    // Navigate to Claim
    //et claimId = responseProfile.records[0].Acc_ClaimDetail__r.Acc_ParentId__c;
    let claimId = responseClaim.records[0].Id;
    let pathClaim = String(`/lightning/r/Acc_Claims__c /${claimId}/view`);
    await this.sfdcPage.loginAndGoto(pathClaim);

    // Select Submitted to MO
    await this.page.waitForTimeout(10000);
    await this.page.getByRole("listbox").locator("li").filter({ hasText: "Submitted to Monitoring Officer" }).click();
    await this.page.locator("button").filter({ hasText: "Mark as Current Claim status" }).click();

    // Select Submitted to Innovate
    await this.page.waitForTimeout(10000);
    await this.page.getByRole("listbox").locator("li").filter({ hasText: "Submitted to Innovate UK" }).click();
    await this.page.locator("button").filter({ hasText: "Mark as Current Claim status" }).click();

    // Click Submit for Approval  button
    await this.page
      .getByRole("button")
      .filter({ hasText: /^Submit for Approval$/ })
      .click();

    // Click Submit
    await this.page
      .getByRole("button")
      .filter({ hasText: /^Submit$/ })
      .click();

    // Approve Claim if required

    // Get count of workItems for claim
    await this.page.waitForTimeout(10000); // Wait to see if the Claim needs approving

    let queryClaimApproval = `Select COUNT(id) FROM ProcessInstanceWorkitem WHERE ProcessInstance.TargetObject.Id ='${claimId}'`;

    console.log("Claim Query SOQL:  " + queryClaimApproval);
    const responseClaimApproval: QueryClaimApproval = await conn.executeSOQL({
      query: queryClaimApproval,
    });
    console.log(responseClaimApproval);
    const myJSONProjectClaimApproval = JSON.stringify(responseClaimApproval);
    console.log(myJSONProjectClaimApproval);

    let numberOfWorkItems = responseClaimApproval.records[0].expr0;
    console.log("Count id: ", numberOfWorkItems);

    // Approve Claims and Grant Adjustments
    for (let i = 1; i <= numberOfWorkItems; i++) {
      // Navigate to Approval History
      await this.page.getByLabel("Tabs").locator("li").filter({ hasText: "Approval History" }).click();

      // Click Approve button
      await this.page
        .getByRole("button")
        .filter({ hasText: /^Approve$/ })
        .click();

      await this.page.waitForTimeout(5000);

      // Click Approve button
      await this.page
        .getByRole("button")
        .filter({ hasText: /^Approve$/ })
        .click();
    }
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
