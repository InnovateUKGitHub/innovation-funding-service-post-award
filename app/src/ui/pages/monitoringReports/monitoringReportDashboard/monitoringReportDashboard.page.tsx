import { useContent } from "@ui/hooks/content.hook";
import { IRoutes } from "@ui/routing/routeConfig";
import type { ContentSelector } from "@copy/type";
import { useMonitoringReportDashboardQuery, MonitoringReport } from "./monitoringReportDashboard.logic";
import { MonitoringReportStatus } from "@framework/constants/monitoringReportStatus";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Content } from "@ui/components/molecules/Content/content";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { PeriodTitle } from "@ui/components/molecules/PeriodTitle/periodTitle";
import { Messages } from "@ui/components/molecules/Messages/messages";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { createTypedTable } from "@ui/components/molecules/Table/Table";
import { ValidationMessage } from "@ui/components/molecules/validation/ValidationMessage/ValidationMessage";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { Link } from "@ui/components/atoms/Links/links";
import { ProjectBackLink } from "@ui/components/organisms/projects/ProjectBackLink/projectBackLink";

interface MonitoringReportDashboardParams {
  projectId: ProjectId;
}

const editStatuses = [MonitoringReportStatus.New, MonitoringReportStatus.Draft, MonitoringReportStatus.Queried];
const ReportsTable = createTypedTable<MonitoringReport>();

const MonitoringReportDashboard = (props: MonitoringReportDashboardParams & BaseProps) => {
  const { reportSections, fragmentRef } = useMonitoringReportDashboardQuery(props.projectId);

  return (
    <Page fragmentRef={fragmentRef} backLink={<ProjectBackLink projectId={props.projectId} />}>
      <Messages messages={props.messages} />
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
          <MonitoringReportTable
            reports={reportSections.open}
            section="current"
            routes={props.routes}
            caption={x => x.pages.monitoringReportsDashboard.openReportsTableCaption}
          />
        ) : (
          <SimpleString>
            <Content value={x => x.monitoringReportsMessages.noOpenReportsMessage} />
          </SimpleString>
        )}
      </Section>

      <Section title={<Content value={x => x.pages.monitoringReportsDashboard.sectionTitleArchived} />}>
        {reportSections.archived.length ? (
          <MonitoringReportTable
            reports={reportSections.archived}
            section="previous"
            routes={props.routes}
            caption={x => x.pages.monitoringReportsDashboard.archivedReportsTableCaption}
          />
        ) : (
          <SimpleString>
            <Content value={x => x.monitoringReportsMessages.noArchivedReportsMessage} />
          </SimpleString>
        )}
      </Section>
    </Page>
  );
};

const MonitoringReportTable = ({
  reports,
  section,
  routes,
  caption,
}: {
  reports: MonitoringReport[];
  section: "current" | "previous";
  routes: IRoutes;
  caption: ContentSelector;
}) => {
  const { getContent } = useContent();

  return (
    <ReportsTable.Table
      data={reports}
      bodyRowFlag={x => (section !== "current" ? null : editStatuses.indexOf(x.status) >= 0 ? "edit" : null)}
      qa={`${section}-reports-table`}
      caption={caption}
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

export const MonitoringReportDashboardRoute = defineRoute<{
  projectId: ProjectId;
  periodId: number | undefined;
}>({
  allowRouteInActiveAccess: true,
  routeName: "monitoringReportDashboard",
  routePath: "/projects/:projectId/monitoring-reports",
  getParams: r => ({
    projectId: r.params.projectId as ProjectId,
    periodId: r.params.periodId ? parseInt(r.params.periodId, 10) : undefined,
  }),
  container: MonitoringReportDashboard,
  accessControl: (auth, params) =>
    auth.forProject(params.projectId).hasRole(ProjectRolePermissionBits.MonitoringOfficer),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.monitoringReportsDashboard.title),
});
