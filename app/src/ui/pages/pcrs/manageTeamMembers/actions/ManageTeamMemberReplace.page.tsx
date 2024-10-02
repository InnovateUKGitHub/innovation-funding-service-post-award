import { ManageTeamMemberReplaceProps } from "../ManageTeamMember.logic";
import { BaseManageTeamMember, ManageTeamMemberModifyProps } from "./BaseManageTeamMember";
import { ManageTeamMemberSection } from "./components/ManageTeamMemberSection";
import { SelectTeamMember } from "./components/SelectTeamMember";
import { ManageTeamMemberInputs } from "./components/ManageTeamMemberInputs";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { defineRoute } from "@ui/app/containerBase";
import { ManageTeamMemberForm } from "./components/ManageTeamMemberForm";
import { ManageTeamMemberSubmitSection } from "./components/ManageTeamMemberSubmitSection";
import { ManageTeamMemberMethod } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/dtos/projectContactDto";

const ManageTeamMemberReplacePage = (props: ManageTeamMemberModifyProps) => {
  return (
    <BaseManageTeamMember {...props} method={ManageTeamMemberMethod.REPLACE}>
      <SelectTeamMember />
      <ManageTeamMemberForm>
        <ManageTeamMemberSection>
          <ManageTeamMemberInputs />
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
    role: route.params.role as ProjectRole,
    pclId: route.params.pclId as ProjectContactLinkId | undefined,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.manageTeamMembers.dashboard.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRolePermissionBits.ProjectManager),
});

export { ManageTeamMemberReplacePage, ManageTeamMembersReplaceRoute };
