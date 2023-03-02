import { MonitoringReportStatus } from "@framework/constants";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { ILinkInfo, ProjectRole } from "@framework/types";
import {
  Page,
  Projects,
  Renderers,
  ValidationMessage,
  Link,
  Content,
  Section,
  createTypedTable,
  PeriodTitle,
} from "@ui/components";
import { useContent } from "@ui/hooks";
import { IRoutes } from "@ui/routing";
import type { ContentSelector } from "@copy/type";
import { useMonitoringReportDashboardQuery, MonitoringReport } from "./monitoringReportDashboard.logic";

interface MonitoringReportDashboardParams {
  projectId: string;
}

const editStatuses = [MonitoringReportStatus.New, MonitoringReportStatus.Draft, MonitoringReportStatus.Queried];
const ReportsTable = createTypedTable<MonitoringReport>();

const MonitoringReportDashboard = (props: MonitoringReportDashboardParams & BaseProps) => {
  const { project, reportSections } = useMonitoringReportDashboardQuery(props.projectId);

  return (
    <Page
      backLink={<Projects.ProjectBackLink routes={props.routes} projectId={project.id} />}
      pageTitle={<Projects.Title projectNumber={project.projectNumber} title={project.title} />}
      projectStatus={project.status}
    >
      <Renderers.Messages messages={props.messages} />
      <ValidationMessage
        qa="guidance-message"
        messageType="info"
        message={x => x.monitoringReportsMessages.reportsSubmissionGuidance}
      />
      <Link
        route={props.routes.monitoringReportCreate.getLink({ projectId: props.projectId })}
        className="govuk-button"
      >
        <Content value={x => x.pages.monitoringReportsDashboard.buttonNewMonitoringReport} />
      </Link>

      <Section title={<Content value={x => x.pages.monitoringReportsDashboard.sectionTitleOpen} />}>
        {reportSections.open.length ? (
          <MonitoringReportTable reports={reportSections.open} section="current" routes={props.routes} />
        ) : (
          <Renderers.SimpleString>
            <Content value={x => x.monitoringReportsMessages.noOpenReportsMessage} />
          </Renderers.SimpleString>
        )}
      </Section>

      <Section title={<Content value={x => x.pages.monitoringReportsDashboard.sectionTitleArchived} />}>
        {reportSections.archived.length ? (
          <MonitoringReportTable reports={reportSections.archived} section="previous" routes={props.routes} />
        ) : (
          <Renderers.SimpleString>
            <Content value={x => x.monitoringReportsMessages.noArchivedReportsMessage} />
          </Renderers.SimpleString>
        )}
      </Section>
    </Page>
  );
};

const MonitoringReportTable = ({
  reports,
  section,
  routes,
}: {
  reports: MonitoringReport[];
  section: "current" | "previous";
  routes: IRoutes;
}) => {
  const { getContent } = useContent();

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
          <PeriodTitle periodId={report.periodId} periodStartDate={report.startDate} periodEndDate={report.endDate} />
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
        value={report => <Links report={report} routes={routes} />}
      />
    </ReportsTable.Table>
  );
};

const Links = ({ report, routes }: { report: MonitoringReport; routes: IRoutes }) => {
  const links: { route: ILinkInfo; titleContent: ContentSelector; qa: string }[] = [];

  if (editStatuses.indexOf(report.status) > -1) {
    links.push({
      route: routes.monitoringReportWorkflow.getLink({
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
      route: routes.monitoringReportWorkflow.getLink({
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
      route: routes.monitoringReportDelete.getLink({ projectId: report.projectId, id: report.headerId }),
      titleContent: content => content.pages.monitoringReportsDashboard.linkDeleteMonitoringReport,
      qa: "deleteLink",
    });
  }

  return (
    <>
      {links.map((x, i) => (
        <div key={i} data-qa={x.qa}>
          <Link route={x.route}>
            <Content value={x.titleContent} />
          </Link>
        </div>
      ))}
    </>
  );
};

export const MonitoringReportDashboardRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "monitoringReportDashboard",
  routePath: "/projects/:projectId/monitoring-reports",
  getParams: r => ({ projectId: r.params.projectId, periodId: parseInt(r.params.periodId, 10) }),
  container: MonitoringReportDashboard,
  accessControl: (auth, params) => auth.forProject(params.projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.monitoringReportsDashboard.title),
});
