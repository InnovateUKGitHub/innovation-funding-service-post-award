import { getAuthRoles, ILinkInfo, ProjectDto, ProjectRole } from "@framework/types";
import { Pending } from "@shared/pending";
import { PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { useStores } from "@ui/redux";
import { PCRStatus } from "@framework/constants";
import { IRoutes } from "@ui/routing";
import * as ACC from "@ui/components";
import { useProjectStatus } from "@ui/hooks/project-status.hook";
import { BaseProps, defineRoute } from "../containerBase";

interface PCRDashboardParams {
  projectId: string;
}

interface PCRDashboardData {
  project: Pending<ProjectDto>;
  pcrs: Pending<PCRSummaryDto[]>;
  routes: IRoutes;
  messages: string[];
}

const PCRsDashboardComponent = (props: PCRDashboardParams & PCRDashboardData & BaseProps) => {
  const { isActive: isProjectActive } = useProjectStatus();

  const combined = Pending.combine({
    project: props.project,
    pcrs: props.pcrs,
  });

  const renderContents = (project: ProjectDto, pcrs: PCRSummaryDto[]) => {
    const archivedStatuses = [PCRStatus.Approved, PCRStatus.Withdrawn, PCRStatus.Rejected, PCRStatus.Actioned];
    const active = pcrs.filter(x => archivedStatuses.indexOf(x.status) === -1);
    const archived = pcrs.filter(x => archivedStatuses.indexOf(x.status) !== -1);

    return (
      <ACC.Page
        backLink={<ACC.Projects.ProjectBackLink routes={props.routes} projectId={project.id} />}
        pageTitle={<ACC.Projects.Title {...project} />}
        project={project}
      >
        <ACC.Renderers.Messages messages={props.messages} />

        <ACC.Section qa="pcr-table">
          {renderTable(project, active, "pcrs-active", "You have no ongoing requests.")}

          {isProjectActive && renderStartANewRequestLink(project)}
        </ACC.Section>

        <ACC.Accordion>
          <ACC.AccordionItem title="Past requests" qa="past-requests">
            {renderTable(project, archived, "pcrs-archived", "You have no past requests.")}
          </ACC.AccordionItem>
        </ACC.Accordion>
      </ACC.Page>
    );
  };

  const renderStartANewRequestLink = (project: ProjectDto) => {
    const { isPm } = getAuthRoles(project.roles);

    if (!isPm) return null;

    return (
      <ACC.Link route={props.routes.pcrCreate.getLink({ projectId: props.projectId })} className="govuk-button">
        Create request
      </ACC.Link>
    );
  };

  const renderTable = (project: ProjectDto, pcrs: PCRSummaryDto[], qa: string, message: string) => {
    const PCRTable = ACC.TypedTable<PCRSummaryDto>();

    if (!pcrs.length) {
      return <ACC.Renderers.SimpleString>{message}</ACC.Renderers.SimpleString>;
    }

    return (
      <PCRTable.Table data={pcrs} qa={qa}>
        <PCRTable.Custom qa="number" header="Request number" value={x => x.requestNumber} />
        <PCRTable.Custom
          qa="types"
          header="Types"
          value={x => <ACC.Renderers.LineBreakList items={x.items.map(y => y.shortName)} />}
        />
        <PCRTable.ShortDate qa="started" header="Started" value={x => x.started} />
        <PCRTable.String qa="stauts" header="Status" value={x => x.statusName} />
        <PCRTable.ShortDate qa="lastUpdated" header="Last updated" value={x => x.lastUpdated} />
        <PCRTable.Custom qa="actions" header="Actions" hideHeader value={x => renderLinks(project, x)} />
      </PCRTable.Table>
    );
  };

  const renderLinks = (project: ProjectDto, pcr: PCRSummaryDto): React.ReactNode => {
    const { isPm, isMo, isPmOrMo } = getAuthRoles(project.roles);
    const links: { route: ILinkInfo; text: string; qa: string }[] = [];
    const pcrLinkArgs = { pcrId: pcr.id, projectId: pcr.projectId };

    const prepareStatus = [PCRStatus.Draft, PCRStatus.QueriedByMonitoringOfficer, PCRStatus.QueriedByInnovateUK];

    if (prepareStatus.indexOf(pcr.status) >= 0 && isPm && isProjectActive) {
      links.push({
        route: props.routes.pcrPrepare.getLink(pcrLinkArgs),
        text: "Edit",
        qa: "pcrPrepareLink",
      });
    } else if (pcr.status === PCRStatus.SubmittedToMonitoringOfficer && isMo && isProjectActive) {
      links.push({
        route: props.routes.pcrReview.getLink(pcrLinkArgs),
        text: "Review",
        qa: "pcrReviewLink",
      });
    } else if (isPmOrMo) {
      links.push({
        route: props.routes.pcrDetails.getLink(pcrLinkArgs),
        text: "View",
        qa: "pcrViewLink",
      });
    }

    if (pcr.status === PCRStatus.Draft && isPm && isProjectActive) {
      links.push({
        route: props.routes.pcrDelete.getLink(pcrLinkArgs),
        text: "Delete",
        qa: "pcrDeleteLink",
      });
    }

    return links.map((x, i) => (
      <div key={i} data-qa={x.qa}>
        <ACC.Link route={x.route}>{x.text}</ACC.Link>
      </div>
    ));
  };

  return <ACC.PageLoader pending={combined} render={x => renderContents(x.project, x.pcrs)} />;
};

const PCRsDashboardContainer = (props: PCRDashboardParams & BaseProps) => {
  const stores = useStores();

  return (
    <PCRsDashboardComponent
      {...props}
      project={stores.projects.getById(props.projectId)}
      pcrs={stores.projectChangeRequests.getAllForProject(props.projectId)}
    />
  );
};

export const PCRsDashboardRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "pcrsDashboard",
  routePath: "/projects/:projectId/pcrs/dashboard",
  container: PCRsDashboardContainer,
  getParams: route => ({
    projectId: route.params.projectId,
  }),
  getTitle: () => ({
    htmlTitle: "Project change requests",
    displayTitle: "Project change requests",
  }),
  accessControl: (auth, { projectId }) =>
    auth
      .forProject(projectId)
      .hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
});
