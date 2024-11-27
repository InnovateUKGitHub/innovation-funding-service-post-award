import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class Acc_Profile__c extends AbstractSObject {
  public readonly sobject = "Acc_Profile__c";

  @SObjectField({ nullable: false, readonly: false })
  accessor RecordTypeId: string | undefined;

  @SObjectField({ nullable: true, readonly: true })
  accessor Acc_CostCategoryDescription__c:
    | "Academic and secretarial support"
    | "Additional associate support"
    | "Advance on Grant"
    | "Associate development"
    | "Associate Employment"
    | "Capital Equipment"
    | "Capital purchase (inf)"
    | "Capital purchase (other)"
    | "Capital usage"
    | "Capitalised Labour"
    | "Capitalised labour (inf)"
    | "Capitalised labour (other)"
    | "Consumables"
    | "Directly allocated - estates"
    | "Directly allocated - Estates costs"
    | "Directly allocated - Investigations"
    | "Directly allocated - investigators"
    | "Directly allocated - other"
    | "Directly allocated - Other costs"
    | "Directly incurred - Equipment"
    | "Directly incurred - Other costs"
    | "Directly incurred - Staff"
    | "Directly incurred - Travel and subsistence"
    | "Equipment"
    | "Estate"
    | "Exceptions - Equipment"
    | "Exceptions - Other costs"
    | "Exceptions - Staff"
    | "Exceptions - Travel and subsistence"
    | "Indirect costs"
    | "Indirect costs - Investigations"
    | "Knowledge base supervisor"
    | "Labour"
    | "Loans costs for Academic participants"
    | "Loans costs for Industrial participants"
    | "Materials"
    | "Other capital costs (inf)"
    | "Other capital costs (other)"
    | "Other costs"
    | "Other Costs - Resource"
    | "Other costs 2"
    | "Other costs 3"
    | "Other costs 4"
    | "Other costs 5"
    | "Other costs- Capital"
    | "Other goods, works and services"
    | "Other public sector funding"
    | "Overheads"
    | "Personnel costs"
    | "Property Capital"
    | "Property capital costs (inf)"
    | "Property capital costs (other)"
    | "Property Revenue"
    | "R & D capital usage"
    | "R & D labour"
    | "R & D materials"
    | "R & D other costs"
    | "R & D overheads"
    | "R & D subcontracting"
    | "R & D travel and subsistence"
    | "Subcontracting"
    | "Travel and subsistence"
    | "VAT"
    | undefined;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_ClaimStatus__c:
    | "Draft"
    | "Independent accountant's report required"
    | "New"
    | "Paid"
    | "Payment being processed"
    | "Queried by Innovate UK"
    | "Queried by Monitoring Officer"
    | "Submitted to Innovate UK"
    | "Submitted to Monitoring Officer"
    | undefined;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_ClaimFrequency__c: "Quarterly" | "Monthly" | undefined;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_CostCategoryGOLCost__c: number | undefined;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_ProjectPeriodNumber__c: number | undefined;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_InitialForecastCost__c: number | undefined;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_LatestForecastCost__c: number | undefined;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_PeriodForecastStatus__c: "Past" | "Present" | "Future" | undefined;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_PeriodInitialForecastCost__c: number | undefined;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_PeriodLatestForecastCost__c: number | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ProjectParticipant__c: string | undefined;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_CostCategory__c: string | undefined;
}

export { Acc_Profile__c };
