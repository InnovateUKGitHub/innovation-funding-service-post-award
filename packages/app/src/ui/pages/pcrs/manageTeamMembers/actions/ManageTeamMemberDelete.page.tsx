import { ManageTeamMemberMethod } from "@framework/constants/pcrConstants";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { defineRoute } from "@ui/app/containerBase";
import { ManageTeamMemberRole, ManageTeamMemberUpdateDeleteProps } from "../ManageTeamMember.logic";
import { BaseManageTeamMember, ManageTeamMemberModifyProps } from "./ManageTeamMemberCrud";
import { ManageTeamMemberForm } from "./components/ManageTeamMemberForm";
import { ManageTeamMemberSection } from "./components/ManageTeamMemberSection";
import { ManageTeamMemberSubmitSection } from "./components/ManageTeamMemberSubmitSection";
import { SelectTeamMember } from "./components/SelectTeamMember";
import { ManageTeamMemberDateInput } from "./components/inputs/ManageTeamMemberDateInput";
import { useContent } from "@ui/hooks/content.hook";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { ManageTeamMemberEndDate } from "./components/displays/ManageTeamMemberEndDate";

const ManageTeamMemberDeletePage = (props: ManageTeamMemberModifyProps) => {
  const { getContent } = useContent();

  return (
    <BaseManageTeamMember {...props} method={ManageTeamMemberMethod.DELETE}>
      <SelectTeamMember />
      <ManageTeamMemberForm>
        <ManageTeamMemberSection>
          <P>
            {getContent(
              x => x.pages.manageTeamMembers.modify.messages.projectManageTeamMembersDelete[props.role].message,
            )}
          </P>
          <ManageTeamMemberEndDate bold />
          <ManageTeamMemberDateInput visible bold type="endDate" />
        </ManageTeamMemberSection>
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
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRolePermissionBits.ProjectManager),
});

export { ManageTeamMemberDeletePage, ManageTeamMembersDeleteRoute };
