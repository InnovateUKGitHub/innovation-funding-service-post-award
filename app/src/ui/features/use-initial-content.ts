import { Content } from "@content/content";
import { getPending } from "@ui/helpers/get-pending";
import { Params } from "@ui/helpers/make-url";
import { useStores } from "@ui/redux";

// Note: We assume this is could be present to make the conditional rendering
interface GenericParams {
  projectId: string | undefined;
}

/**
 * @description Returns the content solution based on the availability of the projectId (used based on condition competitionType rendering)
 */
export function useInitContent(params?: Params): Content {
  const stores = useStores();

  // Note: It is likely that the visitor is on a non-project page or dev has forgotten 'projectId' in getParams()
  if (params && typeof params.projectId === "string") {
    const { payload } = getPending(stores.projects.getById(params.projectId));
    return new Content(payload?.competitionType);
  } else {
    return new Content();
  }
}
