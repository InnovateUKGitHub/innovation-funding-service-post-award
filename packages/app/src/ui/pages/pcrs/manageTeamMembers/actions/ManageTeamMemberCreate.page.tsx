import { ManageTeamMemberCreateProps, ManageTeamMemberRole } from "../ManageTeamMember.logic";
import { BaseManageTeamMember, ManageTeamMemberModifyProps } from "./ManageTeamMemberCrud";
import { ManageTeamMemberSection } from "./components/ManageTeamMemberSection";
import { defineRoute } from "@ui/app/containerBase";
import { ManageTeamMemberForm } from "./components/ManageTeamMemberForm";
import { ManageTeamMemberSubmitSection } from "./components/ManageTeamMemberSubmitSection";
import { ManageTeamMemberMethod } from "@framework/constants/pcrConstants";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { ManageTeamMemberNameInput } from "./components/inputs/ManageTeamMemberNameInput";
import { ManageTeamMemberProjectParticipantInput } from "./components/inputs/ManageTeamMemberProjectParticipantInput";
import { ManageTeamMemberEmailInput } from "./components/inputs/ManageTeamMemberEmailInput";
import { ProjectRole } from "@framework/dtos/projectContactDto";
import { ManageTeamMemberDateInput } from "./components/inputs/ManageTeamMemberDateInput";

const ManageTeamMemberCreatePage = (props: ManageTeamMemberModifyProps) => {
  return (
    <BaseManageTeamMember {...props} method={ManageTeamMemberMethod.CREATE}>
      <ManageTeamMemberForm>
        <ManageTeamMemberSection>
          <ManageTeamMemberNameInput />
          <ManageTeamMemberProjectParticipantInput />
          <ManageTeamMemberEmailInput />
          <ManageTeamMemberDateInput visible={props.role === ProjectRole.ASSOCIATE} type="startDate" />
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
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRolePermissionBits.ProjectManager),
});

export { ManageTeamMemberCreatePage, ManageTeamMembersCreateRoute };
