import { BackLink } from "../../../atoms/Links/links";
import { useRoutes } from "@ui/context/routesProvider";

interface Props {
  projectId: ProjectId;
  disabled?: boolean;
}

export const ProjectBackLink = ({ projectId, disabled }: Props) => {
  const routes = useRoutes();
  return (
    <BackLink route={routes.projectOverview.getLink({ projectId })} disabled={disabled}>
      Back to project
    </BackLink>
  );
};
