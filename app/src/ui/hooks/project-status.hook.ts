import { useContext } from "react";

import { useStores } from "@ui/redux";
import { getPending } from "@ui/helpers/get-pending";
import { ProjectActiveContext, ProjectStatusContext } from "@ui/context/project-status";
import { ProjectStatus } from "@framework/constants";

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
export function useProjectStatusCheck(projectId: string | undefined, overrideAccess: boolean): ProjectStatusContext {
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
