import { ProjectStatus } from "@framework/constants/project";
import { ProjectStatusContext, ProjectActiveContext } from "@ui/context/project-status";
import { getPending } from "@ui/helpers/get-pending";
import { useStores } from "@ui/redux/storesProvider";
import { useContext } from "react";

const initialProjectStatusState: ProjectStatusContext = {
  overrideAccess: false,
  isActive: true,
  status: ProjectStatus.Unknown,
};

/**
 * **useProjectStatus**
 *
 * hook gets projectStatus from the ProjectActiveContext.
 * defaults to initial project status state.
 */
export function useProjectStatus(): ProjectStatusContext {
  const projectStatus = useContext(ProjectActiveContext);

  // Note: Typically we throw an error for missing context, but here we provide a fallback state
  return projectStatus ?? initialProjectStatusState;
}

/**
 * @description Checks the project payload to decisions on the status
 *
 * We avoid useEffect/useCallback since this does not run on the server
 */
export function useProjectStatusCheck(projectId: ProjectId | undefined, overrideAccess: boolean): ProjectStatusContext {
  const stores = useStores();

  if (!projectId) return initialProjectStatusState;

  const validateProjectPending = stores.projects.isValidProject(projectId);
  const { isRejected, isResolved, payload, error } = getPending(validateProjectPending);

  if (isRejected) {
    const readableError = JSON.stringify(error);

    throw Error(`Could not get project status for '${projectId}'. Error => ${readableError}`);
  }

  if (!(isResolved && payload)) return initialProjectStatusState;

  return {
    overrideAccess,
    isActive: payload.isActive,
    status: payload.status,
  };
}
