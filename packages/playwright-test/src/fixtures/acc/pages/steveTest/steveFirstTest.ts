import { Page } from "@playwright/test";
import path from "path";
import { Fixture, Given } from "playwright-bdd/decorators";
import { SfdcApi } from "../../../sfdc/SfdcApi";
const fs = require("fs");

export
@Fixture("steveTest")
class SteveTest {
  protected readonly page: Page;
  protected readonly sfdcApi: SfdcApi;

  constructor({ page, sfdcApi }: { page: Page; sfdcApi: SfdcApi }) {
    this.page = page;
    this.sfdcApi = sfdcApi;
  }

  @Given("there is a salesforce connection")
  async salesforceConnection() {
    type QueryResponse = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: string; url: string };
        Id: string;
        CreatedById: string;
        CreatedDate: string;
        Acc_ClaimFrequency__c: string;
        Acc_CurrentPeriodNumber__c: number;
      }[];
    };

    const conn = await this.sfdcApi.getTsforceConnection();

    await conn.executeApex({ query: "System.debug('Steven Killen says hi!');" });
    const apexresponse = await conn.executeApex({
      query: fs.readFileSync(path.join(__dirname, "../../../../../apex/createCRnDProject.apex"), { encoding: "utf-8" }),
    });

    // Get the Project Id
    const response: QueryResponse = await conn.executeSOQL({
      query:
        "SELECT Id,CreatedById,CreatedDate,Acc_ClaimFrequency__c,Acc_CurrentPeriodNumber__c FROM Acc_Project__c ORDER BY createdDate desc LIMIT 1",
    });
    //console.log(projectId);

    const myJSON = JSON.stringify(response);
    //console.log(myJSON);
    const projectId = response.records[0].Id;
    //console.log(projectId);

    console.log(apexresponse);

    const x = {
      totalSize: 1,
      done: true,
      records: [
        {
          attributes: {
            type: "Acc_Project__c",
            url: "/services/data/v60.0/sobjects/Acc_Project__c/a0EPt000003dgQfMAI",
          },
          Id: "a0EPt000003dgQfMAI",
          CreatedById: "0054I000004ujXCQAY",
          CreatedDate: "2025-02-26T16:24:11.000+0000",
          Acc_ClaimFrequency__c: "Monthly",
          Acc_CurrentPeriodNumber__c: null,
        },
      ],
    };

    ///* Create Competition */
    //const competition = new Competition__c();
    //competition.Acc_CompetitionName__c = "Steve Playwright Comp";
    //competition.Acc_CompetitionType__c = "CR&D";
    //
    ///* Create Project */
    //let pNum = Math.random() * 100000;
    //
    //const project = new Acc_Project__c();
    //project.Acc_ProjectNumber__c = pNum.toString();
    //project.Acc_ProjectTitle__c = "Created by Steve in Playwright";
    //project.Acc_StartDate__c = new Date();
    //project.Acc_ProjectSource__c = "Manual";
    //project.Acc_MonitoringLevel__c = "Platinum";
    //project.Acc_MonitoringReportSchedule__c = "Monthly";
    //project.Acc_CompetitionId__c = competition.Id;
  }
}
