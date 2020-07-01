import { CostCategoryType } from "@framework/entities";
import { PCRSpendProfileCapitalUsageType, PCRSpendProfileOverheadRate } from "@framework/types";

export interface PcrSpendProfileDto {
  costs: PCRSpendProfileCostDto[];
  funds: PCRSpendProfileFundingDto[];
  pcrItemId: string;
}

export type PCRSpendProfileCostDto =
    PCRSpendProfileAcademicCostDto
    | PCRSpendProfileLabourCostDto
    | PCRSpendProfileMaterialsCostDto
    | PCRSpendProfileOverheadsCostDto
    | PCRSpendProfileSubcontractingCostDto
    | PCRSpendProfileCapitalUsageCostDto
    | PCRSpendProfileTravelAndSubsCostDto
    | PCRSpendProfileOtherCostsDto;

export type PCRSpendProfileFundingDto = PCRSpendProfileOtherFundingDto;

interface PCRSpendProfileBaseCostDto<T extends CostCategoryType> {
  id: string;
  costCategory: T;
  costCategoryId: string;
  description: string | null;
  value: number | null;
}

export interface PCRSpendProfileOtherFundingDto extends PCRSpendProfileBaseCostDto<CostCategoryType.Other_Funding> {
  costCategory: CostCategoryType.Other_Funding;
  dateSecured: Date | null;
}

export interface PCRSpendProfileAcademicCostDto extends PCRSpendProfileBaseCostDto<CostCategoryType.Academic> {
  costCategory: CostCategoryType.Academic;
}

export interface PCRSpendProfileLabourCostDto extends PCRSpendProfileBaseCostDto<CostCategoryType.Labour> {
  costCategory: CostCategoryType.Labour;
  grossCostOfRole: number | null;
  ratePerDay: number | null;
  daysSpentOnProject: number | null;
}

export interface PCRSpendProfileOverheadsCostDto extends PCRSpendProfileBaseCostDto<CostCategoryType.Overheads> {
  costCategory: CostCategoryType.Overheads;
  overheadRate: PCRSpendProfileOverheadRate;
}

export interface PCRSpendProfileMaterialsCostDto extends PCRSpendProfileBaseCostDto<CostCategoryType.Materials> {
  costCategory: CostCategoryType.Materials;
  quantity: number | null;
  costPerItem: number | null;
}

export interface PCRSpendProfileSubcontractingCostDto extends PCRSpendProfileBaseCostDto<CostCategoryType.Subcontracting> {
  costCategory: CostCategoryType.Subcontracting;
  subcontractorCountry: string | null;
  subcontractorRoleAndDescription: string | null;
}

export interface PCRSpendProfileCapitalUsageCostDto extends PCRSpendProfileBaseCostDto<CostCategoryType.Capital_Usage> {
  costCategory: CostCategoryType.Capital_Usage;
  type: PCRSpendProfileCapitalUsageType;
  typeLabel: string | null;
  depreciationPeriod: number | null;
  netPresentValue: number | null;
  residualValue: number | null;
  utilisation: number | null;
}

export interface PCRSpendProfileTravelAndSubsCostDto extends PCRSpendProfileBaseCostDto<CostCategoryType.Travel_And_Subsistence> {
  numberOfTimes: number | null;
  costOfEach: number | null;
}

export interface PCRSpendProfileOtherCostsDto extends PCRSpendProfileBaseCostDto<CostCategoryType.Other_Costs> {
  costCategory: CostCategoryType.Other_Costs;
}
