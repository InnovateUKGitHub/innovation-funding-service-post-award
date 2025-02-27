import { Acc_Project__c } from "@innovateuk/project-factory-two/sobjects/Acc_Project__c";
import { Competition__c } from "@innovateuk/project-factory-two/sobjects/Competition__c";
import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { Page } from "@playwright/test";
import { Fixture, Given } from "playwright-bdd/decorators";

export
@Fixture("steveTest")
class SteveTest {
  protected readonly page: Page;

  constructor({ page }: { page: Page }) {
    this.page = page;
  }

  @Given("there is a salesforce connection")
  async salesforceConnection() {
    console.log("Hello world!");
    /* Create Competition */
    const competition = new Competition__c();
    competition.Acc_CompetitionName__c = "Steve Playwright Comp";
    competition.Acc_CompetitionType__c = "CR&D";

    /* Create Project */
    let pNum = Math.random() * 100000;

    const project = new Acc_Project__c();
    project.Acc_ProjectNumber__c = pNum.toString();
    project.Acc_ProjectTitle__c = "Created by Steve in Playwright";
    project.Acc_StartDate__c = new Date();
    project.Acc_ProjectSource__c = "Manual";
    project.Acc_MonitoringLevel__c = "Platinum";
    project.Acc_MonitoringReportSchedule__c = "Monthly";
    project.Acc_CompetitionId__c = competition.Id;
  }
}
