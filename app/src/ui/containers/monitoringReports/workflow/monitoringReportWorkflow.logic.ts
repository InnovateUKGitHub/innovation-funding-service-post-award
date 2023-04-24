import { useLazyLoadQuery } from "react-relay";
import {
  MonitoringReportWorkflowQuery,
  MonitoringReportWorkflowQuery$data,
} from "./__generated__/MonitoringReportWorkflowQuery.graphql";
import { monitoringReportWorkflowQuery } from "./MonitoringReportWorkflow.query";
import { mapToFullMonitoringReport, mapToProjectDto } from "@gql/dtoMapper";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToMonitoringReportQuestionDtoArray } from "@gql/dtoMapper/mapMonitoringReportQuestions";

type ProjectGql = GQL.NodeSelector<MonitoringReportWorkflowQuery$data, "Acc_Project__c">;

export const useMonitoringReportWorkflowQuery = (
  projectId: ProjectId,
  monitoringReportId: MonitoringReportId,
  fetchKey?: number,
  // refreshedQueryOptions: { fetchKey: number; fetchPolicy: "store-only" } | undefined,
) => {
  const data = useLazyLoadQuery<MonitoringReportWorkflowQuery>(
    monitoringReportWorkflowQuery,
    {
      projectId,
      monitoringReportId,
    },
    { fetchPolicy: "network-only", fetchKey },
  );

  const { node: projectNode } = getFirstEdge<ProjectGql>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const project = mapToProjectDto(projectNode, ["id", "title", "projectNumber"]);

  const questions = mapToMonitoringReportQuestionDtoArray(
    data?.salesforce?.uiapi?.query?.Acc_MonitoringQuestion__c?.edges ?? [],
    ["description", "displayOrder", "id", "isScored", "options", "title", "isActive"],
  );

  const report = mapToFullMonitoringReport(
    data?.salesforce?.uiapi?.query?.Acc_MonitoringAnswer__c?.edges ?? [],
    [
      "headerId",
      "endDate",
      "lastUpdated",
      "periodId",
      "startDate",
      "statusName",
      "projectId",
      "status",
      "addComments",
      "questions",
    ],
    { questions },
  );

  return { project, report };
};
