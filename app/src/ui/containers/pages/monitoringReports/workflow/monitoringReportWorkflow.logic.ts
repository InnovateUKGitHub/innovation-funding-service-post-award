import { useLazyLoadQuery } from "react-relay";
import { MonitoringReportWorkflowQuery } from "./__generated__/MonitoringReportWorkflowQuery.graphql";
import { monitoringReportWorkflowQuery } from "./MonitoringReportWorkflow.query";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToMonitoringReportQuestionDtoArray } from "@gql/dtoMapper/mapMonitoringReportQuestions";
import { mapToFullMonitoringReport } from "@gql/dtoMapper/mapMonitoringReportDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { IRoutes } from "@ui/routing/routeConfig";
import { useNavigate } from "react-router";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { clientsideApiClient } from "@ui/apiClient";
import { isSubmittedBy } from "@framework/util/getSubmittingElementNameFromEvent";
import { MonitoringReportWorkflowDef, getForwardLink } from "./monitoringReportWorkflowDef";
import { Dispatch, SetStateAction, SyntheticEvent } from "react";

export const useMonitoringReportWorkflowQuery = (
  projectId: ProjectId,
  monitoringReportId: MonitoringReportId,
  fetchKey?: number,
) => {
  const data = useLazyLoadQuery<MonitoringReportWorkflowQuery>(
    monitoringReportWorkflowQuery,
    {
      projectId,
      monitoringReportId,
    },
    { fetchPolicy: "network-only", fetchKey },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
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

export type FormValues = {
  questions: { optionId: string | null; comments: string | null }[];
};

export const useOnMonitoringReportUpdateWorkflow = (
  projectId: ProjectId,
  headerId: MonitoringReportId,
  mode: "prepare" | "view",
  report: Pick<
    MonitoringReportDto,
    | "headerId"
    | "endDate"
    | "lastUpdated"
    | "periodId"
    | "startDate"
    | "statusName"
    | "projectId"
    | "status"
    | "addComments"
    | "questions"
  >,
  workflow: MonitoringReportWorkflowDef,
  routes: IRoutes,
  setFetchKey: Dispatch<SetStateAction<number>>,
) => {
  const navigate = useNavigate();
  return useOnUpdate<FormValues, Pick<MonitoringReportDto, "periodId" | "projectId" | "status" | "headerId">>({
    req: data =>
      clientsideApiClient.monitoringReports.saveMonitoringReport({
        monitoringReportDto: {
          ...report,
          questions: report.questions.map((question, index) => Object.assign({}, question, data?.questions?.[index])),
        },
        submit: false, // just saving an update
      }),

    onSuccess: (_, submitEvent: SyntheticEvent<HTMLButtonElement, SubmitEvent>) => {
      const link = getForwardLink({
        mode,
        projectId,
        id: headerId,
        progress: isSubmittedBy("button_save-continue", submitEvent),
        routes,
        workflow,
      });
      setFetchKey(s => s + 1);
      if (link) navigate(link.path);
      return;
    },
  });
};
