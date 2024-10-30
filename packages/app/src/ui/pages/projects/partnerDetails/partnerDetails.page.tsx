import { BaseProps, defineRoute } from "../../../app/containerBase";
import { usePartnerDetailsQuery } from "./partnerDetails.logic";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { getAuthRoles } from "@framework/types/authorisation";
import { Content } from "@ui/components/molecules/Content/content";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { BackLink, Link } from "@ui/components/atoms/Links/links";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";

interface Params {
  projectId: ProjectId;
  partnerId: PartnerId;
}

const PartnerDetailsPage = (props: BaseProps & Params) => {
  const { partner, fragmentRef } = usePartnerDetailsQuery(props.projectId, props.partnerId);
  const { isFc } = getAuthRoles(partner.roles);

  const backToProjectDetailsLink = <Content value={x => x.pages.partnerDetails.backToProjectDetails} />;
  const editLink = <Content value={x => x.pages.partnerDetails.editLink} />;

  return (
    <Page
      fragmentRef={fragmentRef}
      backLink={
        <BackLink route={props.routes.projectDetails.getLink({ projectId: props.projectId })}>
          {backToProjectDetailsLink}
        </BackLink>
      }
      partnerId={props.partnerId}
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
              isFc ? (
                <Link
                  styling="Link"
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
  routePath: "/projects/:projectId/details/partner/:partnerId",
  container: PartnerDetailsPage,
  getParams: r => ({ projectId: r.params.projectId as ProjectId, partnerId: r.params.partnerId as PartnerId }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.partnerDetails.title),
  accessControl: (auth, { projectId }) =>
    auth
      .forProject(projectId)
      .hasAnyRoles(
        ProjectRolePermissionBits.FinancialContact,
        ProjectRolePermissionBits.ProjectManager,
        ProjectRolePermissionBits.MonitoringOfficer,
      ),
});
