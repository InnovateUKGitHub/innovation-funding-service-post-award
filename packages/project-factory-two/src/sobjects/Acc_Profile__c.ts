import { CostCategoryDescription } from "../types/CostCategoryDescription";
import { SObjectFieldType } from "../types/SObjectFieldType";
import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class Acc_Profile__c extends AbstractSObject {
  public readonly sobject = "Acc_Profile__c";

  @SObjectField({ nullable: false, readonly: false })
  accessor RecordTypeId: SObjectFieldType<string>;

  @SObjectField({ nullable: true, readonly: true })
  accessor Acc_CostCategoryDescription__c: SObjectFieldType<CostCategoryDescription>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_ClaimStatus__c: SObjectFieldType<
    | "Draft"
    | "Independent accountant's report required"
    | "New"
    | "Paid"
    | "Payment being processed"
    | "Queried by Innovate UK"
    | "Queried by Monitoring Officer"
    | "Submitted to Innovate UK"
    | "Submitted to Monitoring Officer"
  >;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_ClaimFrequency__c: SObjectFieldType<"Quarterly" | "Monthly">;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_CostCategoryGOLCost__c: SObjectFieldType<number>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_ProjectPeriodNumber__c: SObjectFieldType<number>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_InitialForecastCost__c: SObjectFieldType<number>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_LatestForecastCost__c: SObjectFieldType<number>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_PeriodForecastStatus__c: SObjectFieldType<"Past" | "Present" | "Future">;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_PeriodInitialForecastCost__c: SObjectFieldType<number>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_PeriodLatestForecastCost__c: SObjectFieldType<number>;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ProjectParticipant__c: SObjectFieldType<string>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_CostCategory__c: SObjectFieldType<string>;
}

export { Acc_Profile__c };
