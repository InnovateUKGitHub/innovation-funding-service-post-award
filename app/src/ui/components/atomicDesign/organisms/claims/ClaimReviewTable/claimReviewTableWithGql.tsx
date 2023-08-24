import { useFragment } from "react-relay";
import { ClaimTableProps } from "../utils/costCategoryTableHelper";
import { ClaimReviewTable as ClaimReviewTableComponent } from "./claimReviewTable";
import {
  ClaimTableFragment$data,
  ClaimTableFragment$key,
} from "../ClaimTable/__generated__/ClaimTableFragment.graphql";
import { claimTableFragment } from "../ClaimTable/ClaimTable.fragment";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToRequiredSortedCostCategoryDtoArray } from "@gql/dtoMapper/mapCostCategoryDto";
import { mapToClaimDetailsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";
import { mapToGolCostDtoArray } from "@gql/dtoMapper/mapGolCostsDto";
import { mapToForecastDetailsDtoArray } from "@gql/dtoMapper/mapForecastDetailsDto";
import { mapToCostSummaryForPeriodDtoArray } from "@gql/dtoMapper/mapCostSummaryForPeriod";
import { useFragmentContext } from "@gql/fragmentContextHook";
import { isValidFragmentKey } from "@gql/isValidFragmentKey";

export const ClaimReviewTable = ({
  periodId,
  ...props
}: { periodId: PeriodId } & Omit<ClaimTableProps, "costCategories" | "project" | "partner" | "claimDetails">) => {
  const fragmentRef = useFragmentContext();

  if (!isValidFragmentKey<ClaimTableFragment$key>(fragmentRef, "ClaimTableFragment")) {
    throw new Error("Claim Review Table is missing a ClaimTableFragment reference");
  }

  const fragment: ClaimTableFragment$data = useFragment(claimTableFragment, fragmentRef);

  const { node: projectNode } = getFirstEdge(fragment?.query?.ClaimTable_Project?.edges);
  const { node: partnerNode } = getFirstEdge(fragment?.query?.ClaimTable_Partner?.edges);

  const project = mapToProjectDto(projectNode, ["competitionType"]);

  const partner = mapToPartnerDto(partnerNode, ["organisationType"], {});

  const costCategories = mapToRequiredSortedCostCategoryDtoArray(
    fragment?.query?.ClaimTable_CostCategory?.edges ?? [],
    ["id", "name", "displayOrder", "competitionType", "organisationType", "type"],
    fragment?.query?.ClaimTable_ProfileForCostCategory?.edges ?? [],
  );

  const costCategoriesOrder = costCategories.map(y => y.id);

  const golCosts = mapToGolCostDtoArray(
    fragment?.query?.ClaimTable_GolCosts?.edges ?? [],
    ["costCategoryId", "costCategoryName", "value"],
    costCategories,
  ).sort((x, y) => costCategoriesOrder.indexOf(x.costCategoryId) - costCategoriesOrder.indexOf(y.costCategoryId));

  const forecastDetails = mapToForecastDetailsDtoArray(fragment?.query?.ClaimTable_ForecastDetails?.edges ?? [], [
    "id",
    "costCategoryId",
    "periodEnd",
    "periodStart",
    "periodId",
    "value",
  ]);

  const claimDetails = mapToClaimDetailsDtoArray(
    fragment?.query?.ClaimTable_ClaimDetails?.edges ?? [],
    ["costCategoryId", "periodId", "value"],
    {},
  );

  const costsSummaryForPeriod = mapToCostSummaryForPeriodDtoArray(
    fragment?.query?.ClaimTable_CostCategory?.edges ?? [],
    [
      "costCategoryId",
      "costsClaimedThisPeriod",
      "costsClaimedToDate",
      "forecastThisPeriod",
      "offerTotal",
      "remainingOfferCosts",
    ],
    {
      claimDetails,
      forecastDetails,
      periodId,
      golCosts,
    },
  );

  const data = {
    project,
    partner,
    costCategories,
    claimDetails: costsSummaryForPeriod,
  };

  return <ClaimReviewTableComponent {...data} {...props} />;
};
