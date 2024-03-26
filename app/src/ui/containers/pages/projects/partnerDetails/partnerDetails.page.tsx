import { BaseProps, defineRoute } from "../../../containerBase";
import { usePartnerDetailsQuery } from "./partnerDetails.logic";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { ProjectRole } from "@framework/constants/project";
import { getAuthRoles } from "@framework/types/authorisation";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink, Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";

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
      projectId={props.projectId}
      partnerId={props.partnerId}
      isActive={project.isActive}
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
