import { IRoutes } from "@ui/routing/routeConfig";
import { BackLink } from "../../../atoms/Links/links";

interface Props {
  projectId: ProjectId;
  routes: IRoutes;
}

export const ProjectBackLink = (props: Props) => (
  <BackLink route={props.routes.projectOverview.getLink({ projectId: props.projectId })}>Back to project</BackLink>
);
