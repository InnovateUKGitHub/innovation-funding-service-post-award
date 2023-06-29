import { PCRItemSummaryDto, PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { useProjectStatus } from "@ui/hooks/project-status.hook";
import { BaseProps, defineRoute } from "../../../containerBase";
import { usePcrDashboardQuery } from "./PCRDashboard.logic";
import { useGetPcrTypeName } from "../utils/useGetPcrTypeName";
import { PCRStatus } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { ProjectDto } from "@framework/dtos/projectDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Accordion } from "@ui/components/atomicDesign/atoms/Accordion/Accordion";
import { AccordionItem } from "@ui/components/atomicDesign/atoms/Accordion/AccordionItem";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { LineBreakList } from "@ui/components/atomicDesign/atoms/LineBreakList/lineBreakList";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";
import { Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { ProjectBackLink } from "@ui/components/atomicDesign/organisms/projects/ProjectBackLink/projectBackLink";

interface PCRDashboardParams {
  projectId: ProjectId;
}

type PCRDashboardType = Merge<
  Omit<
    Pick<
      PCRSummaryDto,
      "id" | "requestNumber" | "started" | "status" | "lastUpdated" | "statusName" | "items" | "projectId"
    >,
    "items"
  >,
  { items: Pick<PCRItemSummaryDto, "shortName">[] }
>;

const PCRTable = createTypedTable<PCRDashboardType>();

const PCRsDashboardPage = (props: PCRDashboardParams & BaseProps) => {
  const { isActive: isProjectActive } = useProjectStatus();
  const { project, pcrs } = usePcrDashboardQuery(props.projectId);
  const getPcRTypeName = useGetPcrTypeName();

  const renderStartANewRequestLink = (project: Pick<ProjectDto, "roles">) => {
    const { isPm } = getAuthRoles(project.roles);

    if (!isPm) return null;

    return (
      <Link route={props.routes.pcrCreate.getLink({ projectId: props.projectId })} className="govuk-button">
        Create request
      </Link>
    );
  };

  const renderTable = (
    project: Pick<ProjectDto, "roles" | "id">,
    pcrs: PCRDashboardType[],
    qa: string,
    message: string,
  ) => {
    if (!pcrs.length) {
      return <SimpleString>{message}</SimpleString>;
    }

    return (
      <PCRTable.Table data={pcrs} qa={qa}>
        <PCRTable.Custom qa="number" header="Request number" value={x => x.requestNumber} />
        <PCRTable.Custom
          qa="types"
          header="Types"
          value={x => <LineBreakList items={x.items.map(y => getPcRTypeName(y.shortName))} />}
        />
        <PCRTable.ShortDate qa="started" header="Started" value={x => x.started} />
        <PCRTable.String qa="status" header="Status" value={x => x.statusName} />
        <PCRTable.ShortDate qa="lastUpdated" header="Last updated" value={x => x.lastUpdated} />
        <PCRTable.Custom qa="actions" header="Actions" hideHeader value={x => renderLinks(project, x)} />
      </PCRTable.Table>
    );
  };

  const renderLinks = (project: Pick<ProjectDto, "roles" | "id">, pcr: PCRDashboardType): React.ReactNode => {
    const { isPm, isMo, isPmOrMo } = getAuthRoles(project.roles);
    const links: { route: ILinkInfo; text: string; qa: string }[] = [];
    const pcrLinkArgs = { pcrId: pcr.id, projectId: project.id };

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
        <Link route={x.route}>{x.text}</Link>
      </div>
    ));
  };

  const archivedStatuses = [PCRStatus.Approved, PCRStatus.Withdrawn, PCRStatus.Rejected, PCRStatus.Actioned];
  const active = pcrs.filter(x => archivedStatuses.indexOf(x.status) === -1);
  const archived = pcrs.filter(x => archivedStatuses.indexOf(x.status) !== -1);

  return (
    <Page
      backLink={<ProjectBackLink projectId={project.id} routes={props.routes} />}
      pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
      projectStatus={project.status}
    >
      <Messages messages={props.messages} />

      <Section qa="pcr-table">
        {renderTable(project, active, "pcrs-active", "You have no ongoing requests.")}

        {isProjectActive && renderStartANewRequestLink(project)}
      </Section>

      <Accordion>
        <AccordionItem title="Past requests" qa="past-requests">
          {renderTable(project, archived, "pcrs-archived", "You have no past requests.")}
        </AccordionItem>
      </Accordion>
    </Page>
  );
};

export const PCRsDashboardRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "pcrsDashboard",
  routePath: "/projects/:projectId/pcrs/dashboard",
  container: PCRsDashboardPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
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
