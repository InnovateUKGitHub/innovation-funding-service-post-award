import { useLazyLoadQuery } from "react-relay";
import { clientsideApiClient } from "@ui/apiClient";
import { MonitoringReportDeleteQuery } from "./__generated__/MonitoringReportDeleteQuery.graphql";
import { monitoringReportDeleteQuery } from "./MonitoringReportDelete.query";
import { useNavigate } from "react-router-dom";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { IRoutes } from "@ui/routing/routeConfig";

export const useMonitoringReportDeleteQuery = (projectId: ProjectId) => {
  const data = useLazyLoadQuery<MonitoringReportDeleteQuery>(monitoringReportDeleteQuery, {
    projectId,
  });

  return { fragmentRef: data.salesforce.uiapi };
};

export const useOnMonitoringReportDelete = (
  projectId: ProjectId,
  monitoringReportId: MonitoringReportId,
  routes: IRoutes,
) => {
  const navigate = useNavigate();

  return useOnUpdate<EmptyObject, boolean>({
    req: () =>
      clientsideApiClient.monitoringReports.deleteMonitoringReport({
        reportId: monitoringReportId,
        projectId,
      }),

    onSuccess: () => {
      navigate(routes.monitoringReportDashboard.getLink({ projectId, periodId: undefined }).path);
    },
  });
};
