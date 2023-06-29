import { useLazyLoadQuery } from "react-relay";
import {
  MonitoringReportPeriodStepQuery,
  MonitoringReportPeriodStepQuery$data,
} from "./__generated__/MonitoringReportPeriodStepQuery.graphql";
import { monitoringReportPeriodStepQuery } from "./MonitoringReportPeriodStep.query";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";

type ProjectGql = GQL.NodeSelector<MonitoringReportPeriodStepQuery$data, "Acc_Project__c">;

export const useMonitoringReportPeriodStepQuery = (projectId: ProjectId) => {
  const data = useLazyLoadQuery<MonitoringReportPeriodStepQuery>(monitoringReportPeriodStepQuery, {
    projectId,
  });

  const { node: projectNode } = getFirstEdge<ProjectGql>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const project = mapToProjectDto(projectNode, ["title", "projectNumber"]);

  return { project };
};
