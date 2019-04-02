import React from "react";
import { LoadingStatus, Pending } from "../../../shared/pending";
import * as Dtos from "../../../types";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as Actions from "../../redux/actions";
import * as ACC from "../../components";
import * as Selectors from "../../redux/selectors";
import { PrepareMonitoringReportRoute } from "./prepareMonitoringReport";
import { MonitoringReportDetailsRoute } from "./details";
import { ProjectRole } from "../../../types";

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
  render() {
    const combined = Pending.combine({
      currentReports: this.props.reports.then(x => (x || []).filter(y => y.status === "Draft")),
      previousReports: this.props.reports.then(x => (x || []).filter(y => y.status !== "Draft")),
      project: this.props.project,
      partners: this.props.partners
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data.project, data.partners, data.currentReports, data.previousReports)} />;
  }

  private renderContents(project: Dtos.ProjectDto, partners: Dtos.PartnerDto[], currentReports: Dtos.MonitoringReportSummaryDto[], previousReports: Dtos.MonitoringReportSummaryDto[]) {
    return (
      <ACC.ProjectOverviewPage
        selectedTab={MonitoringReportDashboardRoute.routeName}
        project={project}
        partners={partners}
      >
        <ACC.Section title={"Current report"}>
          {currentReports.length ? this.renderTable(project, currentReports, "current") : null}
          {!currentReports.length ? <ACC.Renderers.SimpleString>There are no reports due</ACC.Renderers.SimpleString> : null}
        </ACC.Section>
        <ACC.Section title={"Previous reports"}>
          {previousReports.length ? this.renderTable(project, previousReports, "previous") : null}
          {!previousReports.length ? <ACC.Renderers.SimpleString>There are no previous reports</ACC.Renderers.SimpleString> : null}
        </ACC.Section>
      </ACC.ProjectOverviewPage>
    );
  }

  private renderTable(project: Dtos.ProjectDto, reports: Dtos.MonitoringReportSummaryDto[], section: "current" | "previous") {
    const ReportsTable = ACC.TypedTable<Dtos.MonitoringReportSummaryDto>();

    return (
      <ReportsTable.Table data={reports} qa={`${section}-reports-table`} bodyRowFlag={x => section === "current" ? "info": null}>
        {section === "current" ? <ReportsTable.Custom
          paddingRight="0px"
          header=""
          qa="edit-icon"
          value={(x) => x.status === "Draft" ? <img style={{ height: "19px" }} src="/assets/images/icon-edit.png" /> : null}
        /> : null}
        <ReportsTable.Custom header={`Period`} qa="period" value={x => <ACC.PeriodTitle periodId={x.periodId} periodStartDate={x.startDate} periodEndDate={x.endDate} />} />
        <ReportsTable.String header={`Status`} qa="status" value={x => x.status} />
        <ReportsTable.ShortDate header={`Date of last update`} qa="dateUpdated" value={x => x.lastUpdated} />
        <ReportsTable.Custom header="" qa="link" value={x => this.renderLink(project, x)} />
      </ReportsTable.Table>
    );
  }

  private renderLink(project: Dtos.ProjectDto, report: Dtos.MonitoringReportSummaryDto) {
    if (report.status === "Draft") {
      return <ACC.Link route={PrepareMonitoringReportRoute.getLink({ projectId: project.id, periodId: report.periodId })}>Edit report</ACC.Link>;
    }
    return <ACC.Link route={MonitoringReportDetailsRoute.getLink({ projectId: project.id, periodId: report.periodId })}>View report</ACC.Link>;
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
  accessControl: (auth, params) => auth.for(params.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer)
});
