import { ApiName } from "../enum/ApiName";
import { RecordType } from "../enum/RecordType";
import { CostCategoryLookup } from "./CostCategory.lookup";
import { RecordTypeLookup } from "./RecordType.lookup";
import { Lookup } from "./helper";

interface ProfileDetailData {
  RecordTypeId: Lookup<RecordTypeLookup<RecordType.Profile_Detail, ApiName.Profile>>;
  Acc_ProjectPeriodNumber__c: number;
  Acc_CostCategory__c: Lookup<CostCategoryLookup>;
  Acc_InitialForecastCost__c: number;
  Acc_LatestForecastCost__c: number;
}

interface ProfileTotalCostCategoryData {
  RecordTypeId: Lookup<RecordTypeLookup<RecordType.Total_Cost_Category, ApiName.Profile>>;
  Acc_CostCategory__c: Lookup<CostCategoryLookup>;
  Acc_CostCategoryGOLCost__c: number;
}

interface ProfileTotalProjectPeriodData {
  RecordTypeId: Lookup<RecordTypeLookup<RecordType.Total_Project_Period, ApiName.Profile>>;
  Acc_ProjectPeriodNumber__c: number;
  Acc_PeriodInitialForecastCost__c: number;
  Acc_PeriodLatestForecastCost__c: number;
}

type ProfileData = ProfileDetailData | ProfileTotalCostCategoryData | ProfileTotalProjectPeriodData;

export { ProfileData };
