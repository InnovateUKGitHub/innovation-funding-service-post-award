import { useLazyLoadQuery } from "react-relay";
import { MonitoringReportWorkflowQuery } from "./__generated__/MonitoringReportWorkflowQuery.graphql";
import { monitoringReportWorkflowQuery } from "./MonitoringReportWorkflow.query";
import { mapToMonitoringReportQuestionDtoArray } from "@gql/dtoMapper/mapMonitoringReportQuestions";
import { mapToFullMonitoringReport } from "@gql/dtoMapper/mapMonitoringReportDto";
import { IRoutes } from "@ui/routing/routeConfig";
import { useNavigate } from "react-router-dom";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { MonitoringReportDto, MonitoringReportQuestionDto } from "@framework/dtos/monitoringReportDto";
import { clientsideApiClient } from "@ui/apiClient";
import { MonitoringReportWorkflowDef, getForwardLink } from "./monitoringReportWorkflowDef";
import { Dispatch, SetStateAction } from "react";
import { mapToMonitoringReportStatusChangeDtoArray } from "@gql/dtoMapper/mapMonitoringReportStatusChange";
import { FormTypes } from "@ui/zod/FormTypes";

export const useMonitoringReportWorkflowQuery = (
  projectId: ProjectId,
  monitoringReportId: MonitoringReportId,
  fetchKey: number,
) => {
  const data = useLazyLoadQuery<MonitoringReportWorkflowQuery>(
    monitoringReportWorkflowQuery,
    {
      projectId,
      monitoringReportId,
    },
    { fetchPolicy: "network-only", fetchKey },
  );

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
      "questions",
      "status",
      "addComments",
    ],
    { questions },
  );

  const statusChanges = mapToMonitoringReportStatusChangeDtoArray(
    data?.salesforce?.uiapi?.query?.Acc_StatusChange__c?.edges ?? [],
    ["comments", "createdBy", "createdDate", "id", "newStatusLabel"],
  );

  return { report, statusChanges, fragmentRef: data.salesforce.uiapi };
};

export type FormValues = {
  periodId: PeriodId;
  questions: { optionId: string; comments: string; title: string }[];
  addComments: string;
  button_submit: "saveAndContinue" | "saveAndReturn" | "submit" | "saveAndReturnToSummary";
  form: FormTypes.MonitoringReportQuestion | FormTypes.MonitoringReportSummary;
};

const hasFormChanged = (
  data: FormValues,
  questions: MonitoringReportQuestionDto[],
  addComments: string | null | undefined,
) =>
  data?.addComments !== addComments ||
  questions.some(
    (question, i) =>
      (question.comments ?? "") !== (data.questions[i].comments ?? "") ||
      (question.optionId ?? "") !== (data.questions[i].optionId ?? ""),
  );

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
    | "projectId"
    | "questions"
    | "status"
    | "addComments"
  >,
  workflow: MonitoringReportWorkflowDef,
  routes: IRoutes,
  setFetchKey: Dispatch<SetStateAction<number>>,
) => {
  const navigate = useNavigate();
  return useOnUpdate<FormValues, Pick<MonitoringReportDto, "periodId" | "projectId" | "status" | "headerId">>({
    req: data => {
      const isFinalSubmit = data["button_submit"] === "submit";
      if (isFinalSubmit || hasFormChanged(data, report.questions, report.addComments)) {
        return clientsideApiClient.monitoringReports.saveMonitoringReport({
          monitoringReportDto: {
            ...report,
            addComments: data.addComments || report.addComments,
            questions: report.questions.map((question, index) => Object.assign({}, question, data?.questions?.[index])),
          },
          submit: isFinalSubmit,
        });
      } else {
        return Promise.resolve(report);
      }
    },

    onSuccess: data => {
      const link = getForwardLink({
        mode,
        projectId,
        id: headerId,
        progress: data["button_submit"] === "saveAndContinue",
        routes,
        workflow,
      });
      if (hasFormChanged(data, report.questions, report.addComments)) {
        // fetch new gql data if there is a change made
        setFetchKey(s => s + 1);
      }

      if (link) navigate(link.path);
      return;
    },
  });
};
