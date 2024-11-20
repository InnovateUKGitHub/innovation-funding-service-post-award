import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class Acc_Project__c extends AbstractSObject {
  public readonly sobject = "Acc_Project__c";

  @SObjectField({ nullable: false })
  accessor Acc_StartDate__c: Date | undefined;

  @SObjectField({ nullable: false })
  accessor Acc_Duration__c: number | undefined;

  @SObjectField({ nullable: true })
  accessor Acc_ClaimFrequency__c: "Monthly" | "Quarterly" | undefined;

  @SObjectField({ nullable: false })
  accessor Acc_ProjectTitle__c: string | undefined;

  @SObjectField({ nullable: false })
  accessor Acc_ProjectNumber__c: string | undefined;

  @SObjectField({ nullable: true })
  accessor Acc_TSBProjectNumber__c: number | undefined;

  @SObjectField({ nullable: true })
  accessor Acc_LegacyID__c: string | undefined;

  @SObjectField({ nullable: true })
  accessor Acc_PublicDescription__c: string | undefined;

  @SObjectField({ nullable: true })
  accessor Acc_ProjectSummary__c: string | undefined;

  @SObjectField({ nullable: false })
  accessor Acc_WorkdayProjectSetupComplete__c: boolean | undefined;

  @SObjectField({ nullable: true })
  accessor Acc_NonFEC__c: boolean | undefined;

  @SObjectField({ nullable: true })
  accessor Acc_MonitoringLevel__c: "Platinum" | "Gold" | "Silver" | "Bronze" | "Internal Assurance" | undefined;

  @SObjectField({ nullable: true })
  accessor Acc_MonitoringReportSchedule__c:
    | "Monthly"
    | "Quarterly"
    | "6 Monthly"
    | "Yearly"
    | "Internal Assurance"
    | undefined;

  @SObjectField({ nullable: true })
  accessor Acc_ProjectStatus__c:
    | "Not set"
    | "PCL Creation Complete"
    | "Offer Letter Sent"
    | "Live"
    | "On Hold"
    | "Final Claim"
    | "Closed"
    | "Terminated"
    | undefined;

  @SObjectField({ nullable: true })
  accessor Acc_CurrentPeriodNumberHelper__c: number | undefined;

  @SObjectField({ nullable: true })
  accessor Acc_ProjectSource__c: "Manual" | "IFS" | "Grants" | undefined;

  @SObjectField({ nullable: false })
  accessor Acc_CompetitionId__c: string | undefined;
}

export { Acc_Project__c };
