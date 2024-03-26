import { PCRItemType, pcrStatusMetaValues } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { getAuthRoles } from "@framework/types/authorisation";
import { PcrItemDtoMapping } from "@gql/dtoMapper/mapPcrDto";
import { Accordion } from "@ui/components/atomicDesign/atoms/Accordion/Accordion";
import { AccordionItem } from "@ui/components/atomicDesign/atoms/Accordion/AccordionItem";
import { LineBreakList } from "@ui/components/atomicDesign/atoms/LineBreakList/lineBreakList";
import { Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";
import { ProjectBackLink } from "@ui/components/atomicDesign/organisms/projects/ProjectBackLink/projectBackLink";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Page } from "@ui/components/bjss/Page/page";
import { useContent } from "@ui/hooks/content.hook";
import { BaseProps, defineRoute } from "../../../containerBase";
import { useGetPcrItemMetadata } from "../utils/useGetPcrItemMetadata";
import { useGetPcrStatusMetadata } from "../utils/useGetPcrStatusMetadata";
import { usePcrDashboardQuery } from "./PCRDashboard.logic";
import { useProjectSuspensionMessageWithFragmentData } from "@ui/components/atomicDesign/organisms/projects/ProjectSuspensionMessage/ProjectSuspensionMessage.logic";
import { PartnerStatus } from "@framework/constants/partner";

interface PCRDashboardParams {
  projectId: ProjectId;
}

type PCRDashboardType = Merge<
  Omit<
    Pick<PCRSummaryDto, "id" | "requestNumber" | "started" | "status" | "lastUpdated" | "items" | "projectId">,
    "items"
  >,
  { items: Pick<PcrItemDtoMapping, "type" | "id">[] }
>;

const PCRTable = createTypedTable<PCRDashboardType>();

const PCRsDashboardPage = (props: PCRDashboardParams & BaseProps) => {
  const { project, pcrs, fragmentRef } = usePcrDashboardQuery(props.projectId);
  const { getContent } = useContent();
  const { getPcrItemContent, getPcrItemMetadata } = useGetPcrItemMetadata();
  const { getPcrStatusName, getPcrStatusMetadata, getPcrInternalStatusName } = useGetPcrStatusMetadata();
  const {
    project: { roles, partnerRoles },
    partners,
  } = useProjectSuspensionMessageWithFragmentData(fragmentRef);
  const { isMo, isPmOrMo } = getAuthRoles(roles);

  const isPmAllowedToEdit = partnerRoles.some(
    x => x.isPm && partners.some(y => x.partnerId === y.id && y.partnerStatus !== PartnerStatus.OnHold),
  );

  const renderStartANewRequestLink = () => {
    if (!isPmAllowedToEdit) return null;

    return (
      <Link route={props.routes.pcrCreate.getLink({ projectId: props.projectId })} className="govuk-button">
        Create request
      </Link>
    );
  };

  const renderTable = (pcrs: PCRDashboardType[], qa: string, message: string) => {
    if (!pcrs.length) {
      return <SimpleString>{message}</SimpleString>;
    }

    return (
      <PCRTable.Table data={pcrs} qa={qa}>
        <PCRTable.Custom qa="number" header="Request number" value={x => x.requestNumber} />
        <PCRTable.Custom
          qa="types"
          header="Types"
          value={x => <LineBreakList items={x.items.map(y => getPcrItemContent(y.type).name)} />}
        />
        <PCRTable.ShortDate qa="started" header="Started" value={x => x.started} />
        <PCRTable.Custom qa="status" header="Status" value={x => renderStatus(x)} />
        <PCRTable.ShortDate qa="lastUpdated" header="Last updated" value={x => x.lastUpdated} />
        <PCRTable.Custom qa="actions" header="Actions" hideHeader value={x => renderLinks(x)} />
      </PCRTable.Table>
    );
  };

  const renderStatus = (pcr: PCRDashboardType): React.ReactNode => {
    const enableInternalStatuses = pcr.items.some(x => getPcrItemMetadata(x.type)?.enableInternalStatuses);

    if (enableInternalStatuses) {
      return <>{getPcrInternalStatusName(pcr.status)}</>;
    } else {
      return <>{getPcrStatusName(pcr.status)}</>;
    }
  };

  const renderLinks = (pcr: PCRDashboardType): React.ReactNode => {
    const links: { route: ILinkInfo; text: string; qa: string }[] = [];
    const pcrStatusMetadata = getPcrStatusMetadata(pcr.status);

    const pcrLinkArgs = { pcrId: pcr.id, projectId: project.id, itemId: pcr.items?.[0]?.id };
    const hasAnyUplift = pcr.items.some(x => x.type === PCRItemType.Uplift);

    const viewItemLink = {
      route: props.routes.pcrViewItem.getLink(pcrLinkArgs),
      text: "View",
      qa: "pcrViewItemLink",
    };

    const viewLink = {
      route: props.routes.pcrDetails.getLink(pcrLinkArgs),
      text: "View",
      qa: "pcrViewLink",
    };

    const reviewLink = {
      route: props.routes.pcrReview.getLink(pcrLinkArgs),
      text: "Review",
      qa: "pcrReviewLink",
    };

    const editLink = {
      route: props.routes.pcrPrepare.getLink(pcrLinkArgs),
      text: "Edit",
      qa: "pcrPrepareLink",
    };

    const deleteLink = {
      route: props.routes.pcrDelete.getLink(pcrLinkArgs),
      text: "Delete",
      qa: "pcrDeleteLink",
    };

    if (isPmOrMo && hasAnyUplift) {
      // If we only have 1 PCR item, show the view item link.
      if (pcr.items.length === 1) {
        links.push(viewItemLink);
      } else {
        // Otherwise, show the standard view link
        links.push(viewLink);
      }
    } else {
      if (pcrStatusMetadata?.editableByPm && isPmAllowedToEdit && project.isActive) {
        links.push(editLink);
      } else if (pcrStatusMetadata?.reviewableByMo && isMo && project.isActive) {
        links.push(reviewLink);
      } else if (isPmOrMo) {
        links.push(viewLink);
      }

      if (pcrStatusMetadata?.deletableByPm && isPmAllowedToEdit && project.isActive) {
        links.push(deleteLink);
      }
    }

    return links.map((x, i) => (
      <div key={i} data-qa={x.qa}>
        <Link route={x.route}>{x.text}</Link>
      </div>
    ));
  };

  const archivedStatuses = pcrStatusMetaValues.filter(x => x.archived);
  const active = pcrs.filter(x => !archivedStatuses.some(y => y.status === x.status));
  const archived = pcrs.filter(x => archivedStatuses.some(y => y.status === x.status));

  return (
    <Page
      backLink={<ProjectBackLink projectId={project.id} />}
      pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
      fragmentRef={fragmentRef}
      projectId={props.projectId}
      isActive={project.isActive}
    >
      <Messages messages={props.messages} />

      <Section qa="pcr-table">
        {renderTable(
          active,
          "pcrs-active",
          getContent(x => x.pages.pcrsDashboard.noOngoingRequests),
        )}

        {project.isActive && renderStartANewRequestLink()}
      </Section>

      <Accordion>
        <AccordionItem title="Past requests" qa="past-requests">
          {renderTable(
            archived,
            "pcrs-archived",
            getContent(x => x.pages.pcrsDashboard.noPastRequests),
          )}
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
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrsDashboard.title),
  accessControl: (auth, { projectId }) =>
    auth
      .forProject(projectId)
      .hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
});
