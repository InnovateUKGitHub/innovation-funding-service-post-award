import { expect, Page } from "@playwright/test";
import path from "path";
import { Fixture, Given, When } from "playwright-bdd/decorators";
import { SfdcApi } from "../../../sfdc/SfdcApi";
import { SfdcLightningPage } from "../../../sfdc/SfdcLightningPage";
const fs = require("fs");

export
@Fixture("pocSalesforce")
class PocSalesforce {
  protected readonly page: Page;
  protected readonly sfdcApi: SfdcApi;
  protected readonly sfdcPage: SfdcLightningPage;

  private readonly partialTabHeadings: Array<string>;
  private readonly tabHeadings: Array<string>;

  constructor({ page, sfdcApi, sfdcPage }: { page: Page; sfdcApi: SfdcApi; sfdcPage: SfdcLightningPage }) {
    this.page = page;
    this.sfdcApi = sfdcApi;
    this.sfdcPage = sfdcPage;
    this.partialTabHeadings = ["Details", "Participants", "Contacts", "Monitoring Reports", "PCRs", "Topics"];
    this.tabHeadings = [
      "Details",
      "Participants",
      "Contacts",
      "Monitoring Reports",
      "PCRs",
      "Topics",
      "Activity",
      "Chatter",
    ];
  }

  @Given("there is a CRnD Project with twelve Approved Claims")
  async createCRndProject() {
    // Definition for SOQL results
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

    // Create a Project
    console.log("Create a Project");
    const apexresponse = await conn.executeApex({
      query: fs.readFileSync(path.join(__dirname, "../../../../../apex/createCRnDProject.apex"), { encoding: "utf-8" }),
    });

    // Get the Project Id
    const response: QueryProjectId = await conn.executeSOQL({
      query: "SELECT Id FROM Acc_Project__c ORDER BY createdDate desc LIMIT 1",
    });

    const myJSON = JSON.stringify(response);
    console.log(myJSON);
    const projectId = response.records[0].Id;

    // Get the Participant Ids
    const responsePart: QueryProjectId = await conn.executeSOQL({
      query: `SELECT Id FROM Acc_ProjectParticipant__c WHERE Acc_ProjectId__c = '${projectId}'`,
    });

    await this.page.waitForTimeout(50000); // THIS WILL BE DONE USING A WAIT STATEMENT, WAIT FOR PROFILES TO BE CREATED

    const myJSONPart = JSON.stringify(responsePart);
    console.log(myJSONPart);
    const participantId = responsePart.records[0].Id;

    // Update Participants (AwardRate and CapLimit)
    console.log("Update Participant AwardRate and CapLimit");
    let updateCurrentParticipant = fs
      .readFileSync(path.join(__dirname, "../../../../../apex/updateParticipant.apex"), { encoding: "utf-8" })
      .replaceAll("{ProjectId}", projectId)
      .replaceAll("{AwardRate}", 100)
      .replaceAll("{CapLimit}", 100);
    console.log(updateCurrentParticipant);

    const apexresponseCurrentParticipant = await conn.executeApex({
      query: updateCurrentParticipant,
    });

    console.log("Apex response: ", apexresponseCurrentParticipant);

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

    await this.page.waitForTimeout(50000); // THIS WILL BE DONE USING A WAIT STATEMENT, WAIT FOR PROFILES TO BE CREATED

    // Update Profiles
    console.log("Update Profiles");
    let updateProfiles = fs
      .readFileSync(path.join(__dirname, "../../../../../apex/updateProfiles.apex"), { encoding: "utf-8" })
      .replaceAll("{AccProjectId}", projectId)
      .replaceAll("{Acc_ParticipantId}", participantId)
      .replaceAll("{CompetitionType}", "CR&D")
      .replaceAll("{OrganisationType}", "Industrial")
      .replaceAll("{CostCategoriesData}", "'Subcontracting','Labour','Materials','Travel and subsistence'")
      .replaceAll(
        "{CostCategoryArray}",
        "'Labour','Subcontracting','Labour','Labour','Materials','Materials','Materials','Materials','Materials','Materials','Materials','Materials','Materials','Materials','Materials','Materials'",
      )
      .replaceAll("{PeriodNumberArray}", "'2','2','8','11','1','2','3','4','5','6','7','8','9','10','11','12'")
      .replaceAll(
        "{ValueArray}",
        "'101000','110000','100600','105000','103995','135000','100100','100200','150000','150000','510000','150000','150000','150000','510000','150000'",
      );

    console.log(updateProfiles);

    const apexresponseProfiles = await conn.executeApex({
      query: updateProfiles,
    });

    console.log("Apex response: ", apexresponseProfiles);

    // Create Claims based on Profiles, add GrandAdjustments and Overrides, Approve Claims
    // ************************************************************************************

    let noOfApprovals = 1;
    let loopCounterClaims = 1;
    for (loopCounterClaims = 1; loopCounterClaims <= noOfApprovals; loopCounterClaims++) {
      // Create GrandAdjustments (TO DO)
      // Create Overrides (TO DO)

      // Create Claims, (Independent Accountants Report and Review Team overrides)
      console.log("Create Claims");

      // Create Claims
      let createClaimsFromProfiles = fs
        .readFileSync(path.join(__dirname, "../../../../../apex/createClaimFromProfile.apex"), { encoding: "utf-8" })
        .replaceAll("{ParticipantId}", participantId)
        .replaceAll("{LoopCounterClaims}", loopCounterClaims);

      console.log(createClaimsFromProfiles);

      const apexresponseCreateClaims = await conn.executeApex({
        query: createClaimsFromProfiles,
      });

      console.log("Apex response: ", apexresponseCreateClaims);

      // Set IAR and override ReviewTeams
      let setIARAndOverrideReviewTeam = fs
        .readFileSync(path.join(__dirname, "../../../../../apex/setIARAndOverrideReviewTeam.apex"), {
          encoding: "utf-8",
        })
        .replaceAll("{ParticipantId}", participantId)
        .replaceAll("{IARStatusCounter}", "'5','6','7'") // If Independent Accountants Report is required for this period
        .replaceAll("{ReviewTeamSetCounter}", "'1','2'") // If the Review Team has been overridden for this period
        .replaceAll("{LoopCounterClaims}", loopCounterClaims);

      console.log(setIARAndOverrideReviewTeam);

      const apexresponseSetAIR = await conn.executeApex({
        query: setIARAndOverrideReviewTeam,
      });

      console.log("Apex response: ", apexresponseSetAIR);

      // Submit to Innovateuk
      let submitToInnovate = fs
        .readFileSync(path.join(__dirname, "../../../../../apex/submittoInnovate.apex"), { encoding: "utf-8" })
        .replaceAll("{ParticipantId}", participantId)
        .replaceAll("{LoopCounterClaims}", loopCounterClaims);

      console.log(submitToInnovate);

      const apexresponseSubmitToInnovate = await conn.executeApex({
        query: submitToInnovate,
      });

      console.log("Apex response: ", apexresponseSubmitToInnovate);

      // Simulate clicking Submit for Approval button using Apex
      let clickSubmitForApprovalButton = fs
        .readFileSync(path.join(__dirname, "../../../../../apex/simulateClickingSubmitForApprovalButton.apex"), {
          encoding: "utf-8",
        })
        .replaceAll("{ParticipantId}", participantId)
        .replaceAll("{LoopCounterClaims}", loopCounterClaims);

      console.log(clickSubmitForApprovalButton);

      const apexresponseClickSubmitForApprovalButton = await conn.executeApex({
        query: clickSubmitForApprovalButton,
      });

      console.log("Apex response: ", apexresponseClickSubmitForApprovalButton);

      // Approve a Claim
      let approveClaim = fs
        .readFileSync(path.join(__dirname, "../../../../../apex/approveClaim.apex"), {
          encoding: "utf-8",
        })
        .replaceAll("{ParticipantId}", participantId)
        .replaceAll("{LoopCounterClaims}", loopCounterClaims);

      console.log(approveClaim);

      const apexresponseApproveClaim = await conn.executeApex({
        query: approveClaim,
      });

      console.log("Apex response: ", apexresponseApproveClaim);
    }
  }

