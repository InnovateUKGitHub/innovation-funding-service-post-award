import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { MonitoringReportCreateQuery } from "./__generated__/MonitoringReportCreateQuery.graphql";
import { monitoringReportCreateQuery } from "./MonitoringReportCreate.query";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { useNavigate } from "react-router-dom";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { clientsideApiClient } from "@ui/apiClient";
import { IRoutes } from "@ui/routing/routeConfig";
import { MonitoringReportStatus } from "@framework/constants/monitoringReportStatus";

export const useMonitoringReportCreateQuery = (projectId: ProjectId) => {
  const data = useLazyLoadQuery<MonitoringReportCreateQuery>(monitoringReportCreateQuery, {
    projectId,
  });

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const project = mapToProjectDto(projectNode, ["periodId"]);

  return { project, fragmentRef: data.salesforce.uiapi };
};

export type FormValues = {
  period: PeriodId;
  button_submit: "save-continue" | "save-return";
};

const getLink = (progress: boolean, projectId: ProjectId, id: MonitoringReportId, routes: IRoutes) => {
  if (!progress) {
    return routes.monitoringReportDashboard.getLink({ projectId, periodId: undefined });
  }
  return routes.monitoringReportWorkflow.getLink({
    projectId,
    id,
    mode: "prepare",
    step: 1,
  });
};

export const useOnMonitoringReportCreate = (projectId: ProjectId, routes: IRoutes) => {
  const navigate = useNavigate();
  return useOnUpdate<FormValues, Pick<MonitoringReportDto, "periodId" | "projectId" | "status" | "headerId">>({
    req: data =>
      clientsideApiClient.monitoringReports.createMonitoringReport({
        monitoringReportDto: { periodId: data.period, projectId, status: MonitoringReportStatus.Draft },
        submit: false, // just the create step, not the submit step
      }),
    onSuccess: (data, response) => {
      const link = getLink(data["button_submit"] === "save-continue", projectId, response.headerId, routes);
      return navigate(link.path);
    },
  });
};
