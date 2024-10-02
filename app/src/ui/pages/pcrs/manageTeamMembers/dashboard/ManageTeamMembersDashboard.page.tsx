import { ProjectRolePermissionBits } from "@framework/constants/project";
import { BackLink, Link } from "@ui/components/atoms/Links/links";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { useRoutes } from "@ui/context/routesProvider";
import { useContent } from "@ui/hooks/content.hook";
import { ManageTeamMembersDashboardParams } from "./ManageTeamMembersDashboard.logic";
import { Section } from "@ui/components/molecules/Section/section";
import { ManageTeamMembersContactListTable } from "../ManageTeamMembersContactListTable";
import { useManageTeamMembersQuery } from "../ManageTeamMember.logic";
import { ManageTeamMemberRemoveLink } from "./ManageTeamMembersLinks";
import { ProjectRole } from "@framework/dtos/projectContactDto";

const ManageTeamMembersDashboardPage = ({ projectId }: BaseProps & ManageTeamMembersDashboardParams) => {
  const routes = useRoutes();
  const { getContent } = useContent();

  const { project, categories, fragmentRef } = useManageTeamMembersQuery({ projectId });

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
      <Section title={getContent(x => x.projectLabels.projectManagers({ count: categories.projectManagers.length }))}>
        <ManageTeamMembersContactListTable tableData={categories.projectManagers} qa="projectManagers-table" />

        <Link
          route={routes.manageTeamMembersReplaceRoute.getLink({
            projectId,
            role: ProjectRole.PROJECT_MANAGER,
            pclId: categories.projectManagers.length === 1 ? categories.projectManagers[0].pclId : undefined,
          })}
          styling="SecondaryButton"
        >
          {getContent(x => x.pages.manageTeamMembers.dashboard.replaceProjectManager)}
        </Link>
      </Section>

      <Section title={getContent(x => x.projectLabels.financeContacts({ count: categories.financeContacts.length }))}>
        <ManageTeamMembersContactListTable tableData={categories.financeContacts} qa="financeContacts-table" />

        <Link
          route={routes.manageTeamMembersReplaceRoute.getLink({
            projectId,
            role: ProjectRole.FINANCE_CONTACT,
            pclId: categories.financeContacts.length === 1 ? categories.financeContacts[0].pclId : undefined,
          })}
          styling="SecondaryButton"
        >
          {getContent(x => x.pages.manageTeamMembers.dashboard.replaceFinanceContact)}
        </Link>
      </Section>

      {project.competitionType === "KTP" && (
        <>
          <Section
            title={getContent(x =>
              x.projectLabels.knowledgeBaseAdministrators({ count: categories.mainCompanyContacts.length }),
            )}
          >
            <ManageTeamMembersContactListTable
              tableData={categories.knowledgeBaseAdministrators}
              qa="knowledgeBaseAdministrators-table"
            />
            {categories.knowledgeBaseAdministrators.length === 0 ? (
              <Link
                route={routes.manageTeamMembersCreateRoute.getLink({
                  projectId,
                  role: ProjectRole.KNOWLEDGE_BASE_ADMINISTRATOR,
                  pclId: undefined,
                })}
                styling="SecondaryButton"
              >
                {getContent(x => x.pages.manageTeamMembers.dashboard.inviteKnowledgeBaseAdministrator)}
              </Link>
            ) : (
              <Link
                route={routes.manageTeamMembersReplaceRoute.getLink({
                  projectId,
                  role: ProjectRole.KNOWLEDGE_BASE_ADMINISTRATOR,
                  pclId:
                    categories.knowledgeBaseAdministrators.length === 1
                      ? categories.knowledgeBaseAdministrators[0].pclId
                      : undefined,
                })}
                styling="SecondaryButton"
              >
                {getContent(x => x.pages.manageTeamMembers.dashboard.replaceKnowledgeBaseAdministrator)}
              </Link>
            )}
          </Section>

          <Section
            title={getContent(x =>
              x.projectLabels.mainCompanyContacts({ count: categories.mainCompanyContacts.length }),
            )}
          >
            <ManageTeamMembersContactListTable
              tableData={categories.mainCompanyContacts}
              qa="mainCompanyContacts-table"
            />
            {categories.mainCompanyContacts.length === 0 ? (
              <Link
                route={routes.manageTeamMembersCreateRoute.getLink({
                  projectId,
                  role: ProjectRole.MAIN_COMPANY_CONTACT,
                  pclId: undefined,
                })}
                styling="SecondaryButton"
              >
                {getContent(x => x.pages.manageTeamMembers.dashboard.inviteMainCompanyContact)}
              </Link>
            ) : (
              <Link
                route={routes.manageTeamMembersReplaceRoute.getLink({
                  projectId,
                  role: ProjectRole.MAIN_COMPANY_CONTACT,
                  pclId:
                    categories.mainCompanyContacts.length === 1 ? categories.mainCompanyContacts[0].pclId : undefined,
                })}
                styling="SecondaryButton"
              >
                {getContent(x => x.pages.manageTeamMembers.dashboard.replaceMainCompanyContact)}
              </Link>
            )}
          </Section>

          <Section title={getContent(x => x.projectLabels.associates({ count: categories.associates.length }))}>
            <ManageTeamMembersContactListTable
              qa="associates-table"
              tableData={categories.associates}
              link={({ data }) => (
                <ManageTeamMemberRemoveLink projectId={projectId} pclId={data.pclId} role={ProjectRole.ASSOCIATE} />
              )}
            />
            <Link
              route={routes.manageTeamMembersCreateRoute.getLink({
                projectId,
                role: ProjectRole.ASSOCIATE,
                pclId: undefined,
              })}
              styling="SecondaryButton"
            >
              {getContent(x => x.pages.manageTeamMembers.dashboard.inviteAssociate)}
            </Link>
          </Section>
        </>
      )}

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
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.manageTeamMembers.dashboard.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRolePermissionBits.ProjectManager),
});

export { ManageTeamMembersDashboardRoute };
