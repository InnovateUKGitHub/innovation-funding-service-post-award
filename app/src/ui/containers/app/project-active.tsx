import { ProjectStatusContext, ProjectStatusProvider } from "@ui/context/project-status";
import { useProjectStatus, useProjectStatusCheck } from "@ui/hooks/project-status.hook";

interface ProjectStatusCheckProps {
  projectId: string | undefined;
  children: React.ReactElement;
  overrideAccess: boolean;
}

/**
 * @description Adds context tree if projectId is available, all nested routes will be aware of the project status
 * @deprecated Refactor and consume useProjectStatusCheck() when App is a functional component
 */
export function ProjectStatusCheck({ projectId, overrideAccess, ...props }: ProjectStatusCheckProps) {
  const statusValue = useProjectStatusCheck(projectId, overrideAccess);

  return <ProjectStatusProvider value={statusValue} {...props} />;
}

interface GetProjectStatusProps {
  children(projectStatus: ProjectStatusContext): React.ReactElement | null;
}

/**
 * @deprecated Consume this if you are a Class Compoent otherwise favour useProjectStatus()
 */
export function GetProjectStatus(props: GetProjectStatusProps) {
  const projectStatus = useProjectStatus();

  return props.children(projectStatus);
}
