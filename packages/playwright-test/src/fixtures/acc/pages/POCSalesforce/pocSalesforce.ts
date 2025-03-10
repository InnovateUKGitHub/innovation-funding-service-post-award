import { Page } from "@playwright/test";
import path from "path";
import { Fixture, Given } from "playwright-bdd/decorators";
import { SfdcApi } from "../../../sfdc/SfdcApi";
const fs = require("fs");

export
@Fixture("pocSalesforce")
class PocSalesforce {
  protected readonly page: Page;
  protected readonly sfdcApi: SfdcApi;

  constructor({ page, sfdcApi }: { page: Page; sfdcApi: SfdcApi }) {
    this.page = page;
    this.sfdcApi = sfdcApi;
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

    let noOfApprovals = 12;
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
}
