import { SObjectFieldType } from "../types/SObjectFieldType";
import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class Acc_Project__c extends AbstractSObject {
  public readonly sobject = "Acc_Project__c";

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_StartDate__c: SObjectFieldType<Date>;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_Duration__c: SObjectFieldType<number>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_ClaimFrequency__c: SObjectFieldType<"Monthly" | "Quarterly">;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ProjectTitle__c: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ProjectNumber__c: SObjectFieldType<string>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_TSBProjectNumber__c: SObjectFieldType<number>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_LegacyID__c: SObjectFieldType<string>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_PublicDescription__c: SObjectFieldType<string>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_ProjectSummary__c: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_WorkdayProjectSetupComplete__c: SObjectFieldType<boolean>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_NonFEC__c: SObjectFieldType<boolean>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_MonitoringLevel__c: SObjectFieldType<"Platinum" | "Gold" | "Silver" | "Bronze" | "Internal Assurance">;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_MonitoringReportSchedule__c:
    | "Monthly"
    | "Quarterly"
    | "6 Monthly"
    | "Yearly"
    | "Internal Assurance"
    | undefined;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_ProjectStatus__c: SObjectFieldType<
    | "Not set"
    | "PCL Creation Complete"
    | "Offer Letter Sent"
    | "Live"
    | "On Hold"
    | "Final Claim"
    | "Closed"
    | "Terminated"
  >;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_CurrentPeriodNumberHelper__c: SObjectFieldType<number>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_ProjectSource__c: SObjectFieldType<"Manual" | "IFS" | "Grants">;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_CompetitionId__c: SObjectFieldType<string>;
}

export { Acc_Project__c };
