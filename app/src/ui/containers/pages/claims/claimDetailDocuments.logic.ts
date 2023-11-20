import { ClaimDetailKey } from "@framework/types/ClaimDetailKey";
import { mapToProjectDocumentSummaryDtoArray } from "@gql/dtoMapper/mapDocumentsDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { RefreshedQueryOptions } from "@gql/hooks/useRefreshQuery";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { claimDetailDocumentsQuery } from "./ClaimDetailDocuments.query";
import { ClaimDetailDocumentsQuery } from "./__generated__/ClaimDetailDocumentsQuery.graphql";
import { mapToCostCategoryDtoArray } from "@gql/dtoMapper/mapCostCategoryDto";

export const useClaimDetailDocumentsQuery = (
  { projectId, partnerId, periodId, costCategoryId }: ClaimDetailKey,
  refreshedQueryOptions: RefreshedQueryOptions,
) => {
  const data = useLazyLoadQuery<ClaimDetailDocumentsQuery>(
    claimDetailDocumentsQuery,
    { projectId, partnerId, periodId, costCategoryId, projectIdStr: projectId },
    refreshedQueryOptions,
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, [
    "id",
    "projectNumber",
    "title",
    "status",
    "roles",
    "impactManagementParticipation",
    "competitionType",
  ]);

  const claimDocuments = (data?.salesforce?.uiapi?.query?.ClaimsDocuments?.edges ?? [])
    .map(edge =>
      mapToProjectDocumentSummaryDtoArray(
        edge?.node?.ContentDocumentLinks?.edges ?? [],
        ["id", "dateCreated", "fileSize", "fileName", "link", "uploadedBy", "isOwner", "description"],
        {
          projectId,
          type: "claim details",
          periodId,
          partnerId,
          costCategoryId,
        },
      ),
    )
    .flat();

  const costCategories = mapToCostCategoryDtoArray(data?.salesforce?.uiapi?.query?.Acc_CostCategory__c?.edges ?? [], [
    "id",
    "name",
    "displayOrder",
    "type",
    "competitionType",
    "organisationType",
  ]);

  return { project, claimDocuments, costCategories };
};
