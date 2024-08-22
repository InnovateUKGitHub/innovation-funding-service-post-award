import { ProjectRole } from "@framework/constants/project";
import { BackLink, Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page.withFragment";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useRoutes } from "@ui/context/routesProvider";
import { useContent } from "@ui/hooks/content.hook";
import {
  ManageTeamMembersDashboardParams,
  useManageTeamMembersDashboardQuery,
} from "./ManageTeamMembersDashboard.logic";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { ManageTeamMembersContactTable } from "./ManageTeamMembersContactTable";

const ManageTeamMembersDashboardPage = ({ projectId }: BaseProps & ManageTeamMembersDashboardParams) => {
  const routes = useRoutes();
  const { getContent } = useContent();

  const { categories, fragmentRef } = useManageTeamMembersDashboardQuery({ projectId });

  return (
    <Page
      heading={getContent(x => x.pages.manageTeamMembers.dashboard.title)}
      backLink={
        <BackLink route={routes.pcrsDashboard.getLink({ projectId })}>
          {getContent(x => x.pages.manageTeamMembers.dashboard.backLink)}
        </BackLink>
      }
      fragmentRef={fragmentRef}
    >
      <Section title={getContent(x => x.projectLabels.projectManagers({ count: categories.pm.length }))}>
        <ManageTeamMembersContactTable
          tableData={categories.pm}
          link={({}) => (
            <Link route={routes.errorNotFound.getLink({})}>
              {getContent(x => x.pages.manageTeamMembers.dashboard.edit)}
            </Link>
          )}
        />
        <Link route={routes.errorNotFound.getLink({})} styling="SecondaryButton">
          {getContent(x => x.pages.manageTeamMembers.dashboard.replaceProjectManager)}
        </Link>
      </Section>

      <Section title={getContent(x => x.projectLabels.financeContacts({ count: categories.fc.length }))}>
        <ManageTeamMembersContactTable
          tableData={categories.fc}
          link={({}) => (
            <Link route={routes.errorNotFound.getLink({})}>
              {getContent(x => x.pages.manageTeamMembers.dashboard.edit)}
            </Link>
          )}
        />
        <Link route={routes.errorNotFound.getLink({})} styling="SecondaryButton">
          {getContent(x => x.pages.manageTeamMembers.dashboard.replaceFinanceContact)}
        </Link>
      </Section>

      <Section title={getContent(x => x.projectLabels.mainCompanyContacts({ count: categories.mcc.length }))}>
        <ManageTeamMembersContactTable
          tableData={categories.mcc}
          link={({}) => (
            <Link route={routes.errorNotFound.getLink({})}>
              {getContent(x => x.pages.manageTeamMembers.dashboard.edit)}
            </Link>
          )}
        />
        {categories.mcc.length === 0 ? (
          <Link route={routes.errorNotFound.getLink({})} styling="SecondaryButton">
            {getContent(x => x.pages.manageTeamMembers.dashboard.inviteMainCompanyContact)}
          </Link>
        ) : (
          <Link route={routes.errorNotFound.getLink({})} styling="SecondaryButton">
            {getContent(x => x.pages.manageTeamMembers.dashboard.replaceMainCompanyContact)}
          </Link>
        )}
      </Section>

      <Section title={getContent(x => x.projectLabels.associates({ count: categories.ass.length }))}>
        <ManageTeamMembersContactTable
          tableData={categories.ass}
          link={({}) => (
            <div className="acc-links-group">
              <Link route={routes.errorNotFound.getLink({})}>
                {getContent(x => x.pages.manageTeamMembers.dashboard.edit)}
              </Link>
              <Link route={routes.errorNotFound.getLink({})}>
                {getContent(x => x.pages.manageTeamMembers.dashboard.remove)}
              </Link>
            </div>
          )}
        />
        <Link route={routes.errorNotFound.getLink({})} styling="SecondaryButton">
          {getContent(x => x.pages.manageTeamMembers.dashboard.inviteAssociate)}
        </Link>
      </Section>

      <Link route={routes.pcrCreate.getLink({ projectId })} styling="Link">
        {getContent(x => x.pages.manageTeamMembers.dashboard.backButton)}
      </Link>
    </Page>
  );
};

const ManageTeamMembersDashboardRoute = defineRoute<ManageTeamMembersDashboardParams>({
  routeName: "ManageTeamMembersDashboard",
  routePath: "/projects/:projectId/details/manage-team-members",
  container: ManageTeamMembersDashboardPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.manageTeamMembers.dashboard.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});

export { ManageTeamMembersDashboardRoute };
