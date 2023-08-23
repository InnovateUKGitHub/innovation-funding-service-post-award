import { CostCategoryType } from "@framework/constants/enums";
import { PCRSpendProfileCapitalUsageType, PCRSpendProfileOverheadRate } from "@framework/constants/pcrConstants";

export interface PcrSpendProfileEntityForCreate {
  capitalUsageType?: PCRSpendProfileCapitalUsageType;
  costCategory?: CostCategoryType;
  costCategoryId: CostCategoryId;
  costOfEach?: number;
  costPerItem?: number;
  dateOtherFundingSecured?: string;
  daysSpentOnProject?: number;
  depreciationPeriod?: number;
  description: string | null;
  grossCostOfRole?: number;
  netPresentValue?: number;
  numberOfTimes?: number;
  overheadRate?: PCRSpendProfileOverheadRate;
  pcrItemId: PcrItemId;
  quantity?: number;
  ratePerDay?: number;
  residualValue?: number;
  subcontractorCountry?: string;
  subcontractorRoleAndDescription?: string;
  typeLabel?: string;
  utilisation?: number;
  value: number | null;
}

export interface PcrSpendProfileEntity extends PcrSpendProfileEntityForCreate {
  id: PcrId;
}
