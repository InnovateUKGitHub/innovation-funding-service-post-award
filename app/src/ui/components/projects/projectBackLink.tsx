import { IRoutes } from "@ui/routing";
import { BackLink } from "../links";

interface Props {
  projectId: ProjectId;
  routes: IRoutes;
}

export const ProjectBackLink = (props: Props) => (
  <BackLink route={props.routes.projectOverview.getLink({ projectId: props.projectId })}>Back to project</BackLink>
);
