import { ProjectRole } from "@framework/constants";
import { defineRoute } from "@ui/containers/containerBase";
import { MonitoringReportCreateContainer } from "./MonitoringReportCreateContainer";

export const MonitoringReportCreateRoute = defineRoute<{
  projectId: ProjectId;
}>({
  allowRouteInActiveAccess: true,
  routeName: "monitoringReportCreate",
  routePath: "/projects/:projectId/monitoring-reports/create",
  container: MonitoringReportCreateContainer,
  getParams: r => ({ projectId: r.params.projectId as ProjectId }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.monitoringReportsCreate.title),
});
