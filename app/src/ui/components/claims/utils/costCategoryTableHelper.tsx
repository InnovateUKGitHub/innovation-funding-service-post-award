// tslint:disable: prefer-for-of
import React from "react";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { CostCategoryType } from "@framework/entities";
import { ClaimDto, CostsSummaryForPeriodDto, PartnerDto, ProjectDto } from "@framework/types";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Link } from "../../links";
import { Result } from "@ui/validation";

export interface ClaimProps {
  project: ProjectDto;
  partner: PartnerDto;
  costCategories: CostCategoryDto[];
  claim: ClaimDto;
  claimDetails: CostsSummaryForPeriodDto[];
  standardOverheadRate: number;
  getLink: (costCategoryId: string) => ILinkInfo | null;
  validation?: Result;
}

export interface ClaimTableRow {
  isTotal: boolean;
  category: CostCategoryDto;
  cost: CostsSummaryForPeriodDto;
  label: string | JSX.Element;
  differenceInPounds: number;
  diffPercentage: number;
}

interface ClaimTableResponse {
  totalNegativeCategories: ClaimTableRow[];
  costCategories: ClaimTableRow[];
}

export function createTableData(props: ClaimProps): ClaimTableResponse {
  const costCategories: ClaimTableRow[] = [];
  const totalNegativeCategories: ClaimTableRow[] = [];

  // Note: Iterate through all costCategories to get get matching claim items
  for (let index = 0; index < props.costCategories.length; index++) {
    const category = props.costCategories[index];
    const tableRow = createCostCategory(category, props);

    if (!tableRow) break;

    costCategories.push(tableRow.costCategory);

    if (tableRow.hasNegativeCost) {
      totalNegativeCategories.push(tableRow.costCategory);
    }
  }

  const totalRow = calculateTotalRow(props.claimDetails);
  const allCostCategories = [...costCategories, totalRow];

  return {
    totalNegativeCategories,
    costCategories: allCostCategories,
  };
}

const diffAsPounds = (x: CostsSummaryForPeriodDto): number => x.forecastThisPeriod - x.costsClaimedThisPeriod;
const diffAsPercentage = (x: CostsSummaryForPeriodDto): number => (100 * diffAsPounds(x)) / x.forecastThisPeriod;

function calculateTotalRow(claimDetails: ClaimProps["claimDetails"]): ClaimTableRow {
  let totalRowCosts: CostsSummaryForPeriodDto = {
    costCategoryId: "",
    offerTotal: 0,
    forecastThisPeriod: 0,
    costsClaimedToDate: 0,
    costsClaimedThisPeriod: 0,
    remainingOfferCosts: 0,
  };

  // Note: Iterate through all claimDetails then get total
  for (let index = 0; index < claimDetails.length; index++) {
    const item = claimDetails[index];

    totalRowCosts = {
      costCategoryId: "",
      offerTotal: totalRowCosts.offerTotal + item.offerTotal,
      forecastThisPeriod: totalRowCosts.forecastThisPeriod + item.forecastThisPeriod,
      costsClaimedToDate: totalRowCosts.costsClaimedToDate + item.costsClaimedToDate,
      costsClaimedThisPeriod: totalRowCosts.costsClaimedThisPeriod + item.costsClaimedThisPeriod,
      remainingOfferCosts: totalRowCosts.remainingOfferCosts + item.remainingOfferCosts,
    };
  }

  const staticTotalRowData = {
    isTotal: true,
    label: "Total",
    category: {
      name: "Total",
      type: CostCategoryType.Unknown,
      id: "",
      isCalculated: false,
      hasRelated: false,
      competitionType: "Unknown",
      organisationType: "Unknown",
      description: "",
      hintText: "",
    },
  };

  return {
    ...staticTotalRowData,
    cost: totalRowCosts,
    differenceInPounds: diffAsPounds(totalRowCosts),
    diffPercentage: diffAsPercentage(totalRowCosts),
  };
}

function createCostCategory(category: CostCategoryDto, claimItem: ClaimProps) {
  const { project, partner, claimDetails, ...restClaimProps } = claimItem;

  const isMatchingCompetition = category.competitionType === project.competitionType;
  const isMatchingOrg = category.organisationType === partner.organisationType;
  const isValidCategory = isMatchingCompetition && isMatchingOrg;

  if (isValidCategory) {
    const costCategoryItem = getMatchingCostCategory(category.id, claimDetails);

    if (!costCategoryItem) return;

    const hasNegativeCost: boolean = costCategoryItem.remainingOfferCosts < 0;

    const costCategory = {
      label: renderCostCategory(restClaimProps, category),
      isTotal: false,
      category,
      cost: costCategoryItem,
      differenceInPounds: diffAsPounds(costCategoryItem),
      diffPercentage: diffAsPercentage(costCategoryItem),
    };

    return {
      hasNegativeCost,
      costCategory,
    };
  }
}

function getMatchingCostCategory<CategoryId extends string, Category extends { costCategoryId: CategoryId }>(
  categoryId: CategoryId,
  costCategories: Category[],
) {
  return costCategories.find(costCategory => costCategory.costCategoryId === categoryId);
}

export type ClaimInfoProps = Pick<ClaimProps, "getLink" | "validation">;
export type CategoryInfoProps = Pick<CostCategoryDto, "id" | "name">;

export function renderCostCategory(claimInfo: ClaimInfoProps, categoryInfo: CategoryInfoProps) {
  const { getLink, validation } = claimInfo;
  const route = getLink(categoryInfo.id);

  if (!route) return categoryInfo.name;

  const linkId = (validation && validation.errorMessage && validation.key) || "";

  return (
    <Link id={linkId} route={route}>
      {categoryInfo.name}
    </Link>
  );
}
