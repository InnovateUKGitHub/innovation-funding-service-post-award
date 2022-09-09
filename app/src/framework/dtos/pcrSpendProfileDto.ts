import { CostCategoryType, PCRSpendProfileCapitalUsageType, PCRSpendProfileOverheadRate } from "@framework/types";

export interface PcrSpendProfileDto {
  costs: PCRSpendProfileCostDto[];
  funds: PCRSpendProfileFundingDto[];
  pcrItemId: string;
}

export type PCRSpendProfileCostDto =
  | PCRSpendProfileAcademicCostDto
  | PCRSpendProfileLabourCostDto
  | PCRSpendProfileMaterialsCostDto
  | PCRSpendProfileOverheadsCostDto
  | PCRSpendProfileSubcontractingCostDto
  | PCRSpendProfileCapitalUsageCostDto
  | PCRSpendProfileTravelAndSubsCostDto
  | PCRSpendProfileOtherCostsDto;

export type PCRSpendProfileFundingDto = PCRSpendProfileOtherFundingDto;

interface PCRSpendProfileBaseCostDto {
  id: string;
  costCategory: CostCategoryType;
  costCategoryId: string;
  description: string | null;
  value: number | null;
}

export interface PCRSpendProfileOtherFundingDto extends PCRSpendProfileBaseCostDto {
  dateSecured: Date | null;
}

export type PCRSpendProfileAcademicCostDto = PCRSpendProfileBaseCostDto;

export interface PCRSpendProfileLabourCostDto extends PCRSpendProfileBaseCostDto {
  grossCostOfRole: number | null;
  ratePerDay: number | null;
  daysSpentOnProject: number | null;
}

export interface PCRSpendProfileOverheadsCostDto extends PCRSpendProfileBaseCostDto {
  overheadRate: PCRSpendProfileOverheadRate;
}

export interface PCRSpendProfileMaterialsCostDto extends PCRSpendProfileBaseCostDto {
  quantity: number | null;
  costPerItem: number | null;
}

export interface PCRSpendProfileSubcontractingCostDto extends PCRSpendProfileBaseCostDto {
  subcontractorCountry: string | null;
  subcontractorRoleAndDescription: string | null;
}

export interface PCRSpendProfileCapitalUsageCostDto extends PCRSpendProfileBaseCostDto {
  type: PCRSpendProfileCapitalUsageType;
  typeLabel: string | null;
  depreciationPeriod: number | null;
  netPresentValue: number | null;
  residualValue: number | null;
  utilisation: number | null;
}

export interface PCRSpendProfileTravelAndSubsCostDto extends PCRSpendProfileBaseCostDto {
  numberOfTimes: number | null;
  costOfEach: number | null;
}

export type PCRSpendProfileOtherCostsDto = PCRSpendProfileBaseCostDto;
