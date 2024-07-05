import { mapToClaimDetailsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";
import { mapToCurrentClaimsDtoArray } from "@gql/dtoMapper/mapClaimDto";
import { mapToRequiredSortedCostCategoryDtoArray } from "@gql/dtoMapper/mapCostCategoryDto";
import { mapToForecastDetailsDtoArray } from "@gql/dtoMapper/mapForecastDetailsDto";
import { mapToGolCostDtoArray } from "@gql/dtoMapper/mapGolCostsDto";
import { getIARDueOnClaimPeriods } from "@gql/dtoMapper/mapIarDue";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useMemo } from "react";
import { useFragment } from "react-relay";
import { forecastTableFragment } from "./ForecastTable.fragment";
import { ForecastTableFragment$key, ForecastTableFragment$data } from "./__generated__/ForecastTableFragment.graphql";
import { ForecastTableWithFragmentProps } from "./forecastTable.withFragment";

interface UseForecastTableFragment {
  fragmentRef: ForecastTableFragment$key;
}

const useForecastTableFragment = ({
  fragmentRef,
  periodId,
  selectCurrentClaimByApprovedStatus,
}: UseForecastTableFragment & ForecastTableWithFragmentProps) => {
  const fragment: ForecastTableFragment$data = useFragment(forecastTableFragment, fragmentRef);

  return useMemo(() => {
    const { node: projectNode } = getFirstEdge(fragment?.query?.ForecastTable_Project?.edges);
    const { node: partnerNode } = getFirstEdge(fragment?.query?.ForecastTable_Partner?.edges);

    const project = mapToProjectDto(projectNode, ["periodId", "numberOfPeriods", "competitionType"]);

    const costCategories = mapToRequiredSortedCostCategoryDtoArray(
      fragment?.query?.ForecastTable_CostCategory?.edges ?? [],
      ["id", "name", "displayOrder", "isCalculated", "competitionType", "organisationType", "type"],
      fragment?.query?.ForecastTable_ProfileForCostCategory?.edges ?? [],
    );

    const partner = mapToPartnerDto(
      partnerNode,
      ["id", "partnerStatus", "name", "organisationType", "overheadRate"],
      {},
    );

    const claims = mapToCurrentClaimsDtoArray(
      fragment?.query?.ForecastTable_AllClaimsForPartner?.edges ?? [],
      ["isApproved", "periodId"],
      {},
    );

    const costCategoriesOrder = costCategories.map(y => y.id);

    let claim: (typeof claims)[0] | null;
    if (selectCurrentClaimByApprovedStatus) {
      claim = claims.find(claim => !claim.isApproved) ?? null;
    } else {
      claim = claims.find(claim => claim.periodId === periodId) ?? null;
    }

    const claimDetails = mapToClaimDetailsDtoArray(
      fragment?.query?.ForecastTable_ClaimDetails?.edges ?? [],
      ["costCategoryId", "periodEnd", "periodStart", "periodId", "value"],
      {},
    );

    const golCosts = mapToGolCostDtoArray(
      fragment?.query?.ForecastTable_GolCosts?.edges ?? [],
      ["costCategoryId", "costCategoryName", "value"],
      costCategories,
    ).sort((x, y) => costCategoriesOrder.indexOf(x.costCategoryId) - costCategoriesOrder.indexOf(y.costCategoryId));

    const forecastDetails = mapToForecastDetailsDtoArray(fragment?.query?.ForecastTable_ForecastDetails?.edges ?? [], [
      "id",
      "costCategoryId",
      "periodEnd",
      "periodStart",
      "periodId",
      "value",
    ]);

    const IARDueOnClaimPeriods = getIARDueOnClaimPeriods(fragment?.query?.ForecastTable_ClaimsForIarDue?.edges ?? []);

    return {
      golCosts,
      forecastDetails,
      claimDetails,
      costCategories,
      project,
      partner,
      claim,
      claims,
      IARDueOnClaimPeriods,
    };
  }, [fragment, periodId, selectCurrentClaimByApprovedStatus]);
};

export { useForecastTableFragment };
