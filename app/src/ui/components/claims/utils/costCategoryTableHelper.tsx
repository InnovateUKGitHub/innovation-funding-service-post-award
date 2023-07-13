import { CostCategoryType } from "@framework/constants/enums";
import { PCROrganisationType } from "@framework/constants/pcrConstants";
import { ClaimDto } from "@framework/dtos/claimDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { CostsSummaryForPeriodDto } from "@framework/dtos/costsSummaryForPeriodDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { roundCurrency, diffAsPercentage } from "@framework/util/numberHelper";
import { Link } from "@ui/components/links";
import { P } from "@ui/rhf-components/Typography";
import { Result } from "@ui/validation/result";

export interface ClaimProps {
  project: ProjectDto;
  partner: PartnerDto;
  costCategories: CostCategoryDto[];
  claim: ClaimDto;
  claimDetails: CostsSummaryForPeriodDto[];
  getLink: (costCategoryId: string) => ILinkInfo | null;
  validation?: Result;
}

export interface ClaimTableRow {
  isTotal: boolean;
  category: Pick<CostCategoryDto, "id" | "name">;
  cost: Pick<
    CostsSummaryForPeriodDto,
    | "costCategoryId"
    | "remainingOfferCosts"
    | "forecastThisPeriod"
    | "costsClaimedThisPeriod"
    | "offerTotal"
    | "costsClaimedToDate"
  >;
  label: string | JSX.Element;
  differenceInPounds: number;
  diffPercentage: number;
}

interface ClaimTableResponse {
  totalNegativeCategories: ClaimTableRow[];
  costCategories: ClaimTableRow[];
}

export interface ClaimTableProps {
  costCategories: Pick<CostCategoryDto, "id" | "name" | "competitionType" | "organisationType">[];
  project: Pick<ProjectDto, "competitionType">;
  partner: Pick<PartnerDto, "organisationType">;
  claimDetails: Pick<
    CostsSummaryForPeriodDto,
    | "costCategoryId"
    | "remainingOfferCosts"
    | "forecastThisPeriod"
    | "costsClaimedThisPeriod"
    | "offerTotal"
    | "costsClaimedToDate"
  >[];
  getLink: (costCategoryId: string) => ILinkInfo | null;
  validation?: Result;
  disabled?: boolean;
}
/**
 * creates the table data
 */
export function createTableData(props: ClaimTableProps): ClaimTableResponse {
  const costCategories: ClaimTableRow[] = [];
  const totalNegativeCategories: ClaimTableRow[] = [];

  const filteredCategories = props.costCategories.filter(x => {
    const isMatchingCompetition = x.competitionType === props.project.competitionType;
    const isMatchingOrg = x.organisationType === props.partner.organisationType;

    return isMatchingCompetition && isMatchingOrg;
  });

  for (const category of filteredCategories) {
    const row = createRow(category, props, props.disabled);

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
function calculateTotalRow(claimDetails: ClaimTableProps["claimDetails"]): ClaimTableRow {
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
function createRow(
  category: Pick<CostCategoryDto, "id" | "name">,
  claimItem: {
    claimDetails: Pick<
      CostsSummaryForPeriodDto,
      | "costCategoryId"
      | "remainingOfferCosts"
      | "forecastThisPeriod"
      | "costsClaimedThisPeriod"
      | "offerTotal"
      | "costsClaimedToDate"
    >[];
    getLink: ClaimTableProps["getLink"];
    validation?: ClaimTableProps["validation"];
  },
  disabled?: boolean,
) {
  const { claimDetails, getLink, validation } = claimItem;

  // TODO: ID will always be present... 🤷🏻‍♂️
  // Note: This function may not have context of any claim details, so we provide a default
  const item = claimDetails.find(x => x.costCategoryId === category.id);

  const hasNegativeCost: boolean = !!item && item.remainingOfferCosts < 0;

  const costCategory = {
    label: renderCostCategory({ getLink, validation }, category, disabled),
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

export const renderCostCategory = (claimInfo: ClaimInfoProps, categoryInfo: CategoryInfoProps, disabled?: boolean) => {
  const { getLink, validation } = claimInfo;
  const route = getLink(categoryInfo.id);

  if (!route) return categoryInfo.name;

  const linkId = (validation && validation.errorMessage && validation.key) || "";
  if (disabled) {
    return <P id={linkId}>{categoryInfo.name}</P>;
  }
  return (
    <Link id={linkId} route={route}>
      {categoryInfo.name}
    </Link>
  );
};
