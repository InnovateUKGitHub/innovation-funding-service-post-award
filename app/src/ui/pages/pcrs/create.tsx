import { ProjectRole } from "@framework/constants/project";
import { defineRoute } from "../../app/containerBase";
import { PcrCreateSelectedContainer } from "./modifyOptions/PcrModifyOptions";

export const PCRCreateRoute = defineRoute({
  routeName: "pcrCreate",
  routePath: "/projects/:projectId/pcrs/create",
  container: PcrCreateSelectedContainer,
  getParams: route => ({ projectId: route.params.projectId as ProjectId }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrModifyOptions.createTitle),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager),
});
