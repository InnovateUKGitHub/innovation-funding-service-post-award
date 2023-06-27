import { useLazyLoadQuery } from "react-relay";
import { pcrDeleteQuery } from "./PcrDelete.query";
import { PcrDeleteQuery } from "./__generated__/PcrDeleteQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";

import { mapToPcrDtoArray } from "@gql/dtoMapper/mapPcrDto";

export const usePcrDeleteQuery = (projectId: ProjectId, pcrId: PcrId) => {
  const data = useLazyLoadQuery<PcrDeleteQuery>(pcrDeleteQuery, { projectId, pcrId }, { fetchPolicy: "network-only" });

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["projectNumber", "status", "title"]);

  const pcr = mapToPcrDtoArray(
    projectNode?.Project_Change_Requests__r?.edges ?? [],
    ["started", "lastUpdated", "requestNumber"],
    ["shortName"],
    {},
  )[0];

  return { project, pcr };
};
