import { mapToClaimDetailsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";
import { mapToClaimDtoArray } from "@gql/dtoMapper/mapClaimDto";
import { mapToForecastDetailsDtoArray } from "@gql/dtoMapper/mapForecastDetailsDto";
import { getPartnerRoles, mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useFragmentContext } from "@gql/utils/fragmentContextHook";
import { isValidFragmentKey } from "@gql/utils/isValidFragmentKey";
import { useFragment } from "react-relay";
import { newForecastTableFragment } from "./NewForecastTable.fragment";
import {
  NewForecastTableFragment$key,
  NewForecastTableFragment$data,
} from "./__generated__/NewForecastTableFragment.graphql";
import { mapToGolCostDtoArray as mapToProfileTotalCostCategoryDtoArray } from "@gql/dtoMapper/mapGolCostsDto";
import { mapToProfilePeriodDetailsDtoArray } from "@gql/dtoMapper/mapProfilePeriodDetail";
import { mapToClaimTotalCostCategoryDtoArray } from "@gql/dtoMapper/mapClaimTotalCostCategory";

const useForecastTableFragment = ({
  fragmentRef,
  isProjectSetup = false,
  partnerId,
}: {
  fragmentRef: unknown;
  isProjectSetup?: boolean;
  partnerId: PartnerId;
}) => {
  if (!isValidFragmentKey<NewForecastTableFragment$key>(fragmentRef, "NewForecastTableFragment")) {
    throw new Error("Forecast Table (new) is missing a ForecastTableFragment reference");
  }

  const fragment: NewForecastTableFragment$data = useFragment(newForecastTableFragment, fragmentRef);

  const { node: projectNode } = getFirstEdge(fragment?.query?.ForecastTable_Project?.edges);
  const { node: partnerNode } = getFirstEdge(projectNode?.Acc_ProjectParticipantsProject__r?.edges);

  const project = mapToProjectDto(projectNode, ["title", "projectNumber", "numberOfPeriods", "roles", "partnerRoles"]);
  const partner = mapToPartnerDto(partnerNode, ["forecastLastModifiedDate", "overheadRate", "roles"], {
    roles: getPartnerRoles(project.partnerRoles, partnerId),
  });
  const claimTotalProjectPeriods = mapToClaimDtoArray(
    fragment?.query?.ForecastTable_ClaimTotalProjectPeriods?.edges ?? [],
    [
      "periodId",
      "status",
      "iarStatus",
      "isIarRequired",
      "isApproved",
      "periodStartDate",
      "periodEndDate",
      "isFinalClaim",
    ],
    {},
  );
  const claimDetails = mapToClaimDetailsDtoArray(
    fragment?.query?.ForecastTable_ClaimDetails?.edges ?? [],
    ["periodId", "costCategoryId", "value"],
    {},
  );
  const claimTotalCostCategories = mapToClaimTotalCostCategoryDtoArray(
    fragment.query.ForecastTable_ClaimTotalCostCategories?.edges ?? [],
    ["costCategoryId", "costCategoryName", "type"],
  );
  const profileTotalProjectPeriods = mapToProfilePeriodDetailsDtoArray(
    fragment.query.ForecastTable_ProfileTotalProjectPeriod?.edges ?? [],
    ["periodId", "periodStartDate", "periodEndDate"],
  );
  const profileTotalCostCategories = mapToProfileTotalCostCategoryDtoArray(
    fragment?.query?.ForecastTable_ProfileTotalCostCategories?.edges ?? [],
    ["value", "costCategoryId", "costCategoryName", "type"],
  );
  const profileDetails = mapToForecastDetailsDtoArray(
    fragment?.query?.ForecastTable_ProfileDetails?.edges ?? [],
    ["value", "periodId", "costCategoryId", "id"],
    { isProjectSetup },
  );

  return {
    project,
    partner,
    profileTotalProjectPeriods,
    profileTotalCostCategories,
    profileDetails,
    claimTotalProjectPeriods,
    claimTotalCostCategories,
    claimDetails,
  };
};

const useForecastTableFragmentFromContext = ({
  isProjectSetup,
  partnerId,
}: {
  isProjectSetup?: boolean;
  partnerId: PartnerId;
}) => {
  const fragmentRef = useFragmentContext();
  return useForecastTableFragment({ fragmentRef, isProjectSetup, partnerId });
};

export { useForecastTableFragment, useForecastTableFragmentFromContext };
