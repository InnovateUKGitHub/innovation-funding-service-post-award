import { ProjectRole } from "@framework/constants/project";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { BaseManageTeamMember } from "./BaseManageTeamMember";
import {
  BaseManageTeamMemberProps,
  ManageTeamMemberCreateProps,
  ManageTeamMemberMethod,
  ManageTeamMemberUpdateDeleteProps,
  ManageTeamMemberRole,
  ManageTeamMemberReplaceProps,
} from "./BaseManageTeamMember.logic";

const ManageTeamMembersCreateRoute = defineRoute<ManageTeamMemberCreateProps>({
  routeName: "ManageTeamMembersCreate",
  routePath: "/projects/:projectId/details/manage-team-members/create/:role",
  container: (props: BaseProps & BaseManageTeamMemberProps) => (
    <BaseManageTeamMember {...props} method={ManageTeamMemberMethod.CREATE} />
  ),
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    role: route.params.role as ManageTeamMemberRole,
    pclId: undefined,
    method: ManageTeamMemberMethod.CREATE,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.manageTeamMembers.dashboard.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});

const ManageTeamMembersReplaceRoute = defineRoute<ManageTeamMemberReplaceProps>({
  routeName: "ManageTeamMembersReplace",
  routePath: "/projects/:projectId/details/manage-team-members/replace/:role",
  routePathWithQuery: "/projects/:projectId/details/manage-team-members/replace/:role?:pclId",
  container: (props: BaseProps & BaseManageTeamMemberProps) => (
    <BaseManageTeamMember {...props} method={ManageTeamMemberMethod.REPLACE} />
  ),
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    role: route.params.role as ManageTeamMemberRole,
    pclId: route.params.pclId as ProjectContactLinkId | undefined,
    method: ManageTeamMemberMethod.REPLACE,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.manageTeamMembers.dashboard.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});

const ManageTeamMembersUpdateRoute = defineRoute<ManageTeamMemberUpdateDeleteProps>({
  routeName: "ManageTeamMembersUpdate",
  routePath: "/projects/:projectId/details/manage-team-members/update/:role/:pclId",
  container: (props: BaseProps & BaseManageTeamMemberProps) => (
    <BaseManageTeamMember {...props} method={ManageTeamMemberMethod.UPDATE} />
  ),
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    role: route.params.role as ManageTeamMemberRole,
    pclId: route.params.pclId as ProjectContactLinkId,
    method: ManageTeamMemberMethod.UPDATE,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.manageTeamMembers.dashboard.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});

const ManageTeamMembersDeleteRoute = defineRoute<ManageTeamMemberUpdateDeleteProps>({
  routeName: "ManageTeamMembersDelete",
  routePath: "/projects/:projectId/details/manage-team-members/delete/:role/:pclId",
  container: (props: BaseProps & BaseManageTeamMemberProps) => (
    <BaseManageTeamMember {...props} method={ManageTeamMemberMethod.DELETE} />
  ),
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    role: route.params.role as ManageTeamMemberRole,
    pclId: route.params.pclId as ProjectContactLinkId,
    method: ManageTeamMemberMethod.DELETE,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.manageTeamMembers.dashboard.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});

export {
  ManageTeamMembersCreateRoute,
  ManageTeamMembersReplaceRoute,
  ManageTeamMembersUpdateRoute,
  ManageTeamMembersDeleteRoute,
};
