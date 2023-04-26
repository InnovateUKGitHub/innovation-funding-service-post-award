import { getAuthRoles, ProjectRole } from "@framework/types";

import { BaseProps, defineRoute } from "../containerBase";
import {
  Content,
  Page,
  BackLink,
  Projects,
  Section,
  SummaryList,
  SummaryListItem,
  Renderers,
  Link,
} from "../../components";
import { usePartnerDetailsQuery } from "./partnerDetails.logic";

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
      pageTitle={<Projects.Title {...project} />}
      projectStatus={project.status}
      partnerStatus={partner.partnerStatus}
    >
      <Section>
        <SummaryList qa="partner-details">
          <SummaryListItem
            label={x => x.pages.partnerDetails.projectContactLabels.partnerName}
            qa="partner-name"
            content={<Renderers.SimpleString>{partner.name}</Renderers.SimpleString>}
          />
          <SummaryListItem
            label={x => x.pages.partnerDetails.projectContactLabels.partnerType}
            qa="partner-type"
            content={<Renderers.SimpleString>{partner.type}</Renderers.SimpleString>}
          />
          <SummaryListItem
            label={x => x.projectContactLabels.partnerPostcode}
            qa="partner-postcode"
            content={<Renderers.SimpleString>{partner.postcode}</Renderers.SimpleString>}
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
