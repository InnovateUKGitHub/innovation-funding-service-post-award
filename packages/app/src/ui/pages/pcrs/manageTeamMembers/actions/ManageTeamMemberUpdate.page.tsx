import { ManageTeamMemberRole, ManageTeamMemberUpdateDeleteProps } from "../ManageTeamMember.logic";
import { BaseManageTeamMember, ManageTeamMemberModifyProps } from "./ManageTeamMemberCrud";
import { ManageTeamMemberSection } from "./components/ManageTeamMemberSection";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { defineRoute } from "@ui/app/containerBase";
import { ManageEmailMessage } from "./components/ManageEmailMessage";
import { ManageTeamMemberForm } from "./components/ManageTeamMemberForm";
import { ManageTeamMemberSubmitSection } from "./components/ManageTeamMemberSubmitSection";
import { ManageTeamMemberMethod } from "@framework/constants/pcrConstants";
import { ManageTeamMemberNameInput } from "./components/inputs/ManageTeamMemberNameInput";
import { ManageTeamMemberProjectParticipantInput } from "./components/inputs/ManageTeamMemberProjectParticipantInput";
import { ManageTeamMemberEmailInput } from "./components/inputs/ManageTeamMemberEmailInput";

const ManageTeamMemberUpdatePage = (props: ManageTeamMemberModifyProps) => {
  return (
    <BaseManageTeamMember {...props} method={ManageTeamMemberMethod.UPDATE}>
      <ManageTeamMemberForm>
        <ManageTeamMemberSection>
          <ManageTeamMemberNameInput />
          <ManageTeamMemberProjectParticipantInput readOnly />
          <ManageTeamMemberEmailInput readOnly />
          <ManageEmailMessage />
        </ManageTeamMemberSection>
        <ManageTeamMemberSubmitSection />
      </ManageTeamMemberForm>
    </BaseManageTeamMember>
  );
};

const ManageTeamMembersUpdateRoute = defineRoute<ManageTeamMemberUpdateDeleteProps>({
  routeName: "ManageTeamMembersUpdate",
  routePath: "/projects/:projectId/details/manage-team-members/update/:role/:pclId",
  container: ManageTeamMemberUpdatePage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    role: route.params.role as ManageTeamMemberRole,
    pclId: route.params.pclId as ProjectContactLinkId,
    method: ManageTeamMemberMethod.UPDATE,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.manageTeamMembers.dashboard.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRolePermissionBits.ProjectManager),
});

export { ManageTeamMemberUpdatePage, ManageTeamMembersUpdateRoute };
