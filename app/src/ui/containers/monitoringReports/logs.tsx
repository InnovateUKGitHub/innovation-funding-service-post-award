import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import * as ACC from "../../components";
import * as Dtos from "../../../types";
import { Pending } from "@shared/pending";
import { MonitoringReportDashboardRoute } from "./dashboard";
import { ProjectRole } from "../../../types";

interface Params {
  projectId: string;
  id: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  report: Pending<Dtos.MonitoringReportDto>;
}

interface Callbacks {

}

class LogComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      report: this.props.report,
      project: this.props.project
    });
    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data.project, data.report)} />;
  }

  private renderContents(project: Dtos.ProjectDto, report: Dtos.MonitoringReportDto) {
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={MonitoringReportDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to monitoring reports</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        tabs={<ACC.MonitoringReports.Navigation projectId={this.props.projectId} id={this.props.id} currentRouteName={MonitoringReportLogRoute.routeName} />}
      />
    );
  }
}

const containerDefinition = ReduxContainer.for<Params, Data, Callbacks>(LogComponent);

export const MonitoringReportLog = containerDefinition.connect({
  withData: (state, props) => ({
    project: Selectors.getProject(props.projectId).getPending(state),
    report: Selectors.getMonitoringReport(props.projectId, props.id).getPending(state),
  }),
  withCallbacks: () => ({})
});

export const MonitoringReportLogRoute = containerDefinition.route({
  routeName: "monitoringReportLog",
  routePath: "/projects/:projectId/monitoring-reports/:id/logs",
  getParams: (r) => ({ projectId: r.params.projectId, id: r.params.id }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadMonitoringReport(params.projectId, params.id),
  ],
  container: MonitoringReportLog,
  getTitle: (state, params) => ({
    htmlTitle: "Logs - View monitoring report",
    displayTitle: "Monitoring report"
  }),
  accessControl: (auth, params, features) => features.monitoringReports && auth.forProject(params.projectId).hasRole(ProjectRole.MonitoringOfficer)
});
