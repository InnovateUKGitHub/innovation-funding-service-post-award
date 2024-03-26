import { useLazyLoadQuery } from "react-relay";
import { MonitoringReportPeriodStepQuery } from "./__generated__/MonitoringReportPeriodStepQuery.graphql";
import { monitoringReportPeriodStepQuery } from "./MonitoringReportPeriodStep.query";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { useNavigate } from "react-router-dom";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { clientsideApiClient } from "@ui/apiClient";
import { IRoutes } from "@ui/routing/routeConfig";
import { mapToMonitoringReportDto } from "@gql/dtoMapper/mapMonitoringReportDto";
import { MonitoringReportStatus } from "@framework/constants/monitoringReportStatus";

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

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: monitoringReportNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_MonitoringAnswer__c?.edges);
  const project = mapToProjectDto(projectNode, ["title", "projectNumber", "periodId", "isActive"]);
  const monitoringReport = mapToMonitoringReportDto(monitoringReportNode, ["headerId", "periodId"]);

  return { project, monitoringReport };
};

export type FormValues = { period: PeriodId; button_submit: string };

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
    onSuccess: (data, response) => {
      const link = getLink(data["button_submit"] === "save-continue", projectId, response.headerId, routes);
      return navigate(link.path);
    },
  });
};
