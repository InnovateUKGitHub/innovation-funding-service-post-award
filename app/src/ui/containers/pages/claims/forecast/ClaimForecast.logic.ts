import { mapToClaimDetailsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";
import { mapToClaimsDtoArray } from "@gql/dtoMapper/mapClaimDto";
import { mapToForecastDetailsDtoArray } from "@gql/dtoMapper/mapForecastDetailsDto";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { claimForecastQuery } from "./ClaimForecast.query";
import { ClaimForecastQuery } from "./__generated__/ClaimForecastQuery.graphql";
import { mapToGolCostDtoArray as mapToProfileTotalCostCategoryDtoArray } from "@gql/dtoMapper/mapGolCostsDto";

const useClaimForecastData = ({
  projectParticipantId,
  projectId,
}: {
  projectParticipantId: PartnerId;
  projectId: ProjectId;
}) => {
  const data = useLazyLoadQuery<ClaimForecastQuery>(claimForecastQuery, { projectParticipantId, projectId });

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges);

  const project = mapToProjectDto(projectNode, ["title", "projectNumber", "numberOfPeriods", "roles"]);
  const partner = mapToPartnerDto(partnerNode, ["forecastLastModifiedDate", "overheadRate"], {});
  const claims = mapToClaimsDtoArray(
    data.salesforce.uiapi.query.Acc_Claims__c?.edges ?? [],
    ["periodId", "status", "iarStatus", "isIarRequired", "isApproved", "periodEndDate", "isFinalClaim"],
    {},
  );
  const claimDetails = mapToClaimDetailsDtoArray(
    data.salesforce.uiapi.query.ClaimDetails?.edges ?? [],
    ["periodId", "costCategoryId", "value"],
    {},
  );
  const costCategories = mapToProfileTotalCostCategoryDtoArray(
    data.salesforce.uiapi.query.ProfileTotalCostCategory?.edges ?? [],
    ["value", "costCategoryId", "costCategoryName", "type"],
  );
  const profiles = mapToForecastDetailsDtoArray(data.salesforce.uiapi.query.ProfileDetails?.edges ?? [], [
    "value",
    "periodId",
    "costCategoryId",
    "id",
  ]);

  return {
    data,
    project,
    partner,
    costCategories,
    profiles,
    claims,
    claimDetails,
  };
};

export { useClaimForecastData };
