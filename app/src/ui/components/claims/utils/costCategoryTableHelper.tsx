import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import {
  ClaimDto,
  CostCategoryType,
  CostsSummaryForPeriodDto,
  PartnerDto,
  ProjectDto,
  PCROrganisationType,
} from "@framework/types";
import { ILinkInfo } from "@framework/types/ILinkInfo";

import { Link } from "@ui/components";
import { Result } from "@ui/validation";
import { roundCurrency, diffAsPercentage } from "@framework/util";

export interface ClaimProps {
  project: ProjectDto;
  partner: PartnerDto;
  costCategories: CostCategoryDto[];
  claim: ClaimDto;
  claimDetails: CostsSummaryForPeriodDto[];
  standardOverheadRate: number; // TODO - doesn't look like we're using this anywhere for calculations/display purposes
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

/**
 * creates the table data
 */
export function createTableData(props: ClaimProps): ClaimTableResponse {
  const costCategories: ClaimTableRow[] = [];
  const totalNegativeCategories: ClaimTableRow[] = [];

  // TODO: Filter cost categories on current partner, this needs to be done before the UI loads ideally
  const filteredCategories = props.costCategories.filter(x => {
    const isMatchingCompetition = x.competitionType === props.project.competitionType;
    const isMatchingOrg = x.organisationType === props.partner.organisationType;

    return isMatchingCompetition && isMatchingOrg;
  });

  for (const category of filteredCategories) {
    const row = createRow(category, props);

    costCategories.push(row.costCategory);

    if (row.hasNegativeCost) {
      totalNegativeCategories.push(row.costCategory);
    }
  }

  const totalRow = calculateTotalRow(props.claimDetails);
  const allCostCategories = [...costCategories, totalRow];

  return {
    totalNegativeCategories,
    costCategories: allCostCategories,
  };
}

const emptyCostsSummaryForPeriodDto: CostsSummaryForPeriodDto = {
  costCategoryId: "",
  offerTotal: 0,
  forecastThisPeriod: 0,
  costsClaimedToDate: 0,
  costsClaimedThisPeriod: 0,
  remainingOfferCosts: 0,
};

/**
 * calculates total for the row
 */
function calculateTotalRow(claimDetails: ClaimProps["claimDetails"]): ClaimTableRow {
  let totalRowCosts: CostsSummaryForPeriodDto = {
    costCategoryId: "",
    offerTotal: 0,
    forecastThisPeriod: 0,
    costsClaimedToDate: 0,
    costsClaimedThisPeriod: 0,
    remainingOfferCosts: 0,
  };

  // Note: Populate totals form all claim items
  for (const item of claimDetails) {
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
      organisationType: PCROrganisationType.Unknown,
      description: "",
      hintText: "",
    },
  };

  return {
    ...staticTotalRowData,
    cost: totalRowCosts,
    differenceInPounds: roundCurrency(totalRowCosts.forecastThisPeriod - totalRowCosts.costsClaimedThisPeriod),
    diffPercentage: diffAsPercentage(totalRowCosts.forecastThisPeriod, totalRowCosts.costsClaimedThisPeriod),
  };
}

/**
 * creates a row
 */
function createRow(category: CostCategoryDto, claimItem: ClaimProps) {
  const { claimDetails, ...restClaimProps } = claimItem;

  // TODO: ID will always be present... 🤷🏻‍♂️
  // Note: This function may not have context of any claim details, so we provide a default
  const item = claimDetails.find(x => x.costCategoryId === category.id);

  const hasNegativeCost: boolean = !!item && item.remainingOfferCosts < 0;

  const costCategory = {
    label: renderCostCategory(restClaimProps, category),
    isTotal: false,
    category,
    cost: item || emptyCostsSummaryForPeriodDto,
    differenceInPounds: item ? roundCurrency(item.forecastThisPeriod - item.costsClaimedThisPeriod) : 0,
    diffPercentage: item ? diffAsPercentage(item.forecastThisPeriod, item.costsClaimedThisPeriod) : 0,
  };

  return {
    hasNegativeCost,
    costCategory,
  };
}

export type ClaimInfoProps = Pick<ClaimProps, "getLink" | "validation">;
export type CategoryInfoProps = Pick<CostCategoryDto, "id" | "name">;

export const renderCostCategory = (claimInfo: ClaimInfoProps, categoryInfo: CategoryInfoProps) => {
  const { getLink, validation } = claimInfo;
  const route = getLink(categoryInfo.id);

  if (!route) return categoryInfo.name;

  const linkId = (validation && validation.errorMessage && validation.key) || "";

  return (
    <Link id={linkId} route={route}>
      {categoryInfo.name}
    </Link>
  );
};
