import { getPartnerRoles } from "@gql/dtoMapper/getPartnerRoles";
import { mapToCurrentClaimsDtoArray } from "@gql/dtoMapper/mapClaimDto";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { viewForecastQuery } from "./ViewForecast.query";
import { ViewForecastQuery } from "./__generated__/ViewForecastQuery.graphql";

const defaultRole = { isPm: false, isMo: false, isFc: false, isAssociate: false };

export const useViewForecastData = (projectId: ProjectId, partnerId: PartnerId) => {
  const data = useLazyLoadQuery<ViewForecastQuery>(
    viewForecastQuery,
    {
      projectId,
      projectIdStr: projectId,
      partnerId,
    },
    { fetchPolicy: "network-only" },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(projectNode?.Acc_ProjectParticipantsProject__r?.edges);

  const claimsGql = data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges ?? [];

  // PARTNER ROLES
  const partnerRoles = getPartnerRoles(projectNode?.roles ?? null);

  // PROJECT
  const project = mapToProjectDto(projectNode, ["id", "isActive", "status", "roles", "periodId"]);

  // PARTNER
  const partner = mapToPartnerDto(
    partnerNode,
    [
      "id",
      "name",
      "isWithdrawn",
      "partnerStatus",
      "isLead",
      "newForecastNeeded",
      "overheadRate",
      "roles",
      "forecastLastModifiedDate",
    ],
    { roles: partnerRoles.find(x => x.partnerId === (partnerNode?.Id ?? "unknown")) ?? defaultRole },
  );

  // CLAIMS
  const claims = mapToCurrentClaimsDtoArray(
    claimsGql,
    ["id", "isApproved", "periodId", "isFinalClaim", "paidDate", "status"],
    {},
  );

  return {
    project,
    partner,
    claims,
    fragmentRef: data?.salesforce?.uiapi,
  };
};
