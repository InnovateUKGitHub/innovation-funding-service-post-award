import { mapToCurrentClaimsDtoArray } from "@gql/dtoMapper/mapClaimDto";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { updateForecastQuery } from "./UpdateForecast.query";
import { UpdateForecastQuery } from "./__generated__/UpdateForecastQuery.graphql";

export const useUpdateForecastData = (
  projectId: ProjectId,
  partnerId: PartnerId,
  refreshedQueryOptions: { fetchKey: number; fetchPolicy: "store-only" } | undefined,
) => {
  const data = useLazyLoadQuery<UpdateForecastQuery>(
    updateForecastQuery,
    {
      projectId,
      projectIdStr: projectId,
      partnerId,
    },
    refreshedQueryOptions,
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(projectNode?.Acc_ProjectParticipantsProject__r?.edges);

  const claimsGql = data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges ?? [];

  // PROJECT
  const project = mapToProjectDto(projectNode, ["id", "isActive", "roles"]);

  // PARTNER
  const partner = mapToPartnerDto(partnerNode, ["overheadRate", "forecastLastModifiedDate"], {});

  // CLAIMS
  const claims = mapToCurrentClaimsDtoArray(claimsGql, ["id", "isApproved", "periodId", "isFinalClaim"], {});

  // ACTIVE CLAIM
  const claim = claims.find(claim => !claim.isApproved) || null;

  return {
    project,
    partner,
    claims,
    claim,
    fragmentRef: data?.salesforce?.uiapi,
  };
};
