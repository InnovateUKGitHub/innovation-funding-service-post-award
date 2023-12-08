import { useFragment } from "react-relay";
import { forecastTableFragment } from "./ForecastTable.fragment";
import { ForecastTableFragment$data, ForecastTableFragment$key } from "./__generated__/ForecastTableFragment.graphql";
import { ForecastTable as ForecastTableComponent, Props as ForecastTableProps } from "./forecastTable";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToClaimDetailsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";
import { mapToGolCostDtoArray } from "@gql/dtoMapper/mapGolCostsDto";
import { mapToForecastDetailsDtoArray } from "@gql/dtoMapper/mapForecastDetailsDto";
import { mapToRequiredSortedCostCategoryDtoArray } from "@gql/dtoMapper/mapCostCategoryDto";
import { mapToCurrentClaimsDtoArray } from "@gql/dtoMapper/mapClaimDto";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { useFragmentContext } from "@gql/utils/fragmentContextHook";
import { isValidFragmentKey } from "@gql/utils/isValidFragmentKey";
import { getIARDueOnClaimPeriods } from "@gql/dtoMapper/mapIarDue";

export type ForecastTableWithFragmentProps =
  | { periodId: PeriodId; selectCurrentClaimByApprovedStatus?: false | undefined | null }
  | { periodId?: never; selectCurrentClaimByApprovedStatus: true };

export const ForecastTable = ({
  periodId,
  selectCurrentClaimByApprovedStatus,
  ...props
}: ForecastTableWithFragmentProps & Omit<ForecastTableProps, "data">) => {
  const fragmentRef = useFragmentContext();

  if (!isValidFragmentKey<ForecastTableFragment$key>(fragmentRef, "ForecastTableFragment")) {
    throw new Error("Forecast Table is missing a ForecastTableFragment reference");
  }

  const fragment: ForecastTableFragment$data = useFragment(forecastTableFragment, fragmentRef);
  const { node: projectNode } = getFirstEdge(fragment?.query?.ForecastTable_Project?.edges);
  const { node: partnerNode } = getFirstEdge(fragment?.query?.ForecastTable_Partner?.edges);

  const project = mapToProjectDto(projectNode, ["periodId", "numberOfPeriods", "competitionType"]);

  const costCategories = mapToRequiredSortedCostCategoryDtoArray(
    fragment?.query?.ForecastTable_CostCategory?.edges ?? [],
    ["id", "name", "displayOrder", "isCalculated", "competitionType", "organisationType", "type"],
    fragment?.query?.ForecastTable_ProfileForCostCategory?.edges ?? [],
  );

  const partner = mapToPartnerDto(partnerNode, ["id", "partnerStatus", "name", "organisationType", "overheadRate"], {});

  const claims = mapToCurrentClaimsDtoArray(
    fragment?.query?.ForecastTable_AllClaimsForPartner?.edges ?? [],
    ["isApproved", "periodId"],
    {},
  );

  const costCategoriesOrder = costCategories.map(y => y.id);

  let claim: typeof claims[0] | null;
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

  const forecastData = {
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

  return <ForecastTableComponent data={forecastData} {...props} />;
};
