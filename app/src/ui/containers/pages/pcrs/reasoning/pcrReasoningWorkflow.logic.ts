import { useLazyLoadQuery } from "react-relay";
import { pcrReasoningWorkflowQuery } from "./PcrReasoningWorkflow.query";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPcrDtoArray } from "@gql/dtoMapper/mapPcrDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { PcrReasoningWorkflowQuery } from "./__generated__/PcrReasoningWorkflowQuery.graphql";
import { head } from "lodash";
import { getEditableItemTypes } from "@gql/dtoMapper/getEditableItemTypes";

export const usePcrReasoningQuery = (projectId: ProjectId, pcrId: PcrId, fetchKey: number) => {
  const data = useLazyLoadQuery<PcrReasoningWorkflowQuery>(
    pcrReasoningWorkflowQuery,
    {
      projectId,
      pcrId,
    },
    {
      fetchPolicy: "store-and-network",
      fetchKey,
    },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["title", "status", "projectNumber"]);

  const pcr = head(
    mapToPcrDtoArray(
      projectNode?.Project_Change_Requests__r?.edges ?? [],
      ["id", "projectId", "requestNumber", "reasoningComments"],
      ["shortName", "id", "type", "typeName"],
      {},
    ),
  );

  if (!pcr) throw new Error(`Could not find pcr matching ${pcrId}`);

  const editableItemTypes = getEditableItemTypes(pcr);
  return {
    project,
    pcr,
    editableItemTypes,
  };
};
