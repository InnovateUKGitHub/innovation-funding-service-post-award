import { ProjectOverviewRoute } from "@ui/containers";
import { BackLink } from "../links";

interface Props {
  projectId: string;
}

export const ProjectBackLink = (props: Props) => (
  <BackLink route={ProjectOverviewRoute.getLink({ projectId: props.projectId })}>Back to project</BackLink>
);
