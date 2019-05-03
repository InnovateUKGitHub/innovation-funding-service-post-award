import * as Selectors from "../../redux/selectors";
import React from "react";
import * as Dtos from "../../../types";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as Actions from "../../redux/actions";
import * as ACC from "../../components";
import { Pending } from "../../../shared/pending";
import { MonitoringReportCreateRoute, MonitoringReportPrepareRoute } from "./prepare";
import { MonitoringReportViewRoute } from "./details";
import { ProjectRole } from "../../../types";
import { ProjectDashboardRoute } from "@ui/containers";
import { MonitoringReportStatus } from "@framework/types/constants/monitoringReportStatus";

interface Params {
  projectId: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  partners: Pending<Dtos.PartnerDto[]>;
  reports: Pending<Dtos.MonitoringReportSummaryDto[]>;
}

interface Callbacks {

}

class DashboardComponent extends ContainerBase<Params, Data, Callbacks> {
  private editStatuses = [MonitoringReportStatus.New, MonitoringReportStatus.Draft, MonitoringReportStatus.Queried];
  private currentStatuses = [MonitoringReportStatus.New, MonitoringReportStatus.Draft, MonitoringReportStatus.Queried, MonitoringReportStatus.AwaitingApproval];

  render() {
    const combined = Pending.combine({
      reports: this.props.reports,
      project: this.props.project,
      partners: this.props.partners
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data.project, data.partners, data.reports)} />;
  }

  private renderContents(project: Dtos.ProjectDto, partners: Dtos.PartnerDto[], reports: Dtos.MonitoringReportSummaryDto[]) {
    // loop though reports splitting them into open or archived
    const inital = { open: [], archived: [] };
    const reportSections = reports.reduce<{ open: Dtos.MonitoringReportSummaryDto[], archived: Dtos.MonitoringReportSummaryDto[] }>((result, report) => {
        if (this.currentStatuses.indexOf(report.status) > -1) {
          result.open.push(report);
        }
        else {
          result.archived.push(report);
        }
        return result;
      },
      inital
    );

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={ProjectDashboardRoute.getLink({})}>Back to all projects</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title pageTitle="View project" project={project} />}
        tabs={<ACC.Projects.ProjectNavigation project={project} currentRoute={MonitoringReportDashboardRoute.routeName} partners={partners} />}
      >
        <ACC.Link route={MonitoringReportCreateRoute.getLink({ projectId: this.props.projectId })} className="govuk-button">Create new</ACC.Link>
        <ACC.Section title={"Open"}>
          {reportSections.open.length ? this.renderTable(project, reportSections.open, "current") : null}
          {!reportSections.open.length ? <ACC.Renderers.SimpleString>There are no open reports.</ACC.Renderers.SimpleString> : null}
        </ACC.Section>
        <ACC.Section title={"Archived"}>
          {reportSections.archived.length ? this.renderTable(project, reportSections.archived, "previous") : null}
          {!reportSections.archived.length ? <ACC.Renderers.SimpleString>There are no archived reports.</ACC.Renderers.SimpleString> : null}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderTable(project: Dtos.ProjectDto, reports: Dtos.MonitoringReportSummaryDto[], section: "current" | "previous") {
    const ReportsTable = ACC.TypedTable<Dtos.MonitoringReportSummaryDto>();

    return (
      <ReportsTable.Table
        data={reports}
        bodyRowFlag={x => section !== "current" ? null : this.editStatuses.indexOf(x.status) >= 0 ? "edit" : null}
        qa={`${section}-reports-table`}
      >
        <ReportsTable.String header={`Title`} qa="title" value={x => x.title} />
        <ReportsTable.Number header={`Period`} qa="period" value={x => x.periodId} />
        <ReportsTable.String header={`Status`} qa="status" value={x => x.statusName} />
        <ReportsTable.ShortDateTime header={`Last updated`} qa="dateUpdated" value={x => x.lastUpdated} />
        <ReportsTable.Custom header="" qa="link" value={x => this.renderLink(project, x)} />
      </ReportsTable.Table>
    );
  }

  private renderLink(project: Dtos.ProjectDto, report: Dtos.MonitoringReportSummaryDto) {
    if (this.editStatuses.indexOf(report.status) > -1) {
      return <ACC.Link route={MonitoringReportPrepareRoute.getLink({ projectId: project.id, id: report.headerId })}>Edit report</ACC.Link>;
    }
    return <ACC.Link route={MonitoringReportViewRoute.getLink({ projectId: project.id, id: report.headerId })}>View report</ACC.Link>;
  }
}

const containerDefinition = ReduxContainer.for<Params, Data, Callbacks>(DashboardComponent);

export const MonitoringReportDashboard = containerDefinition.connect({
  withData: (state, props) => {
    return {
      project: Selectors.getProject(props.projectId).getPending(state),
      partners: Selectors.findPartnersByProject(props.projectId).getPending(state),
      reports: Selectors.getAllMonitoringReports(props.projectId).getPending(state),
    };
  },
  withCallbacks: () => {
    return {};
  }
});

export const MonitoringReportDashboardRoute = containerDefinition.route({
  routeName: "monitoringReportDashboard",
  routePath: "/projects/:projectId/monitoring-reports",
  getParams: (r) => ({ projectId: r.params.projectId, periodId: parseInt(r.params.periodId, 10) }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPartnersForProject(params.projectId),
    Actions.loadMonitoringReports(params.projectId)
  ],
  container: MonitoringReportDashboard,
  accessControl: (auth, params, features) => features.monitoringReports && auth.forProject(params.projectId).hasRole(ProjectRole.MonitoringOfficer)
});
