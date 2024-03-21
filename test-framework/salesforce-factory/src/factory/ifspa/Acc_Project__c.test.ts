import { describe, expect, test } from "@jest/globals";
import { competitionBuilder } from "./Competition__c";
import { accProjectBuilder } from "./Acc_Project__c";
import { buildApex, formatApex } from "../../helpers/apex";

describe("Project Builder", () => {
  test("Expect project to be built, linking correctly to competition", () => {
    const competition = competitionBuilder
      .new()
      .setField("Acc_CompetitionCode__c", "100")
      .setField("Acc_CompetitionName__c", "Competition")
      .setField("Acc_CompetitionType__c", "KTP");

    const project = accProjectBuilder
      .new()
      .setRelationship("Acc_CompetitionId__c", competition)
      .setField("Acc_StartDate__c", new Date())
      .setField("Acc_Duration__c", 36)
      .setField("Acc_ClaimFrequency__c", "Quarterly")
      .setField("Acc_ProjectTitle__c", "Title")
      .setField("Acc_TSBProjectNumber__c", "100")
      .setField("Acc_WorkdayProjectSetupComplete__c", true)
      .setField("Acc_NonFEC__c", false)
      .setField("Acc_MonitoringLevel__c", "Platinum")
      .setField("Acc_MonitoringReportSchedule__c", "Monthly")
      .setField("Acc_ProjectStatus__c", "Live");

    const code = buildApex([project, competition]);
    expect(code).toMatchSnapshot();
  });
});
