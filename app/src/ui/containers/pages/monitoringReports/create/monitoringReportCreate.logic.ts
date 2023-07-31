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
import { isSubmittedBy } from "@framework/util/getSubmittingElementNameFromEvent";
import { SyntheticEvent } from "react";
import { MonitoringReportStatus } from "@framework/constants/monitoringReportStatus";

export const useMonitoringReportCreateQuery = (projectId: ProjectId) => {
  const data = useLazyLoadQuery<MonitoringReportCreateQuery>(monitoringReportCreateQuery, {
    projectId,
  });

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const project = mapToProjectDto(projectNode, ["title", "projectNumber", "periodId"]);

  return { project };
};

export type FormValues = {
  period: PeriodId;
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

    onSuccess: ({ response }, submitEvent: SyntheticEvent<HTMLButtonElement, SubmitEvent>) => {
      const link = getLink(isSubmittedBy("button_save-continue", submitEvent), projectId, response.headerId, routes);
      return navigate(link.path);
    },
  });
};
