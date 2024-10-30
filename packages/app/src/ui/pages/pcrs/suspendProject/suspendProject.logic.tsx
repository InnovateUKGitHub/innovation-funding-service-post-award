import { useLazyLoadQuery } from "react-relay";
import { pcrSuspendProjectWorkflowQuery } from "./PcrSuspendProjectWorkflow.query";
import { PcrSuspendProjectWorkflowQuery } from "./__generated__/PcrSuspendProjectWorkflowQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";

export const usePcrSuspendProjectWorkflowQuery = (projectId: ProjectId, pcrItemId: PcrItemId, fetchKey: number) => {
  const data = useLazyLoadQuery<PcrSuspendProjectWorkflowQuery>(
    pcrSuspendProjectWorkflowQuery,
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

  const project = mapToProjectDto(projectNode, ["roles", "startDate", "endDate"]);

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
      "type",
      "suspensionEndDate",
      "suspensionStartDate",
    ],
    {},
  );

  return { project, pcrItem };
};
