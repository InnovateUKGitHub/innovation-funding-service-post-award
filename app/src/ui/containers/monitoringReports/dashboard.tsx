import { MonitoringReportStatus } from "@framework/constants";
import React from "react";
import * as Dtos from "@framework/dtos";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { Pending } from "@shared/pending";
import { ILinkInfo, ProjectRole } from "@framework/types";
import * as ACC from "@ui/components";
import { StoresConsumer } from "@ui/redux";

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
        backLink={<ACC.Projects.ProjectBackLink project={project} routes={this.props.routes} />}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />
        <ACC.Renderers.SimpleString>You should submit reports for this project according to the schedule agreed with Innovate UK.</ACC.Renderers.SimpleString>
        <ACC.Link route={this.props.routes.monitoringReportCreate.getLink({ projectId: this.props.projectId })} className="govuk-button">Start a new report</ACC.Link>
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
        <ReportsTable.Custom header="Title" qa="title" value={x => <ACC.PeriodTitle periodId={x.periodId} periodStartDate={x.startDate} periodEndDate={x.endDate} />} />
        <ReportsTable.String header="Status" qa="status" value={x => x.statusName} />
        <ReportsTable.ShortDateTime header="Last updated" qa="dateUpdated" value={x => x.lastUpdated} />
        <ReportsTable.Custom header="Action" hideHeader={true} qa="link" value={x => this.renderLinks(x)} />
      </ReportsTable.Table>
    );
  }

  private renderLinks(report: Dtos.MonitoringReportSummaryDto) {
    const links: { route: ILinkInfo, text: string, qa: string; }[] = [];

    if (this.editStatuses.indexOf(report.status) > -1) {
      links.push({ route: this.props.routes.monitoringReportPrepare.getLink({ projectId: report.projectId, id: report.headerId }), text: "Edit report", qa: "editLink" });
    }
    else {
      links.push({ route: this.props.routes.monitoringReportSummary.getLink({ projectId: report.projectId, id: report.headerId, mode: "view" }), text: "View report", qa: "viewLink" });
    }

    if (report.status === MonitoringReportStatus.Draft) {
      links.push({ route: this.props.routes.monitoringReportDelete.getLink({ projectId: report.projectId, id: report.headerId }), text: "Delete report", qa: "deleteLink" });
    }

    return links.map((x, i) => <div key={i} data-qa={x.qa}><ACC.Link route={x.route}>{x.text}</ACC.Link></div>);
  }
}

const DashboardContainer = (props: Params & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <DashboardComponent
        project={stores.projects.getById(props.projectId)}
        partners={stores.partners.getPartnersForProject(props.projectId)}
        reports={stores.monitoringReports.getAllForProject(props.projectId)}
        {...props}
      />

    )}
  </StoresConsumer>
);

export const MonitoringReportDashboardRoute = defineRoute({
  routeName: "monitoringReportDashboard",
  routePath: "/projects/:projectId/monitoring-reports",
  getParams: (r) => ({ projectId: r.params.projectId, periodId: parseInt(r.params.periodId, 10) }),
  container: DashboardContainer,
  accessControl: (auth, params) => auth.forProject(params.projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: () => {
    return {
      htmlTitle: "Monitoring reports - View project",
      displayTitle: "Monitoring reports"
    };
  }
});
