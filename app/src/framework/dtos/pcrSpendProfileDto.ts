import { CostCategoryType, PCRSpendProfileCapitalUsageType, PCRSpendProfileOverheadRate } from "@framework/types";

export interface PcrSpendProfileDto {
  costs: PCRSpendProfileCostDto[];
  funds: PCRSpendProfileFundingDto[];
  pcrItemId: string;
}

export type PCRSpendProfileCostDto =
  | PCRSpendProfileAcademicCostDto
  | PCRSpendProfileCapitalUsageCostDto
  | PCRSpendProfileLabourCostDto
  | PCRSpendProfileMaterialsCostDto
  | PCRSpendProfileOtherCostsDto
  | PCRSpendProfileOverheadsCostDto
  | PCRSpendProfileSubcontractingCostDto
  | PCRSpendProfileTravelAndSubsCostDto;

export type PCRSpendProfileFundingDto = PCRSpendProfileOtherFundingDto;

interface PCRSpendProfileBaseCostDto {
  costCategory: CostCategoryType;
  costCategoryId: string;
  description: string | null;
  id: string;
  value: number | null;
}

export interface PCRSpendProfileOtherFundingDto extends PCRSpendProfileBaseCostDto {
  dateSecured: Date | null;
}

export type PCRSpendProfileAcademicCostDto = PCRSpendProfileBaseCostDto;

export interface PCRSpendProfileLabourCostDto extends PCRSpendProfileBaseCostDto {
  daysSpentOnProject: number | null;
  grossCostOfRole: number | null;
  ratePerDay: number | null;
}

export interface PCRSpendProfileOverheadsCostDto extends PCRSpendProfileBaseCostDto {
  overheadRate: PCRSpendProfileOverheadRate;
}

export interface PCRSpendProfileMaterialsCostDto extends PCRSpendProfileBaseCostDto {
  costPerItem: number | null;
  quantity: number | null;
}

export interface PCRSpendProfileSubcontractingCostDto extends PCRSpendProfileBaseCostDto {
  subcontractorCountry: string | null;
  subcontractorRoleAndDescription: string | null;
}

export interface PCRSpendProfileCapitalUsageCostDto extends PCRSpendProfileBaseCostDto {
  depreciationPeriod: number | null;
  netPresentValue: number | null;
  residualValue: number | null;
  type: PCRSpendProfileCapitalUsageType;
  typeLabel: string | null;
  utilisation: number | null;
}

export interface PCRSpendProfileTravelAndSubsCostDto extends PCRSpendProfileBaseCostDto {
  costOfEach: number | null;
  numberOfTimes: number | null;
}

export type PCRSpendProfileOtherCostsDto = PCRSpendProfileBaseCostDto;
