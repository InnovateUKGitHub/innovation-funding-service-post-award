import { useLazyLoadQuery } from "react-relay";
import {
  MonitoringReportDeleteQuery,
  MonitoringReportDeleteQuery$data,
} from "./__generated__/MonitoringReportDeleteQuery.graphql";
import { monitoringReportDeleteQuery } from "./MonitoringReportDelete.query";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";

type ProjectGql = GQL.NodeSelector<MonitoringReportDeleteQuery$data, "Acc_Project__c">;

export const useMonitoringReportDeleteQuery = (projectId: ProjectId) => {
  const data = useLazyLoadQuery<MonitoringReportDeleteQuery>(monitoringReportDeleteQuery, {
    projectId,
  });

  const { node: projectNode } = getFirstEdge<ProjectGql>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const project = mapToProjectDto(projectNode, ["title", "projectNumber"]);

  return { project };
};
