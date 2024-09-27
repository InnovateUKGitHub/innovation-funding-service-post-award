import { useLazyLoadQuery } from "react-relay";
import { pcrScopeChangeWorkflowQuery } from "./PcrScopeChangeWorkflow.query";
import { PcrScopeChangeWorkflowQuery } from "./__generated__/PcrScopeChangeWorkflowQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";

export const useScopeChangeWorkflowQuery = (projectId: ProjectId, pcrItemId: PcrItemId, fetchKey: number) => {
  const data = useLazyLoadQuery<PcrScopeChangeWorkflowQuery>(
    pcrScopeChangeWorkflowQuery,
    {
      projectId,
      pcrItemId,
    },
    {
      fetchPolicy: "network-only",
      fetchKey,
    },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["projectNumber", "status", "title", "endDate", "startDate"]);

  const { node: pcrNode } = getFirstEdge(projectNode?.Project_Change_Requests__r?.edges ?? []);

  const pcrItem = mapPcrItemDto(
    pcrNode,
    [
      "id",
      "lastUpdated",
      "projectId",
      "requestNumber",
      "started",
      "status",
      "statusName",
      "projectSummary",
      "projectSummarySnapshot",
      "publicDescription",
      "publicDescriptionSnapshot",
      "type",
    ],
    {},
  );

  return { project, pcrItem };
};
