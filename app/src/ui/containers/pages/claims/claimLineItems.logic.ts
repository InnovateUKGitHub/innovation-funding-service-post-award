import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import head from "lodash/head";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToCostCategoryDtoArray } from "@gql/dtoMapper/mapCostCategoryDto";
import { mapToProjectDocumentSummaryDtoArray } from "@gql/dtoMapper/mapDocumentsDto";
import { mapToClaimDetailsWithLineItemsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";
import { mapToForecastDetailsDtoArray } from "@gql/dtoMapper/mapForecastDetailsDto";
import { claimLineItemsQuery } from "./ClaimLineItems.query";
import { ClaimLineItemsQuery } from "./__generated__/ClaimLineItemsQuery.graphql";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";

export const useClaimLineItemsData = (
  projectId: ProjectId,
  partnerId: PartnerId,
  periodId: PeriodId,
  costCategoryId: string,
) => {
  const data = useLazyLoadQuery<ClaimLineItemsQuery>(
    claimLineItemsQuery,
    { projectId, projectIdStr: projectId, partnerId, periodId, costCategoryId },
    { fetchPolicy: "network-only" },
  );
  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(projectNode?.Acc_ProjectParticipantsProject__r?.edges);
  const claimsGql = data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges ?? [];

  const project = mapToProjectDto(projectNode, ["id", "title", "competitionType", "projectNumber"]);

  const partner = mapToPartnerDto(partnerNode, ["id", "organisationType", "overheadRate"], {});
  const profileGql = data?.salesforce?.uiapi?.query?.Acc_Profile__c?.edges ?? [];

  const costCategories = mapToCostCategoryDtoArray(data?.salesforce?.uiapi?.query?.Acc_CostCategory__c?.edges ?? [], [
    "id",
    "name",
    "displayOrder",
    "type",
    "competitionType",
    "organisationType",
  ]);

  const documents = (data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges ?? [])
    .map(edge =>
      mapToProjectDocumentSummaryDtoArray(
        edge?.node?.ContentDocumentLinks?.edges ?? [],
        ["id", "dateCreated", "fileSize", "fileName", "link", "uploadedBy", "isOwner", "description"],
        {
          projectId,
          currentUser: { email: data?.currentUser?.email ?? "unknown email" },
          type: "claim details",
          periodId,
          partnerId,
          costCategoryId,
        },
      ),
    )
    .flat();

  const claimsDetails = mapToClaimDetailsWithLineItemsDtoArray(
    claimsGql,
    ["comments"],
    ["id", "lastModifiedDate", "value", "description"],
    {},
  );

  const claimDetails =
    head(claimsDetails) ??
    ({ comments: "", id: "", value: 0, description: 0, lineItems: [] } || {
      partnerId,
      costCategoryId,
      periodId,
      comments: null,
      lineItems: [],
    });

  const forecastDetails = mapToForecastDetailsDtoArray(profileGql, ["value"]);

  const forecastDetail = head(forecastDetails) || {
    costCategoryId,
    periodId,
    value: 0,
  };

  return {
    project,
    partner,
    claimDetails,
    forecastDetail,
    costCategories,
    documents,
  };
};
