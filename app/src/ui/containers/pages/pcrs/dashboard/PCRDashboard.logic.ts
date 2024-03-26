import { ProjectChangeRequestTypeSelector, ProjectTypeSelector } from "@gql/selectors/types";
import { PCRDashboardQuery, PCRDashboardQuery$data } from "./__generated__/PCRDashboardQuery.graphql";
import { useLazyLoadQuery } from "react-relay";
import { pcrDashboardQuery } from "./PCRDashboard.query";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPcrDtoArray } from "@gql/dtoMapper/mapPcrDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";

type Project = ProjectTypeSelector<PCRDashboardQuery$data>;
type ProjectChangeRequest = ProjectChangeRequestTypeSelector<Project>;

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

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["id", "projectNumber", "roles", "title", "status", "isActive"]);

  const pcrs = mapToPcrDtoArray(
    data?.salesforce?.uiapi?.query?.Acc_ProjectChangeRequest__c?.edges ?? [],
    ["status", "started", "lastUpdated", "id", "projectId", "requestNumber"],
    ["type", "id"],
    {},
  );

  return {
    project,
    pcrs,
    fragmentRef: data.salesforce.uiapi,
  };
};
export type { Project, ProjectChangeRequest };
