import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { MonitoringReportCreateQuery } from "./__generated__/MonitoringReportCreateQuery.graphql";
import { monitoringReportCreateQuery } from "./MonitoringReportCreate.query";

export const useMonitoringReportCreateQuery = (projectId: ProjectId) => {
  const data = useLazyLoadQuery<MonitoringReportCreateQuery>(monitoringReportCreateQuery, {
    projectId,
  });

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const project = mapToProjectDto(projectNode, ["title", "projectNumber"]);

  return { project };
};
