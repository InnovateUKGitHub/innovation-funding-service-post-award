import { ProjectChangeRequestTypeSelector, ProjectTypeSelector } from "@gql/selectors/types";
import { PCRDashboardQuery, PCRDashboardQuery$data } from "./__generated__/PCRDashboardQuery.graphql";
import { useLazyLoadQuery } from "react-relay";
import { pcrDashboardQuery } from "./PCRDashboard.query";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPcrDtoArray } from "@gql/dtoMapper/mapPcrDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";

type Project = ProjectTypeSelector<PCRDashboardQuery$data>;
type ProjectChangeRequest = ProjectChangeRequestTypeSelector<Project>;

type ProjectGQL = GQL.NodeSelector<PCRDashboardQuery$data, "Acc_Project__c">;

export const usePcrDashboardQuery = (projectId: ProjectId) => {
  const data = useLazyLoadQuery<PCRDashboardQuery>(
    pcrDashboardQuery,
    {
      projectId,
    },
    {
      fetchPolicy: "network-only",
      networkCacheConfig: {
        force: true,
      },
    },
  );

  const { node: projectNode } = getFirstEdge<ProjectGQL>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["id", "projectNumber", "roles", "title", "status"]);

  const pcrs = mapToPcrDtoArray(
    projectNode?.Project_Change_Requests__r?.edges ?? [],
    ["status", "statusName", "started", "lastUpdated", "id", "projectId", "requestNumber"],
    ["shortName"],
    {},
  );

  return {
    project,
    pcrs,
  };
};
export type { Project, ProjectChangeRequest };