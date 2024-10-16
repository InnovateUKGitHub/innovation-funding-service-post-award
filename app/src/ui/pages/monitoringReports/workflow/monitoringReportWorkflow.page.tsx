import { ProjectRolePermissionBits } from "@framework/constants/project";
import { defineRoute } from "@ui/app/containerBase";
import { MonitoringReportWorkflow } from "./MonitoringReportWorkflow";

export type MonitoringReportWorkflowParams = {
  projectId: ProjectId;
  id: MonitoringReportId;
  mode: "view" | "prepare";
  step: number | undefined;
};

export const MonitoringReportWorkflowRoute = defineRoute<{
  projectId: ProjectId;
  id: MonitoringReportId;
  mode: "view" | "prepare";
  step: number | undefined;
}>({
  allowRouteInActiveAccess: true,
  routeName: "monitoringReportPrepare",
  routePath: "/projects/:projectId/monitoring-reports/:id/:mode",
  routePathWithQuery: "/projects/:projectId/monitoring-reports/:id/:mode?:step",
  container: MonitoringReportWorkflow,
  getParams: r => ({
    projectId: r.params.projectId as ProjectId,
    id: r.params.id as MonitoringReportId,
    mode: r.params.mode as "view" | "prepare",
    step: parseInt(r.params.step, 10),
  }),
  accessControl: (auth, { projectId }) =>
    auth.forProject(projectId).hasRole(ProjectRolePermissionBits.MonitoringOfficer),
  getTitle: ({ params, content }) =>
    params.mode === "view"
      ? content.getTitleCopy(x => x.pages.monitoringReportsWorkflow.viewMode.title)
      : content.getTitleCopy(x => x.pages.monitoringReportsWorkflow.editMode.title),
});
