import { Content } from "@content/content";
import { useAppParams } from "@ui/features/use-app-params";
import { getPending } from "@ui/helpers/get-pending";
import { useStores } from "@ui/redux";

// Note: We assume this is could be present to make the conditional rendering
interface GenericParams {
  projectId: string | undefined;
}

/**
 * @description Returns the content solution based on the availability of the projectId (used based on condition competitionType rendering)
 */
export function useInitContent(): Content {
  const { projectId } = useAppParams<GenericParams>();

  const stores = useStores();

  // Note: It is likely that the visitor is on a non-project page or dev has forgotten 'projectId' in getParams()
  if (!projectId) return new Content();

  const { payload } = getPending(stores.projects.getById(projectId));

  return new Content(payload?.competitionType);
}
