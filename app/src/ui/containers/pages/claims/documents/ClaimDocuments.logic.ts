import { ClaimKey } from "@framework/types/ClaimKey";
import { mapToClaimDto } from "@gql/dtoMapper/mapClaimDto";
import { mapToProjectDocumentSummaryDtoArray } from "@gql/dtoMapper/mapDocumentsDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { RefreshedQueryOptions } from "@gql/hooks/useRefreshQuery";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { claimDocumentsQuery } from "./ClaimDocuments.query";
import { ClaimDocumentsQuery } from "./__generated__/ClaimDocumentsQuery.graphql";

export const useClaimDocumentsQuery = (
  { projectId, partnerId, periodId }: ClaimKey,
  refreshedQueryOptions: RefreshedQueryOptions,
) => {
  const data = useLazyLoadQuery<ClaimDocumentsQuery>(
    claimDocumentsQuery,
    { projectId, partnerId, periodId },
    refreshedQueryOptions,
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: claimNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges);

  const project = mapToProjectDto(projectNode, [
    "id",
    "projectNumber",
    "title",
    "status",
    "roles",
    "impactManagementParticipation",
    "competitionType",
  ]);

  const claim = mapToClaimDto(
    claimNode,
    ["id", "isFinalClaim", "impactManagementParticipation", "isIarRequired", "pcfStatus"],
    {},
  );

  const claimDocuments = mapToProjectDocumentSummaryDtoArray(
    claimNode?.ContentDocumentLinks?.edges ?? [],
    ["id", "fileName", "fileSize", "link", "description", "dateCreated", "uploadedBy", "isOwner"],
    {
      projectId,
      partnerId,
      periodId: periodId as PeriodId,
      type: "claims",
    },
  );

  return { claim, project, claimDocuments };
};
