import { ManageTeamMemberCreateProps } from "../ManageTeamMember.logic";
import { BaseManageTeamMember, ManageTeamMemberModifyProps } from "./ManageTeamMemberCrud";
import { ManageTeamMemberSection } from "./components/ManageTeamMemberSection";
import { ManageEmailMessage } from "./components/ManageEmailMessage";
import { ManageTeamMemberInputs } from "./components/ManageTeamMemberInputs";
import { defineRoute } from "@ui/app/containerBase";
import { ManageTeamMemberForm } from "./components/ManageTeamMemberForm";
import { ManageTeamMemberSubmitSection } from "./components/ManageTeamMemberSubmitSection";
import { ManageTeamMemberMethod } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/dtos/projectContactDto";
import { ProjectRolePermissionBits } from "@framework/constants/project";

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
    role: route.params.role as ProjectRole,
    pclId: undefined,
    method: ManageTeamMemberMethod.CREATE,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.manageTeamMembers.dashboard.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRolePermissionBits.ProjectManager),
});

export { ManageTeamMemberCreatePage, ManageTeamMembersCreateRoute };