  @When("the user accesses the project in Salesforce")
  async accessProject() {
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
      query: "SELECT Id FROM Acc_Project__c ORDER BY createdDate desc LIMIT 1",
    });

    const myJSON = JSON.stringify(response);
    console.log(myJSON);
    const projectId = response.records[0].Id;
    let path = String(`/lightning/r/Acc_Project__c/${projectId}/view`);
    await this.sfdcPage.loginAndGoto(path);
    await this.checkTabsRow();
    await this.checkDetailsTab();
    await this.openClaim();
  }

  /**
   * Tool to locate elements using a SF-specific id.
   */
  getByFieldID(label: string) {
    return this.page.locator(`[data-field-id="${label}"]`);
  }

  /**
   *
   * Returns xpath on the claims details tab using two items identifiers ('data-field-id' and the item container 'dd,dt,div' etc)
   */
  getByFieldIdXpath(fieldId: string, element: string, text: string) {
    return this.page.locator(
      `//flexipage-field[@data-field-id="${fieldId}"]//slot//record_flexipage-record-field//div//div//${element}//div//span[text()="${text}"]`,
    );
  }

  async checkTabsRow() {
    if (this.page.getByLabel("Tabs").locator("li").filter({ hasText: "More" }).isVisible()) {
      for (const tab of this.partialTabHeadings) {
        await expect(this.page.getByLabel("Tabs").locator("li").filter({ hasText: tab })).toBeVisible();
      }
      await this.page.getByLabel("Tabs").locator("li").filter({ hasText: "More" }).click();
      await expect(this.page.getByLabel("Tabs").locator("li").filter({ hasText: "Activity" })).toBeVisible();
      await expect(this.page.getByLabel("Tabs").locator("li").filter({ hasText: "Chatter" })).toBeVisible();
    } else {
      let i = 0;
      for (const tab of this.tabHeadings) {
        await expect(this.page.getByLabel("Tabs").locator("li").nth(i).filter({ hasText: tab })).toBeVisible();
        i++;
      }
    }
  }

  /**
   * Included two different ways of asserting for the same thing (choices can be nice)
   */
  async checkDetailsTab() {
    await expect(this.getByFieldID("RecordNameField").filter({ hasText: "Project ID" })).toBeVisible();
    await expect(
      this.getByFieldID("RecordAcc_ProjectTitle__cField").filter({ hasText: "Project Title" }),
    ).toBeVisible();
    await expect(
      this.getByFieldID("RecordAcc_ProjectNumber__cField").filter({ hasText: "Project Number" }),
    ).toBeVisible();
    await expect(this.getByFieldID("RecordAcc_CompetitionId__cField").filter({ hasText: "Competition" })).toBeVisible();
    const itemsOnTab = ["Project ID", "Project Title", "Project Number", "Competition"];
    for (const item of itemsOnTab) {
      await expect(
        this.page.getByRole("tabpanel").getByRole("listitem").filter({ hasText: item }).first(),
      ).toBeVisible();
    }
  }

  async openClaim() {
    await this.page.getByLabel("Tabs").locator("li").filter({ hasText: "Participants" }).click();
    await this.page
      .getByRole("tabpanel")
      .locator("table")
      .locator("tbody")
      .locator("th")
      .nth(0)
      .getByRole("link")
      .click();
    await this.page.getByLabel("Tabs").locator("li").filter({ hasText: "Claims" }).click();

    const paymentRow = this.page
      .getByRole("tabpanel")
      .locator("table")
      .locator("tbody")
      .locator("tr")
      .filter({ hasText: "Payment being processed" });

    await expect(paymentRow.locator("td").nth(2).filter({ hasText: "1" })).toBeVisible();
    const draftCell = this.page.locator("td").nth(2).filter({ hasText: "2" });
    const draftRow = this.page
      .getByRole("tabpanel")
      .locator("table")
      .locator("tbody")
      .locator("tr")
      .filter({ has: draftCell });

    await draftRow.locator("th").nth(1).getByRole("link").click();

    await expect(
      this.page.getByRole("presentation").getByRole("listitem").filter({ hasText: "Project period number" }),
    ).toContainText("2");

    //The below is currently failing to find the xpath in Playwright although it does seem to work fine when we search for it in-browser.
    await expect(
      this.page.locator(
        `//span/ancestor::div[@class="section-layout-container slds-section slds-is-open"]//flexipage-column2//div/dt//span[text()="Claim Age"]/ancestor::div/dt`,
      ),
    ).toBeVisible();

    await expect(
      this.page.locator(
        `//span/ancestor::div[@class="section-layout-container slds-section slds-is-open"]//flexipage-column2//div/dt//span[text()="Claim status"]/ancestor::div/dt`,
      ),
    ).toBeVisible();

    await expect(
      this.page.locator(
        `//span/ancestor::div[@class="section-layout-container slds-section slds-is-open"]//flexipage-column2//div/dd//span[text()="New"]/ancestor::div/dd`,
      ),
    ).toBeVisible();

    //Below you can see a new function I've created that simply injects criteria into a different xpath above (also failing - line 264
    //Again - these xpaths do work in-browser.
    await expect(this.getByFieldIdXpath("dt", "RecordAcc_ClaimStatus__cField", "Claim status")).toBeVisible();
    await expect(this.getByFieldIdXpath("dd", "RecordAcc_ClaimStatus__cField", "New")).toBeVisible();
    await expect(this.getByFieldIdXpath("dt", "RecordAcc_Date_Submitted__cField", "Claim age")).toBeVisible();
    await expect(this.getByFieldIdXpath("dd", "RecordAcc_Date_Submitted__cField", "0")).toBeVisible();

    //This works
    await this.page.getByRole("listbox").getByRole("presentation").getByTitle("Draft").click();
    await this.page.getByRole("button").filter({ hasText: "Mark as Current Claim status" }).click();
    await this.page.waitForTimeout(3000);
    await expect(this.page.getByRole("listbox").getByRole("presentation").getByTitle("Draft")).toHaveAttribute(
      "aria-selected",
      "true",
    );

    //This fails
    await expect(this.getByFieldIdXpath("dd", "RecordAcc_ClaimStatus__cField", "Draft")).toBeVisible();
  }
}
