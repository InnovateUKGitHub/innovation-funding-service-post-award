import { PCRSpendProfileCapitalUsageType } from "@framework/constants";

export interface PcrSpendProfileEntityForCreate {
  pcrItemId: string;
  costCategoryId: string;
  value: number | null;
  description: string | null;

  // labour
  grossCostOfRole?: number;
  ratePerDay?: number;
  daysSpentOnProject?: number;

  // materials
  costPerItem?: number;
  quantity?: number;

  // subcontracting
  subcontractorCountry?: string;
  subcontractorRoleAndDescription?: string;

  // capital usage
  capitalUsageType?: PCRSpendProfileCapitalUsageType;
  typeLabel?: string;
  depreciationPeriod?: number;
  netPresentValue?: number;
  residualValue?: number;
  utilisation?: number;

  // Travel and subsistance
  numberOfTimes?: number;
  costOfEach?: number;
}

export interface PcrSpendProfileEntity extends PcrSpendProfileEntityForCreate {
  id: string;
}
