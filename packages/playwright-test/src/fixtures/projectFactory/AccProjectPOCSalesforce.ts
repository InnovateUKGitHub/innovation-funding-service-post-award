import {
  TwoParticipantProjectFactoryScript,
  TwoParticipantProjectFactoryScriptArguments,
  TwoParticipantProjectFactoryScriptContext,
} from "@innovateuk/project-factory-two/scripts/TwoParticipantProjectFactoryScript";
import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";
//import { Acc_Project__c } from "@innovateuk/project-factory-two/sobjects/Acc_Project__c";
//import { Competition__c } from "@innovateuk/project-factory-two/sobjects/Competition__c";

export
@Fixture("accProjectPOCSalesforce")
class AccProjectPOCSalesforce extends ProjectFactory<
  TwoParticipantProjectFactoryScriptContext,
  TwoParticipantProjectFactoryScriptArguments
> {
  @Given("a POC Salesforce CR&D project exists")
  async crndMultiProject() {
    await this.createProject({ profiles: false, competitionType: "CR&D" });

    /* Create Competition */
    //const competition = new Competition__c();
    //competition.Acc_CompetitionName__c = "Steve Playwright Comp";
    //competition.Acc_CompetitionType__c = "CR&D";

    /* Create Project */
    //let pNum = Math.random() * 100000;

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
