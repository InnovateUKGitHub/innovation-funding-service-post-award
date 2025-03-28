import { expect, Page } from "@playwright/test";
import path from "path";
import { Fixture, Given, Then, When } from "playwright-bdd/decorators";
import { SfdcApi } from "../../../sfdc/SfdcApi";
import { SfdcLightningPage } from "../../../sfdc/SfdcLightningPage";
import { DataTable } from "playwright-bdd";
import { awaitResults } from "@innovateuk/project-factory-two/helpers/awaitResults";
// Type created to add Grant Adjustments
type GrantAdjustment = {
  totalSize: number;
  records: {
    adjustmentType: string;
    grantToBePaid: number;
    periodNumber: number;
  }[];
};
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
    await this.createCompetitionUI();
  }

  @Given("there is a Project created using the UI")
  async createProject() {
    const connProject = await this.sfdcApi.getTsforceConnection();
    await this.createProjectUI(connProject);
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
    const projectId = responseProject.records[0].Id;

    // Identify Users that can be used for Project Manager, Monitoring Officer and Finance Contact
    query = `SELECT id, contactId, accountId, contact.Name, account.Name AccountName, contact.email
    FROM USER 
    WHERE profile.name IN ('IUK Customer Community Plus Login User','Customer Community Plus User', 'Customer Community Plus Login User') and contactid!=null
    GROUP BY accountId,contactId,Id,contact.Name,account.Name,contact.email HAVING count(id)>=1 order by count(id)
    LIMIT 3`;

    const responseUsers: QueryUserDetails = await conn.executeSOQL({
      query,
    });
    const myJSONUsers = JSON.stringify(responseUsers);

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
    const myJSONParticipant = JSON.stringify(responseParticipant);

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
  }

  @Given("Profiles have been updated using Apex")
  async updateProfiles(table: DataTable) {
    const data = table.rowsHash();
    const conn = await this.sfdcApi.getTsforceConnection();
    await this.updateProfilesApex(conn, data);
  }

  @Given("claims have been added and Approved using the UI")
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

    // Grant Adjustment values
    let gaValue: GrantAdjustment = {
      totalSize: 2,
      records: [
        {
          adjustmentType: "Prepayment",
          grantToBePaid: 100000,
          periodNumber: 1,
        },
        {
          adjustmentType: "Prepayment",
          grantToBePaid: 9999,
          periodNumber: 1,
        },
      ],
    };

    const conn = await this.sfdcApi.getTsforceConnection();

    // Get Participant/Project Ids
    let query = `SELECT Id,  Acc_ProjectId__c FROM  Acc_ProjectParticipant__c WHERE Acc_ProjectId__r.Acc_CompetitionId__r.Name = '${this.uniqueCompId}'`;
    const responseProjectParticipant: QueryProjectParticipantId = await conn.executeSOQL({
      query,
    });
    const myJSONProjectParticipant = JSON.stringify(responseProjectParticipant);

    let participantId = responseProjectParticipant.records[0].Id;

    // Creates and Approves 3 Claims
    await this.createAndApproveClaimUsingUI(participantId, conn, 1, gaValue);
    await this.createAndApproveClaimUsingUI(participantId, conn, 2, gaValue);
    await this.createAndApproveClaimUsingUI(participantId, conn, 3, gaValue);
  }

  @Given("claims have been added and Approved by APEX")
  async addClaimsUsingAPEX() {
    type QueryProjectParticipantId = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: string; url: string };
        Id: string;
        Acc_ProjectId__c: string;
      }[];
    };

    const conn = await this.sfdcApi.getTsforceConnection();

    // Get Project Ids
    let query = `SELECT Id,  Acc_ProjectId__c FROM  Acc_ProjectParticipant__c WHERE Acc_ProjectId__r.Acc_CompetitionId__r.Name = '${this.uniqueCompId}'`;
    const responseProjectParticipant: QueryProjectParticipantId = await conn.executeSOQL({
      query,
    });
    const myJSONProjectParticipant = JSON.stringify(responseProjectParticipant);

    let participantId = responseProjectParticipant.records[0].Id;
    let projectId = responseProjectParticipant.records[0].Acc_ProjectId__c;

    // Creates and Approves 4 Claims
    await this.createAndApproveClaimUsingAPEX(participantId, conn, 4);
    await this.createAndApproveClaimUsingAPEX(participantId, conn, 5);
    await this.createAndApproveClaimUsingAPEX(participantId, conn, 6);
    await this.createAndApproveClaimUsingAPEX(participantId, conn, 7);

    await this.page.waitForTimeout(50000);
  }

  @Then("approval details checked using the External UI")
  async checkApprovalDetailsExternalUI() {
    type QueryProjectParticipantId = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: string; url: string };
        Id: string;
        Acc_ProjectId__c: string;
      }[];
    };

    const conn = await this.sfdcApi.getTsforceConnection();

    // Get Project Ids
    let query = `SELECT Id,  Acc_ProjectId__c FROM  Acc_ProjectParticipant__c WHERE Acc_ProjectId__r.Acc_CompetitionId__r.Name = '${this.uniqueCompId}'`;
    const responseProjectParticipant: QueryProjectParticipantId = await conn.executeSOQL({
      query,
    });
    const myJSONProjectParticipant = JSON.stringify(responseProjectParticipant);

    let participantId = responseProjectParticipant.records[0].Id;
    let projectId = responseProjectParticipant.records[0].Acc_ProjectId__c;

    await this.page.goto(`https://www-acc-capconfig.apps.ocp4.innovateuk.ukri.org/projects/${projectId}/overview`);

    // Check Total Eligible Costs present with expected value
    await expect(
      this.page
        .getByTestId("project-summary-gol-costs")
        .getByRole("paragraph")
        .filter({ hasText: "Total eligible costs" }),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("project-summary-gol-costs").getByRole("paragraph").filter({ hasText: "£2,654,395.00" }),
    ).toBeVisible();

    // Check Eligible costs claimed to date present with expected value
    await expect(
      this.page
        .getByTestId("project-summary-claimed-costs")
        .getByRole("paragraph")
        .filter({ hasText: "Eligible costs claimed to date" }),
    ).toBeVisible();
    await expect(
      this.page
        .getByTestId("project-summary-claimed-costs")
        .getByRole("paragraph")
        .filter({ hasText: "£1,338,795.00" }),
    ).toBeVisible();
  }

  // Deletes the Project after the test has been ran
  @When("the Project has been deleted")
  async deleteProject() {
    type QueryProjectId = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: string; url: string };
        Id: string;
      }[];
    };

    const conn = await this.sfdcApi.getTsforceConnection();

    // Project Ids
    let query = `SELECT id FROM  Acc_Project__c WHERE Acc_CompetitionId__r.Name = '${this.uniqueCompId}'`;
    const responseProjectId: QueryProjectId = await conn.executeSOQL({
      query,
    });
    const myJSONProjectParticipant = JSON.stringify(responseProjectId);

    let projectId = responseProjectId.records[0].Id;

    // Delete Project
    let deleteProject = fs
      .readFileSync(path.join(__dirname, "../../../../../apex/deleteProjectsById.apex"), {
        encoding: "utf-8",
      })
      .replaceAll("{ProjectIdList}", projectId);

    console.log(deleteProject);

    const apexresponseDeleteProject = await conn.executeApex({
      query: deleteProject,
    });
  }

  // Functions
  // *************************************************************************************************************

  async updateProfilesApex(conn, data) {
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
    const myJSONProjectParticipant = JSON.stringify(responseProjectParticipant);

    let participantId = responseProjectParticipant.records[0].Id;
    let projectId = responseProjectParticipant.records[0].Acc_ProjectId__c;

    // Update Profiles
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

    const apexresponseProfiles = await conn.executeApex({
      query: updateProfiles,
    });
  }

  async createProjectUI(conn) {
    // Definition for SOQL results
    type QueryCompetitionId = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: string; url: string };
        Id: string;
      }[];
    };

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

  async createCompetitionUI() {
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

  getByFieldID(label: string) {
    return this.page.locator(`[data-field-id="${label}"]`);
  }

  async selectDropdown(label: string, option: string) {
    await this.page.getByRole("combobox", { name: label }).click();
    await this.page.locator("lightning-base-combobox-item").filter({ hasText: option }).click();
  }

  // Adds Participant
  async addParticipant(externalUserVal: string, externalUserAccountVal: string, projectRoleVal: string) {
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
  async createAndApproveClaimUsingUI(participantId: string, conn, periodNo: number, gaValue: GrantAdjustment) {
    let path = String(`/lightning/r/Acc_ProjectParticipant__c/${participantId}/view`);
    await this.sfdcPage.loginAndGoto(path);

    await this.createAndApproveGAUsingUI(participantId, conn, periodNo, gaValue);
    await this.createClaimLineItemsUI(participantId, periodNo, conn);
    await this.page.waitForTimeout(10000); // Remove me
    await this.submitAndApproveClaimUI(participantId, periodNo, conn);
  }

  async submitAndApproveClaimUI(participantId: string, periodNo: number, conn) {
    type QueryClaimId = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: string; url: string };
        Id: string;
      }[];
    };

    type QueryClaimApproval = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: string; url: string };
        expr0: number;
      }[];
    };

    // Get Claim Id
    let queryClaim = `SELECT Id
      FROM Acc_Claims__c
      WHERE Acc_ProjectParticipant__c ='${participantId}'
      AND recordType.Name = 'Total Project Period'
      AND	Acc_ProjectPeriodNumber__c = ${periodNo}`;

    const responseClaim: QueryClaimId = await conn.executeSOQL({
      query: queryClaim,
    });

    const myJSONProjectClaim = JSON.stringify(responseClaim);

    // Navigate to Claim
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

    const responseClaimApproval: QueryClaimApproval = await conn.executeSOQL({
      query: queryClaimApproval,
    });
    //console.log(responseClaimApproval);
    const myJSONProjectClaimApproval = JSON.stringify(responseClaimApproval);

    let numberOfWorkItems = responseClaimApproval.records[0].expr0;

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

  async createClaimLineItemsUI(participantId: string, periodNo: number, conn) {
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

    // Navgate to Participant
    let pathClaimLineItem = String(`/lightning/r/Acc_ProjectParticipant__c/${participantId}/view`);
    await this.sfdcPage.loginAndGoto(pathClaimLineItem);
    // Select Claims tab
    await this.page.getByLabel("Tabs").locator("li").filter({ hasText: "Claims" }).click();

    // Get Profile values to add to Claim
    let queryProfile = `SELECT Acc_ProjectPeriodNumber__c,Acc_CostCategory__r.name, Acc_LatestForecastCost__c
    FROM Acc_Profile__c
    WHERE Acc_ProjectParticipant__r.Id ='${participantId}'
    AND RecordType.Name = 'Profile Detail'
    AND Acc_ProjectPeriodNumber__c = ${periodNo}
    AND Acc_LatestForecastCost__c  > 0`;

    const responseProfile: QueryProjectProfile = await conn.executeSOQL({
      query: queryProfile,
    });
    const myJSONProjectProfile = JSON.stringify(responseProfile);

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
  }

  // Create and Approve Grant Adjustments
  async createAndApproveGAUsingUI(participantId: string, conn, periodNoGA: number, gaValue: GrantAdjustment) {
    type QueryPrepayment = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: string; url: string };
        Id: string;
      }[];
    };

    // Add one or more Grant Adjustments
    for (const element of gaValue.records) {
      if (periodNoGA == element.periodNumber) {
        console.log("Original PeriodNo: ", periodNoGA);
        console.log("Period No: ", element.periodNumber);
        console.log("Adjustment Type: ", element.adjustmentType);
        console.log("Grant to be paid: ", element.grantToBePaid);

        // Navigate to Participant
        let pathGA = String(`/lightning/r/Acc_ProjectParticipant__c/${participantId}/view`);

        //await this.sfdcPage.loginAndGoto(pathGA);
        await this.page.getByLabel("Tabs").locator("li").filter({ hasText: "Grant Adjustments" }).click();

        // Click New button
        await this.page.getByRole("button").filter({ hasText: /^New$/ }).click();

        await this.page.waitForTimeout(5000);

        // Adjustment Type
        await this.selectDropdown("Adjustment Type", element.adjustmentType);

        // Grant to be paid
        await this.getByFieldID("RecordAcc_GranttobePaid__cField")
          .getByLabel("Grant to be Paid")
          .fill(element.grantToBePaid.toString());

        // Period number
        await this.getByFieldID("RecordAcc_PeriodNumber__cField")
          .getByLabel("Period Number")
          .fill(element.periodNumber.toString());

        // Save button
        await this.page
          .getByRole("button")
          .filter({ hasText: /^Save$/ })
          .click();

        await this.page.waitForTimeout(10000); // Remove me
      }
    }

    // Approve Grant Adjustments

    // Get GA Ids
    let queryPrepayment = `SELECT Id
      FROM Acc_Prepayment__c
      WHERE Acc_ProjectParticipant__c ='${participantId}'
      AND Acc_ProjectPeriodNumber__c = ${periodNoGA}`;

    console.log("Prepayment Query SOQL:  " + queryPrepayment);
    const responsePrepayment: QueryPrepayment = await conn.executeSOQL({
      query: queryPrepayment,
    });
    const myJSONPrepayment = JSON.stringify(responsePrepayment);

    // Loop through each GA for specified period then Approve
    for (const gaVal of responsePrepayment.records) {
      // Navigate to Grant Adjustment
      let path = String(`/lightning/r/Acc_Prepayment__c /${gaVal.Id}/view`);
      await this.sfdcPage.loginAndGoto(path);

      // Submit for Approval button
      await this.page
        .getByRole("button")
        .filter({ hasText: /^Submit for Approval$/ })
        .click();

      // Submit
      await this.page
        .getByRole("button")
        .filter({ hasText: /^Submit$/ })
        .click();

      // Select Approval History tab
      await this.page.getByLabel("Tabs").locator("li").filter({ hasText: "Approval History" }).click();

      // Approve button
      await this.page
        .getByRole("button")
        .filter({ hasText: /^Approve$/ })
        .click();

      await this.page.waitForTimeout(10000);

      // Approve button
      await this.page
        .getByRole("button")
        .filter({ hasText: /^Approve$/ })
        .click();
    }
  }

  // Create and Approve Claim using APEX
  async createAndApproveClaimUsingAPEX(participantId: string, conn, periodNo: number) {
    let createClaimsFromProfiles = fs
      .readFileSync(path.join(__dirname, "../../../../../apex/createClaimFromProfile.apex"), { encoding: "utf-8" })
      .replaceAll("{ParticipantId}", participantId)
      .replaceAll("{LoopCounterClaims}", periodNo);

    console.log(createClaimsFromProfiles);

    const apexresponseCreateClaims = await conn.executeApex({
      query: createClaimsFromProfiles,
    });

    // Submit to Innovateuk
    let submitToInnovate = fs
      .readFileSync(path.join(__dirname, "../../../../../apex/submittoInnovate.apex"), { encoding: "utf-8" })
      .replaceAll("{ParticipantId}", participantId)
      .replaceAll("{LoopCounterClaims}", periodNo);

    const apexresponseSubmitToInnovate = await conn.executeApex({
      query: submitToInnovate,
    });

    // Simulate clicking Submit for Approval button using Apex
    let clickSubmitForApprovalButton = fs
      .readFileSync(path.join(__dirname, "../../../../../apex/simulateClickingSubmitForApprovalButton.apex"), {
        encoding: "utf-8",
      })
      .replaceAll("{ParticipantId}", participantId)
      .replaceAll("{LoopCounterClaims}", periodNo);

    const apexresponseClickSubmitForApprovalButton = await conn.executeApex({
      query: clickSubmitForApprovalButton,
    });

    // Approve a Claim
    let approveClaim = fs
      .readFileSync(path.join(__dirname, "../../../../../apex/approveClaim.apex"), {
        encoding: "utf-8",
      })
      .replaceAll("{ParticipantId}", participantId)
      .replaceAll("{LoopCounterClaims}", periodNo);

    const apexresponseApproveClaim = await conn.executeApex({
      query: approveClaim,
    });
  }

  // Adds PCL
  async addPCL(
    externalUserVal: string,
    externalUserAccountVal: string,
    projectRoleVal: string,
    externalUserEmailVal: string,
  ) {
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
