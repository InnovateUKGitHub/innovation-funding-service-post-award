import { ProjectRole } from "@framework/constants/project";
import { defineRoute } from "../containerBase";
import { PcrUpdateSelectedContainer } from "./modifyOptions/PcrModifyOptions";

export const ProjectChangeRequestAddTypeRoute = defineRoute({
  routeName: "projectChangeRequestAddType",
  routePath: "/projects/:projectId/pcrs/:projectChangeRequestId/prepare/add",
  container: PcrUpdateSelectedContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    projectChangeRequestId: route.params.projectChangeRequestId as PcrId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrModifyOptions.updateTitle),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});
