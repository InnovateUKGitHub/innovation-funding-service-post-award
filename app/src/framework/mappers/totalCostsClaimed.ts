import { AwardRateOverrideType } from "@framework/constants/awardRateOverride";
import { TotalCosts } from "@framework/constants/claims";
import {
  ClaimOverrideRateDto,
  CostCategoryClaimOverrideRates,
  PeriodClaimOverrideRates,
  CostCategoryClaimOverrideRate,
  PeriodClaimOverrideRate,
} from "@framework/dtos/claimOverrideRate";
import { CostsSummaryForPeriodDto } from "@framework/dtos/costsSummaryForPeriodDto";
import { sumBy, roundCurrency } from "@framework/util/numberHelper";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { useFragment } from "react-relay";
import { useFragmentContext } from "@gql/utils/fragmentContextHook";
import { isValidFragmentKey } from "@gql/utils/isValidFragmentKey";
import {
  TotalCostsClaimedFragment$data,
  TotalCostsClaimedFragment$key,
} from "@gql/fragment/__generated__/TotalCostsClaimedFragment.graphql";
import { totalCostsClaimedFragment } from "@gql/fragment/TotalCostsClaimedFragment";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToClaimDetailsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";
import { mapToCostSummaryForPeriodDtoArray } from "@gql/dtoMapper/mapCostSummaryForPeriod";
import { mapToClaimOverrides } from "@gql/dtoMapper/mapClaimOverrides";

export const calculateClaimsTotalCosts = (
  claimDetails: Pick<CostsSummaryForPeriodDto, "costCategoryId" | "costsClaimedThisPeriod" | "overrideAwardRate">[],
  claimOverrides: ClaimOverrideRateDto,
  partner: Pick<PartnerDto, "awardRate">,
  project: Pick<ProjectDto, "isNonFec">,
  periodId: PeriodId,
): TotalCosts => {
  //   return calculateTotalCostsToBePaid(claimDetails, claimOverrides, partner.awardRate ?? 0, project.isNonFec, periodId);
  const totalCostsClaimed: number = sumBy(claimDetails, claim => claim.costsClaimedThisPeriod);

  // Start off with a simple calculation...
  let totalCostsPaid = calculateCostsClaimed(partner.awardRate ?? 0, totalCostsClaimed);

  // ...unless the non-FEC project has cost category overrides
  if (project.isNonFec && claimOverrides.type !== AwardRateOverrideType.NONE) {
    // In which case, we should take into account any overrides.
    totalCostsPaid = calculateCostsClaimedWithCostCategoryOverrides(
      claimDetails,
      claimOverrides,
      partner.awardRate ?? 0,
      periodId,
    );
  }

  return { totalCostsClaimed: roundCurrency(totalCostsClaimed), totalCostsPaid: roundCurrency(totalCostsPaid) };
};

const calculateCostsClaimedWithCostCategoryOverrides = (
  claimDetails: Pick<CostsSummaryForPeriodDto, "costsClaimedThisPeriod" | "overrideAwardRate" | "costCategoryId">[],
  claimOverrides: CostCategoryClaimOverrideRates | PeriodClaimOverrideRates,
  projectAwardRate: number,
  periodId: PeriodId,
): number => {
  let total = 0;

  for (const claimDetail of claimDetails) {
    let claimOverride: CostCategoryClaimOverrideRate | PeriodClaimOverrideRate | undefined;

    switch (claimOverrides.type) {
      case AwardRateOverrideType.BY_COST_CATEGORY:
        claimOverride = claimOverrides.overrides.find(x => x.costCategoryId === claimDetail.costCategoryId);
        break;
      case AwardRateOverrideType.BY_PERIOD:
        claimOverride = claimOverrides.overrides.find(x => x.period === periodId);
        break;
    }

    const awardRatePercentage = claimOverride?.amount ?? claimDetail.overrideAwardRate ?? projectAwardRate;
    total += calculateCostsClaimed(awardRatePercentage, claimDetail.costsClaimedThisPeriod);
  }

  return total;
};

const calculateCostsClaimed = (awardRate: number, costsClaimed: number): number => {
  const decimalAwardRate = awardRate / 100;
  return decimalAwardRate * costsClaimed;
};

export const useGetTotalCostsClaimed = (fragmentRef: TotalCostsClaimedFragment$key, periodId: PeriodId) => {
  const fragment: TotalCostsClaimedFragment$data = useFragment(totalCostsClaimedFragment, fragmentRef);

  const { node: projectNode } = getFirstEdge(fragment?.query?.TotalCostsClaimed_Project?.edges);
  const { node: partnerNode } = getFirstEdge(fragment?.query?.TotalCostsClaimed_Partner?.edges);
  const project = mapToProjectDto(projectNode, ["isNonFec"]);
  const partner = mapToPartnerDto(partnerNode, ["awardRate"], {});
  const claimDetailsAllPeriods = mapToClaimDetailsDtoArray(
    fragment?.query?.TotalCostsClaimed_ClaimDetails?.edges ?? [],
    ["periodId", "costCategoryId", "value"],
    {},
  );

  const claimDetailsSummaryForPeriod = mapToCostSummaryForPeriodDtoArray(
    fragment?.query?.TotalCostsClaimed_CostCategory?.edges ?? [],
    ["overrideAwardRate", "costsClaimedThisPeriod", "costCategoryId"],
    {
      claimDetails: claimDetailsAllPeriods,
      periodId,
    },
  );

  const claimOverrides = mapToClaimOverrides(fragment?.query?.TotalCostsClaimed_ClaimOverrides?.edges ?? []);

  return calculateClaimsTotalCosts(claimDetailsSummaryForPeriod, claimOverrides, partner, project, periodId);
};
