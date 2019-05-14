import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import * as ACC from "../../components";
import * as Dtos from "../../../types";
import { Pending } from "@shared/pending";
import { MonitoringReportDashboardRoute } from "./dashboard";
import { MonitoringReportStatusChangeDto, ProjectRole } from "../../../types";

interface Params {
  projectId: string;
  id: string;
  action: "details" | "prepare";
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  statusChanges: Pending<Dtos.MonitoringReportStatusChangeDto[]>;
}

interface Callbacks {}

class LogComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      statusChanges: this.props.statusChanges,
      project: this.props.project
    });
    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data.project, data.statusChanges)} />;
  }

  private renderContents(project: Dtos.ProjectDto, statusChanges: Dtos.MonitoringReportStatusChangeDto[]) {

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={MonitoringReportDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to monitoring reports</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        tabs={<ACC.MonitoringReports.Navigation projectId={this.props.projectId} id={this.props.id} />}
      >
        {this.renderLogTableSection(statusChanges)}
      </ACC.Page>
    );
  }

  private renderLogTableSection(statusChanges: Dtos.MonitoringReportStatusChangeDto[]) {
    const Table = ACC.TypedTable<MonitoringReportStatusChangeDto>();
    return (
      <ACC.Section>
        <Table.Table data={statusChanges} qa="monitoring-report-status-change-table">
          <Table.ShortDateTime header="Date and time" qa="created-date" value={x => x.createdDate}/>
          <Table.String header="Status update" qa="status-update" value={x => `${x.newStatus}`}/>
          <Table.String header="Name" qa="created-by" value={x => x.createdBy}/>
        </Table.Table>
      </ACC.Section>
    );
  }
}

const containerDefinition = ReduxContainer.for<Params, Data, Callbacks>(LogComponent);

export const MonitoringReportLog = containerDefinition.connect({
  withData: (state, props) => ({
    project: Selectors.getProject(props.projectId).getPending(state),
    statusChanges: Selectors.getMonitoringReportStatusChanges(props.id).getPending(state),
  }),
  withCallbacks: () => ({})
});

export const MonitoringReportLogRoute = containerDefinition.route({
  routeName: "monitoringReportLog",
  routePath: "/projects/:projectId/monitoring-reports/:id/:action/logs",
  getParams: (r) => ({ projectId: r.params.projectId, id: r.params.id, action: r.params.action }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadMonitoringReportStatusChanges(params.projectId, params.id),
  ],
  container: MonitoringReportLog,
  getTitle: (state, params) => ({
    htmlTitle: "Logs - View monitoring report",
    displayTitle: "Monitoring report"
  }),
  accessControl: (auth, params, features) => features.monitoringReports && auth.forProject(params.projectId).hasRole(ProjectRole.MonitoringOfficer)
});
