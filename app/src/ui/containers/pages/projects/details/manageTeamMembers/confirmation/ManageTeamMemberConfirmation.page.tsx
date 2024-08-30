import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { ProjectRole } from "@framework/constants/project";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { BackLink, Link } from "@ui/components/atoms/Links/links";
import { useContent } from "@ui/hooks/content.hook";
// import { useNavigate } from "react-router-dom";
import { useRoutes } from "@ui/context/routesProvider";
import { ValidationMessage } from "@ui/components/molecules/validation/ValidationMessage/ValidationMessage";
import { useManageTeamMemberConfirmationQuery } from "./ManageTeamMemberConfirmation.logic";
import { Section } from "@ui/components/atoms/Section/Section";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";

import { ShortDate } from "@ui/components/atoms/Date";
import { getPcrItemTaskStatus } from "@ui/containers/pages/pcrs/utils/getPcrItemTaskStatus";

type ManageTeamMemberConfirmationParams = {
  projectId: ProjectId;
  pcrId: PcrId;
};

const ManageTeamMemberConfirmationPage = ({ projectId, pcrId }: BaseProps & ManageTeamMemberConfirmationParams) => {
  const { getContent } = useContent();
  const routes = useRoutes();
  // const navigate = useNavigate();

  const { fragmentRef, pcr } = useManageTeamMemberConfirmationQuery({ projectId, pcrId });
  const backRoute = routes.pcrsDashboard.getLink({ projectId });

  return (
    <Page
      backLink={<BackLink route={backRoute}>{getContent(x => x.pages.manageTeamMembers.modify.backLink)}</BackLink>}
      fragmentRef={fragmentRef}
      //   validationErrors={validationErrors}
      //   apiError={apiError}
    >
      <ValidationMessage
        message={getContent(x => x.pages.manageTeamMembers.confirmation.success)}
        messageType="success"
      />
      <Section>
        <SummaryList>
          <SummaryListItem
            label={getContent(x => x.pages.manageTeamMembers.confirmation.requestNumber)}
            content={pcr.requestNumber}
            qa="requestNumber"
          />
          <SummaryListItem
            label={getContent(x => x.pages.manageTeamMembers.confirmation.requestType)}
            content={pcr.typeName} // todo change to calculated value
            qa="requestType"
          />

          <SummaryListItem
            label={getContent(x => x.pages.manageTeamMembers.confirmation.requestStarted)}
            content={<ShortDate value={pcr.started} />}
            qa="started"
          />
          <SummaryListItem
            label={getContent(x => x.pages.manageTeamMembers.confirmation.requestStatus)}
            content={getPcrItemTaskStatus(pcr.status)}
            qa="requestStatus"
          />
          <SummaryListItem
            label={getContent(x => x.pages.manageTeamMembers.confirmation.RequestLastUpdated)}
            content={<ShortDate value={pcr.lastUpdated} />}
            qa="lastUpdated"
          />
        </SummaryList>
      </Section>

      <Link styling="PrimaryButton" route={backRoute}>
        {getContent(x => x.pages.manageTeamMembers.confirmation.submitButton)}
      </Link>
    </Page>
  );
};

export const ManageTeamMembersConfirmationRoute = defineRoute<ManageTeamMemberConfirmationParams>({
  routeName: "ManageTeamMembersConfirmation",
  routePath: "/projects/:projectId/details/:pcrId/manage-team-members/confirmation/",
  container: ManageTeamMemberConfirmationPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.manageTeamMembers.confirmation.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});
