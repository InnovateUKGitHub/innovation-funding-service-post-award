import { BaseProps, defineRoute } from "../../containerBase";
import { usePartnerDetailsQuery } from "./partnerDetails.logic";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { ProjectRole } from "@framework/constants/project";
import { getAuthRoles } from "@framework/types/authorisation";
import { Content } from "@ui/components/content";
import { Page } from "@ui/components/layout/page";
import { Section } from "@ui/components/layout/section";
import { BackLink, Link } from "@ui/components/links";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";
import { Title } from "@ui/components/projects/title";

interface Params {
  projectId: ProjectId;
  partnerId: PartnerId;
}

const PartnerDetailsPage = (props: BaseProps & Params) => {
  const { project, partner } = usePartnerDetailsQuery(props.projectId, props.partnerId);
  const { isFc, isPm } = getAuthRoles(partner.roles);

  const backToProjectDetailsLink = <Content value={x => x.pages.partnerDetails.backToProjectDetails} />;
  const editLink = <Content value={x => x.pages.partnerDetails.editLink} />;

  return (
    <Page
      backLink={
        <BackLink route={props.routes.projectDetails.getLink({ projectId: props.projectId })}>
          {backToProjectDetailsLink}
        </BackLink>
      }
      pageTitle={<Title {...project} />}
      projectStatus={project.status}
      partnerStatus={partner.partnerStatus}
    >
      <Section>
        <SummaryList qa="partner-details">
          <SummaryListItem
            label={x => x.pages.partnerDetails.projectContactLabels.partnerName}
            qa="partner-name"
            content={<SimpleString>{partner.name}</SimpleString>}
          />
          <SummaryListItem
            label={x => x.pages.partnerDetails.projectContactLabels.partnerType}
            qa="partner-type"
            content={<SimpleString>{partner.type}</SimpleString>}
          />
          <SummaryListItem
            label={x => x.projectContactLabels.partnerPostcode}
            qa="partner-postcode"
            content={<SimpleString>{partner.postcode}</SimpleString>}
            action={
              isFc || isPm ? (
                <Link
                  styling={"Link"}
                  route={props.routes.partnerDetailsEdit.getLink({
                    projectId: props.projectId,
                    partnerId: props.partnerId,
                  })}
                >
                  {editLink}
                </Link>
              ) : null
            }
          />
        </SummaryList>
      </Section>
    </Page>
  );
};

export const PartnerDetailsRoute = defineRoute<Params>({
  routeName: "partnerDetails",
  routePath: "/projects/:projectId/details/:partnerId",
  container: PartnerDetailsPage,
  getParams: r => ({ projectId: r.params.projectId as ProjectId, partnerId: r.params.partnerId as PartnerId }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.partnerDetails.title),
  accessControl: (auth, { projectId }) =>
    auth
      .forProject(projectId)
      .hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
});
