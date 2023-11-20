import { ApiName } from "../enum/ApiName";
import { RecordType } from "../enum/RecordType";
import { CostCategoryLookup } from "./CostCategory.lookup";
import { RecordTypeLookup } from "./RecordType.lookup";
import { Lookup } from "./helper";

interface ClaimDetailData {
  RecordTypeId: Lookup<RecordTypeLookup<RecordType.Claims_Detail, ApiName.Claim>>;
  Acc_ProjectPeriodNumber__c: number;
  Acc_CostCategory__c: Lookup<CostCategoryLookup>;
}

interface ClaimLineItemData {
  RecordTypeId: Lookup<RecordTypeLookup<RecordType.Claims_Line_Item, ApiName.Claim>>;
  Acc_LineItemCost__c: number;
  Acc_LineItemDescription__c: string;
  Acc_ProjectPeriodNumber__c: number;
  Acc_CostCategory__c: Lookup<CostCategoryLookup>;
}

interface ClaimTotalCostCategoryData {
  RecordTypeId: Lookup<RecordTypeLookup<RecordType.Total_Cost_Category, ApiName.Claim>>;
  Acc_CostCategory__c: Lookup<CostCategoryLookup>;
  Acc_CostCategoryGOLCost__c: number;
}

interface ClaimTotalProjectPeriodData {
  RecordTypeId: Lookup<RecordTypeLookup<RecordType.Total_Project_Period, ApiName.Claim>>;
  Acc_ProjectPeriodNumber__c: number;
  Acc_ClaimStatus__c:
    | "New"
    | "Draft"
    | "Submitted"
    | "MO Queried"
    | "Awaiting IAR"
    | "Completion report required"
    | "Awaiting IUK Approval"
    | "Innovate Queried"
    | "Payment Requested"
    | "Approved"
    | "Paid"
    | "Not used";
}

type ClaimData = ClaimDetailData | ClaimLineItemData | ClaimTotalCostCategoryData | ClaimTotalProjectPeriodData;

export { ClaimData };
