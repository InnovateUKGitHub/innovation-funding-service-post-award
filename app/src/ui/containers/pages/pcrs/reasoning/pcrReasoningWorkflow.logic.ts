import { useLazyLoadQuery } from "react-relay";
import { pcrReasoningWorkflowQuery } from "./PcrReasoningWorkflow.query";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPcrDtoArray } from "@gql/dtoMapper/mapPcrDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { PcrReasoningWorkflowQuery } from "./__generated__/PcrReasoningWorkflowQuery.graphql";
import { head } from "lodash";
import { getEditableItemTypes } from "@gql/dtoMapper/getEditableItemTypes";
import { mapToProjectDocumentSummaryDtoArray } from "@gql/dtoMapper/mapDocumentsDto";
import { RefreshedQueryOptions } from "@gql/hooks/useRefreshQuery";

export const usePcrReasoningQuery = (
  projectId: ProjectId,
  pcrId: PcrId,
  fetchKey: number,
  refreshedQueryOptions: RefreshedQueryOptions,
) => {
  const data = useLazyLoadQuery<PcrReasoningWorkflowQuery>(
    pcrReasoningWorkflowQuery,
    {
      projectId,
      pcrId,
    },
    refreshedQueryOptions,
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["title", "status", "projectNumber"]);

  const pcrGql = data?.salesforce?.uiapi?.query?.Acc_ProjectChangeRequest__c?.edges ?? [];
  const pcr = head(
    mapToPcrDtoArray(
      pcrGql,
      ["id", "projectId", "requestNumber", "reasoningComments"],
      ["shortName", "id", "type", "typeName"],
      {},
    ),
  );

  if (!pcr) throw new Error(`Could not find pcr matching ${pcrId}`);

  const documents = pcrGql
    .filter(x => x?.node?.RecordType?.Name?.value === "Request Header")
    .flatMap(x =>
      mapToProjectDocumentSummaryDtoArray(
        x?.node?.ContentDocumentLinks?.edges ?? [],
        ["id", "dateCreated", "fileSize", "fileName", "link", "uploadedBy", "isOwner", "description"],
        {
          projectId,
          currentUser: { email: data?.currentUser?.email ?? "unknown email" },
          type: "pcr",
          pcrId,
        },
      ),
    );

  const editableItemTypes = getEditableItemTypes(pcr);
  return {
    project,
    pcr,
    editableItemTypes,
    documents,
  };
};
