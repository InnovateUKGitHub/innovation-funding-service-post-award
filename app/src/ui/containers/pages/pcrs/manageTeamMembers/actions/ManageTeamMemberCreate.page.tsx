import { ManageTeamMemberCreateProps, ManageTeamMemberMethod, ManageTeamMemberRole } from "../ManageTeamMember.logic";
import { BaseManageTeamMember, ManageTeamMemberModifyProps } from "./BaseManageTeamMember";
import { ManageTeamMemberSection } from "./components/ManageTeamMemberSection";
import { ManageEmailMessage } from "./components/ManageEmailMessage";
import { ManageTeamMemberInputs } from "./components/ManageTeamMemberInputs";
import { ProjectRole } from "@framework/constants/project";
import { defineRoute } from "@ui/containers/containerBase";
import { ManageTeamMemberForm } from "./components/ManageTeamMemberForm";
import { ManageTeamMemberSubmitSection } from "./components/ManageTeamMemberSubmitSection";

const ManageTeamMemberCreatePage = (props: ManageTeamMemberModifyProps) => {
  return (
    <BaseManageTeamMember {...props} method={ManageTeamMemberMethod.CREATE}>
      <ManageTeamMemberForm>
        <ManageTeamMemberSection>
          <ManageTeamMemberInputs />
          <ManageEmailMessage />
        </ManageTeamMemberSection>
        <ManageTeamMemberSubmitSection />
      </ManageTeamMemberForm>
    </BaseManageTeamMember>
  );
};

const ManageTeamMembersCreateRoute = defineRoute<ManageTeamMemberCreateProps>({
  routeName: "ManageTeamMembersCreate",
  routePath: "/projects/:projectId/details/manage-team-members/create/:role",
  container: ManageTeamMemberCreatePage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    role: route.params.role as ManageTeamMemberRole,
    pclId: undefined,
    method: ManageTeamMemberMethod.CREATE,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.manageTeamMembers.dashboard.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});

export { ManageTeamMemberCreatePage, ManageTeamMembersCreateRoute };
