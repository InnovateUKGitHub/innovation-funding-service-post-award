import { ManageTeamMemberReplaceProps, ManageTeamMemberRole } from "../ManageTeamMember.logic";
import { BaseManageTeamMember, ManageTeamMemberModifyProps } from "./ManageTeamMemberCrud";
import { ManageTeamMemberSection } from "./components/ManageTeamMemberSection";
import { SelectTeamMember } from "./components/SelectTeamMember";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { defineRoute } from "@ui/app/containerBase";
import { ManageTeamMemberForm } from "./components/ManageTeamMemberForm";
import { ManageTeamMemberSubmitSection } from "./components/ManageTeamMemberSubmitSection";
import { ManageTeamMemberMethod } from "@framework/constants/pcrConstants";
import { ManageTeamMemberNameInput } from "./components/inputs/ManageTeamMemberNameInput";
import { ManageTeamMemberProjectParticipantInput } from "./components/inputs/ManageTeamMemberProjectParticipantInput";
import { ManageTeamMemberEmailInput } from "./components/inputs/ManageTeamMemberEmailInput";
import { ManageTeamMemberDateInput } from "./components/inputs/ManageTeamMemberDateInput";

const ManageTeamMemberReplacePage = (props: ManageTeamMemberModifyProps) => {
  return (
    <BaseManageTeamMember {...props} method={ManageTeamMemberMethod.REPLACE}>
      <SelectTeamMember />
      <ManageTeamMemberForm>
        <ManageTeamMemberSection>
          <ManageTeamMemberNameInput />
          <ManageTeamMemberProjectParticipantInput readOnly />
          <ManageTeamMemberEmailInput />
          <ManageTeamMemberDateInput visible type="startDate" />
        </ManageTeamMemberSection>
        <ManageTeamMemberSubmitSection />
      </ManageTeamMemberForm>
    </BaseManageTeamMember>
  );
};

const ManageTeamMembersReplaceRoute = defineRoute<ManageTeamMemberReplaceProps>({
  routeName: "ManageTeamMembersReplace",
  routePath: "/projects/:projectId/details/manage-team-members/replace/:role",
  routePathWithQuery: "/projects/:projectId/details/manage-team-members/replace/:role?:pclId",
  container: ManageTeamMemberReplacePage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    role: route.params.role as ManageTeamMemberRole,
    pclId: route.params.pclId as ProjectContactLinkId | undefined,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.manageTeamMembers.dashboard.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRolePermissionBits.ProjectManager),
});

export { ManageTeamMemberReplacePage, ManageTeamMembersReplaceRoute };
