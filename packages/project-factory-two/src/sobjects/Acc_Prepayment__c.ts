import { SObjectFieldThunkType } from "../types/SObjectFieldType";
import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

/**
 * Grant Adjustments
 */
class Acc_Prepayment__c extends AbstractSObject {
  public readonly sobject = "Acc_Prepayment__c";

  @SObjectField({ nullable: true, readonly: true })
  accessor Name: SObjectFieldThunkType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_Adjustment_Type__c: SObjectFieldThunkType<
    | "Advance on Grant"
    | "Prepayment"
    | "Recovery"
    | "Correction"
    | "Refund"
    | "Loan Drawdown"
    | "Manual Payment"
    | "Write-Off"
    | "Clawback"
  >;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_ApprovedDate__c: SObjectFieldThunkType<Date>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Loan_DrawdownStatus__c: SObjectFieldThunkType<"Planned" | "Requested" | "Approved">;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_GranttobePaid__c: SObjectFieldThunkType<number>;

  @SObjectField({ nullable: true, readonly: true })
  accessor Loan_InitialForecastDrawdown: SObjectFieldThunkType<number>;

  @SObjectField({ nullable: true, readonly: true })
  accessor Loan_LatestForecastDrawdown__c: SObjectFieldThunkType<number>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_PaidDate__c: SObjectFieldThunkType<Date>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_PeriodLengthChanged__c: SObjectFieldThunkType<boolean>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_PeriodNumber__c: SObjectFieldThunkType<number>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Loan_PlannedDateForDrawdown__c: SObjectFieldThunkType<number>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_PreviousPrepaymentStatus__c: SObjectFieldThunkType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ProjectParticipant__c: SObjectFieldThunkType<string>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_ReasonForPrepayment__c: SObjectFieldThunkType<string>;

  @SObjectField({ nullable: false, readonly: true })
  accessor Acc_Status__c: SObjectFieldThunkType<"New" | "Awaiting Approval" | "Approved" | "Paid">;

  @SObjectField({ nullable: true, readonly: false })
  accessor Loan_UserComments__c: SObjectFieldThunkType<string>;
}

export { Acc_Prepayment__c };
