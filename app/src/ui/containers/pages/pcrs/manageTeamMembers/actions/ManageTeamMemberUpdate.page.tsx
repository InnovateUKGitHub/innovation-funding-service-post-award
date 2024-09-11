import {
  ManageTeamMemberMethod,
  ManageTeamMemberRole,
  ManageTeamMemberUpdateDeleteProps,
} from "../ManageTeamMember.logic";
import { BaseManageTeamMember, ManageTeamMemberModifyProps } from "./BaseManageTeamMember";
import { ManageTeamMemberSection } from "./components/ManageTeamMemberSection";
import { ManageTeamMemberInputs } from "./components/ManageTeamMemberInputs";
import { ProjectRole } from "@framework/constants/project";
import { defineRoute } from "@ui/containers/containerBase";
import { ManageEmailMessage } from "./components/ManageEmailMessage";
import { ManageTeamMemberForm } from "./components/ManageTeamMemberForm";
import { ManageTeamMemberSubmitSection } from "./components/ManageTeamMemberSubmitSection";

const ManageTeamMemberUpdatePage = (props: ManageTeamMemberModifyProps) => {
  return (
    <BaseManageTeamMember {...props} method={ManageTeamMemberMethod.UPDATE}>
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
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});

export { ManageTeamMemberUpdatePage, ManageTeamMembersUpdateRoute };
