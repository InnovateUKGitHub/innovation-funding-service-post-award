import { ProjectRole } from "@framework/constants/project";
import { defineRoute } from "@ui/containers/containerBase";
import { ManageTeamMemberRole, ManageTeamMemberUpdateDeleteProps } from "../ManageTeamMember.logic";
import { BaseManageTeamMember, ManageTeamMemberModifyProps } from "./BaseManageTeamMember";
import { ManageTeamMemberSection } from "./components/ManageTeamMemberSection";
import { SelectTeamMember } from "./components/SelectTeamMember";
import { ManageTeamMemberForm } from "./components/ManageTeamMemberForm";
import { ManageTeamMemberSubmitSection } from "./components/ManageTeamMemberSubmitSection";
import { ManageTeamMemberMethod } from "@framework/constants/pcrConstants";

const ManageTeamMemberDeletePage = (props: ManageTeamMemberModifyProps) => {
  return (
    <BaseManageTeamMember {...props} method={ManageTeamMemberMethod.DELETE}>
      <SelectTeamMember />
      <ManageTeamMemberForm>
        <ManageTeamMemberSection />
        <ManageTeamMemberSubmitSection />
      </ManageTeamMemberForm>
    </BaseManageTeamMember>
  );
};

const ManageTeamMembersDeleteRoute = defineRoute<ManageTeamMemberUpdateDeleteProps>({
  routeName: "ManageTeamMembersDelete",
  routePath: "/projects/:projectId/details/manage-team-members/delete/:role/:pclId",
  container: ManageTeamMemberDeletePage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    role: route.params.role as ManageTeamMemberRole,
    pclId: route.params.pclId as ProjectContactLinkId,
    method: ManageTeamMemberMethod.DELETE,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.manageTeamMembers.dashboard.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});

export { ManageTeamMemberDeletePage, ManageTeamMembersDeleteRoute };
