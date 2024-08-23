import { Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { useRoutes } from "@ui/context/routesProvider";
import { useContent } from "@ui/hooks/content.hook";
import { ManageTeamMemberRole } from "../BaseManageTeamMember.logic";

interface ManageTeamMembersModifyProps {
  projectId: ProjectId;
  pclId: ProjectContactLinkId;
  role: ManageTeamMemberRole;
}

const ManageTeamMemberReplaceLink = (props: ManageTeamMembersModifyProps) => {
  const routes = useRoutes();
  const { getContent } = useContent();

  return (
    <Link route={routes.manageTeamMembersReplaceRoute.getLink(props)}>
      {getContent(x => x.pages.manageTeamMembers.dashboard.replace)}
    </Link>
  );
};

const ManageTeamMemberEditLink = (props: ManageTeamMembersModifyProps) => {
  const routes = useRoutes();
  const { getContent } = useContent();

  return (
    <Link route={routes.manageTeamMembersUpdateRoute.getLink(props)}>
      {getContent(x => x.pages.manageTeamMembers.dashboard.edit)}
    </Link>
  );
};

const ManageTeamMemberRemoveLink = (props: ManageTeamMembersModifyProps) => {
  const routes = useRoutes();
  const { getContent } = useContent();

  return (
    <Link route={routes.manageTeamMembersDeleteRoute.getLink(props)}>
      {getContent(x => x.pages.manageTeamMembers.dashboard.remove)}
    </Link>
  );
};

export { ManageTeamMemberEditLink, ManageTeamMemberRemoveLink, ManageTeamMemberReplaceLink };
