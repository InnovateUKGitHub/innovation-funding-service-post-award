import { MonitoringReportStatus } from "@framework/constants";
import * as Dtos from "@framework/dtos";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { Pending } from "@shared/pending";
import { ILinkInfo, ProjectRole } from "@framework/types";
import * as ACC from "@ui/components";
import { useContent } from "@ui/hooks";
import { useStores } from "@ui/redux";
import { IRoutes } from "@ui/routing";
import type { ContentSelector } from "@copy/type";

interface MonitoringReportDashboardParams {
  projectId: string;
}

interface MonitoringReportDashboardData {
  project: Pending<Dtos.ProjectDto>;
  partners: Pending<Dtos.PartnerDto[]>;
  reports: Pending<Dtos.MonitoringReportSummaryDto[]>;
  routes: IRoutes;
  messages: string[];
}

const MonitoringReportDashboard = (
  props: MonitoringReportDashboardParams & MonitoringReportDashboardData & BaseProps,
) => {
  const { getContent } = useContent();

  const editStatuses = [MonitoringReportStatus.New, MonitoringReportStatus.Draft, MonitoringReportStatus.Queried];
  const currentStatuses = [
    MonitoringReportStatus.New,
    MonitoringReportStatus.Draft,
    MonitoringReportStatus.Queried,
    MonitoringReportStatus.AwaitingApproval,
  ];

  const combined = Pending.combine({
    reports: props.reports,
    project: props.project,
    partners: props.partners,
  });

  const renderContents = (project: Dtos.ProjectDto, reports: Dtos.MonitoringReportSummaryDto[]) => {
    // loop though reports splitting them into open or archived
    const initial = { open: [], archived: [] };
    const reportSections = reports.reduce<{
      open: Dtos.MonitoringReportSummaryDto[];
      archived: Dtos.MonitoringReportSummaryDto[];
    }>((result, report) => {
      if (currentStatuses.indexOf(report.status) > -1) {
        result.open.push(report);
      } else {
        result.archived.push(report);
      }
      return result;
    }, initial);

    return (
      <ACC.Page
        backLink={<ACC.Projects.ProjectBackLink routes={props.routes} projectId={project.id} />}
        pageTitle={<ACC.Projects.Title {...project} />}
        project={project}
      >
        <ACC.Renderers.Messages messages={props.messages} />
        <ACC.ValidationMessage
          qa="guidance-message"
          messageType="info"
          message={x => x.monitoringReportsMessages.reportsSubmissionGuidance}
        />

        <ACC.Link
          route={props.routes.monitoringReportCreate.getLink({ projectId: props.projectId })}
          className="govuk-button"
        >
          <ACC.Content value={x => x.pages.monitoringReportsDashboard.buttonNewMonitoringReport} />
        </ACC.Link>

        <ACC.Section title={<ACC.Content value={x => x.pages.monitoringReportsDashboard.sectionTitleOpen} />}>
          {reportSections.open.length ? (
            renderTable(reportSections.open, "current")
          ) : (
            <ACC.Renderers.SimpleString>
              <ACC.Content value={x => x.monitoringReportsMessages.noOpenReportsMessage} />
            </ACC.Renderers.SimpleString>
          )}
        </ACC.Section>

        <ACC.Section title={<ACC.Content value={x => x.pages.monitoringReportsDashboard.sectionTitleArchived} />}>
          {reportSections.archived.length ? (
            renderTable(reportSections.archived, "previous")
          ) : (
            <ACC.Renderers.SimpleString>
              <ACC.Content value={x => x.monitoringReportsMessages.noArchivedReportsMessage} />
            </ACC.Renderers.SimpleString>
          )}
        </ACC.Section>
      </ACC.Page>
    );
  };

  const renderTable = (reports: Dtos.MonitoringReportSummaryDto[], section: "current" | "previous") => {
    const ReportsTable = ACC.TypedTable<Dtos.MonitoringReportSummaryDto>();

    return (
      <ReportsTable.Table
        data={reports}
        bodyRowFlag={x => (section !== "current" ? null : editStatuses.indexOf(x.status) >= 0 ? "edit" : null)}
        qa={`${section}-reports-table`}
      >
        <ReportsTable.Custom
          header={getContent(x => x.pages.monitoringReportsDashboard.headerTitle)}
          qa="title"
          value={report => (
            <ACC.PeriodTitle
              periodId={report.periodId}
              periodStartDate={report.startDate}
              periodEndDate={report.endDate}
            />
          )}
        />
        <ReportsTable.String
          header={getContent(x => x.pages.monitoringReportsDashboard.headerStatus)}
          qa="status"
          value={report => report.statusName}
        />
        <ReportsTable.ShortDateTime
          header={getContent(x => x.pages.monitoringReportsDashboard.headerDateUpdated)}
          qa="dateUpdated"
          value={report => report.lastUpdated}
        />
        <ReportsTable.Custom
          header={getContent(x => x.pages.monitoringReportsDashboard.headerAction)}
          hideHeader
          qa="link"
          value={report => renderLinks(report)}
        />
      </ReportsTable.Table>
    );
  };

  const renderLinks = (report: Dtos.MonitoringReportSummaryDto) => {
    const links: { route: ILinkInfo; titleContent: ContentSelector; qa: string }[] = [];

    if (editStatuses.indexOf(report.status) > -1) {
      links.push({
        route: props.routes.monitoringReportWorkflow.getLink({
          projectId: report.projectId,
          id: report.headerId,
          mode: "prepare",
          step: undefined,
        }),
        titleContent: content => content.pages.monitoringReportsDashboard.linkEditMonitoringReport,
        qa: "editLink",
      });
    } else {
      links.push({
        route: props.routes.monitoringReportWorkflow.getLink({
          projectId: report.projectId,
          id: report.headerId,
          mode: "view",
          step: undefined,
        }),
        titleContent: content => content.pages.monitoringReportsDashboard.linkViewMonitoringReport,
        qa: "viewLink",
      });
    }

    if (report.status === MonitoringReportStatus.Draft) {
      links.push({
        route: props.routes.monitoringReportDelete.getLink({ projectId: report.projectId, id: report.headerId }),
        titleContent: content => content.pages.monitoringReportsDashboard.linkDeleteMonitoringReport,
        qa: "deleteLink",
      });
    }

    return links.map((x, i) => (
      <div key={i} data-qa={x.qa}>
        <ACC.Link route={x.route}>
          <ACC.Content value={x.titleContent} />
        </ACC.Link>
      </div>
    ));
  };

  return <ACC.PageLoader pending={combined} render={data => renderContents(data.project, data.reports)} />;
};

const MonitoringReportContainer = (props: MonitoringReportDashboardParams & BaseProps) => {
  const stores = useStores();

  return (
    <MonitoringReportDashboard
      {...props}
      project={stores.projects.getById(props.projectId)}
      partners={stores.partners.getPartnersForProject(props.projectId)}
      reports={stores.monitoringReports.getAllForProject(props.projectId)}
    />
  );
};

export const MonitoringReportDashboardRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "monitoringReportDashboard",
  routePath: "/projects/:projectId/monitoring-reports",
  getParams: r => ({ projectId: r.params.projectId, periodId: parseInt(r.params.periodId, 10) }),
  container: MonitoringReportContainer,
  accessControl: (auth, params) => auth.forProject(params.projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.monitoringReportsDashboard.title),
});
