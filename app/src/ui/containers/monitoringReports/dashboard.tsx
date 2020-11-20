import { MonitoringReportStatus } from "@framework/constants";
import React from "react";
import * as Dtos from "@framework/dtos";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { Pending } from "@shared/pending";
import { ILinkInfo, ProjectRole } from "@framework/types";
import * as ACC from "@ui/components";
import { ContentConsumer, StoresConsumer } from "@ui/redux";
import { MonitoringReportsDashboardContent } from "@content/pages/monitoringReports/monitoringReportsDashboardContent";
import { ContentSelector } from "@content/content";
import { Content } from "@content/content";

interface Params {
  projectId: string;
}

interface Props {
  content: MonitoringReportsDashboardContent;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  partners: Pending<Dtos.PartnerDto[]>;
  reports: Pending<Dtos.MonitoringReportSummaryDto[]>;
}

interface Callbacks {

}

class DashboardComponent extends ContainerBase<Params&Props, Data, Callbacks> {
  private readonly editStatuses = [MonitoringReportStatus.New, MonitoringReportStatus.Draft, MonitoringReportStatus.Queried];
  private readonly currentStatuses = [MonitoringReportStatus.New, MonitoringReportStatus.Draft, MonitoringReportStatus.Queried, MonitoringReportStatus.AwaitingApproval];

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
        <ACC.ValidationMessage
          qa="guidance-message"
          messageType="info"
          message={x => x.monitoringReportsDashboard.messages.reportsSubmissionGuidance}
        />

        <ACC.Link route={this.props.routes.monitoringReportCreate.getLink({ projectId: this.props.projectId })} className="govuk-button"><ACC.Content value={(x) => x.monitoringReportsDashboard.buttonNewMonitoringReport}/></ACC.Link>
        <ACC.Section title={ < ACC.Content value={x => x.monitoringReportsDashboard.sectionTitleOpen} /> } >
          {reportSections.open.length ? this.renderTable(project, reportSections.open, "current") : null}

          {!reportSections.open.length ? <ACC.Renderers.SimpleString><ACC.Content value={(x) => x.monitoringReportsDashboard.messages.noOpenReportsMessage}/></ACC.Renderers.SimpleString> : null}
        </ACC.Section>
        <ACC.Section title={ < ACC.Content value={x => x.monitoringReportsDashboard.sectionTitleArchived} /> } >
          {reportSections.archived.length ? this.renderTable(project, reportSections.archived, "previous") : null}
          {!reportSections.archived.length ? <ACC.Renderers.SimpleString><ACC.Content value={(x) => x.monitoringReportsDashboard.messages.noArchivedReportsMessage}/></ACC.Renderers.SimpleString> : null}
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
    const links: { route: ILinkInfo, titleContent: ContentSelector, qa: string; }[] = [];

    if (this.editStatuses.indexOf(report.status) > -1) {
      links.push({ route: this.props.routes.monitoringReportWorkflow.getLink({ projectId: report.projectId, id: report.headerId, mode: "prepare", step: undefined }), titleContent: (content) => content.monitoringReportsDashboard.linkEditMonitoringReport, qa: "editLink" });
    }
    else {
      links.push({ route: this.props.routes.monitoringReportWorkflow.getLink({ projectId: report.projectId, id: report.headerId, mode: "view", step: undefined }), titleContent: (content) => content.monitoringReportsDashboard.linkViewMonitoringReport, qa: "viewLink" });
    }

    if (report.status === MonitoringReportStatus.Draft) {
      links.push({ route: this.props.routes.monitoringReportDelete.getLink({ projectId: report.projectId, id: report.headerId }), titleContent: (content) => content.monitoringReportsDashboard.linkDeleteMonitoringReport, qa: "deleteLink" });
    }

    return links.map((x, i) => <div key={i} data-qa={x.qa}><ACC.Link route={x.route}><ACC.Content value={x.titleContent}/></ACC.Link></div>);
  }
}

const DashboardContainer = (props: Params & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <ContentConsumer>{
        content => (
        <DashboardComponent
          project={stores.projects.getById(props.projectId)}
          partners={stores.partners.getPartnersForProject(props.projectId)}
          reports={stores.monitoringReports.getAllForProject(props.projectId)}
          content={content.monitoringReportsDashboard}
          {...props}
        />
        )}
      </ContentConsumer>
    )}
  </StoresConsumer>
);

export const MonitoringReportDashboardRoute = defineRoute({
  routeName: "monitoringReportDashboard",
  routePath: "/projects/:projectId/monitoring-reports",
  getParams: (r) => ({ projectId: r.params.projectId, periodId: parseInt(r.params.periodId, 10) }),
  container: DashboardContainer,
  accessControl: (auth, params) => auth.forProject(params.projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: ({content}) => content.monitoringReportsDashboard.title(),
});
