import { useLazyLoadQuery } from "react-relay";
import {
  MonitoringReportPeriodStepQuery,
  MonitoringReportPeriodStepQuery$data,
} from "./__generated__/MonitoringReportPeriodStepQuery.graphql";
import { monitoringReportPeriodStepQuery } from "./MonitoringReportPeriodStep.query";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { useNavigate } from "react-router";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { clientsideApiClient } from "@ui/apiClient";
import { IRoutes } from "@ui/routing/routeConfig";
import { isSubmittedBy } from "@framework/util/getSubmittingElementNameFromEvent";
import { mapToMonitoringReportDto } from "@gql/dtoMapper/mapMonitoringReportDto";
import { MonitoringReportStatus } from "@framework/constants/monitoringReportStatus";
import { SyntheticEvent } from "react";

type ProjectGql = GQL.NodeSelector<MonitoringReportPeriodStepQuery$data, "Acc_Project__c">;

export const useMonitoringReportPeriodStepQuery = (projectId: ProjectId, monitoringReportId: MonitoringReportId) => {
  const data = useLazyLoadQuery<MonitoringReportPeriodStepQuery>(
    monitoringReportPeriodStepQuery,
    {
      projectId,
      monitoringReportId,
    },
    {
      fetchPolicy: "network-only",
    },
  );

  const { node: projectNode } = getFirstEdge<ProjectGql>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: monitoringReportNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_MonitoringAnswer__c?.edges);
  const project = mapToProjectDto(projectNode, ["title", "projectNumber", "periodId"]);
  const monitoringReport = mapToMonitoringReportDto(monitoringReportNode, ["headerId", "periodId"]);

  return { project, monitoringReport };
};

export type FormValues = { period: PeriodId };

const getLink = (progress: boolean, projectId: ProjectId, id: MonitoringReportId, routes: IRoutes) => {
  if (!progress) {
    return routes.monitoringReportDashboard.getLink({
      projectId,
      periodId: undefined,
    });
  }
  return routes.monitoringReportWorkflow.getLink({
    projectId,
    id,
    mode: "prepare",
    step: 1,
  });
};

export const useOnMonitoringReportUpdatePeriodStep = (
  projectId: ProjectId,
  headerId: MonitoringReportId,
  routes: IRoutes,
) => {
  const navigate = useNavigate();
  return useOnUpdate<FormValues, Pick<MonitoringReportDto, "periodId" | "projectId" | "status" | "headerId">>({
    req: data =>
      clientsideApiClient.monitoringReports.saveMonitoringReport({
        monitoringReportDto: {
          periodId: data.period,
          projectId,
          headerId,
          status: MonitoringReportStatus.Draft,
        },
        submit: false, // just saving an update
      }),

    onSuccess: ({ response }, submitEvent: SyntheticEvent<HTMLButtonElement, SubmitEvent>) => {
      const link = getLink(isSubmittedBy(submitEvent, "button_save-continue"), projectId, response.headerId, routes);
      return navigate(link.path);
    },
  });
};
