import { Copy } from "@copy/Copy";
import { getPending } from "@ui/helpers/get-pending";
import { Params } from "@ui/helpers/make-url";
import { useStores } from "@ui/redux";

/**
 * @description Returns the content solution based on the availability of the projectId (used based on condition competitionType rendering)
 */
export function useInitContent(params?: Params): Copy {
  const stores = useStores();

  // Note: It is likely that the visitor is on a non-project page or dev has forgotten 'projectId' in getParams()
  if (params && typeof params.projectId === "string") {
    const { payload } = getPending(stores.projects.getById(params.projectId));
    return new Copy(payload?.competitionType);
  } else {
    return new Copy();
  }
}
