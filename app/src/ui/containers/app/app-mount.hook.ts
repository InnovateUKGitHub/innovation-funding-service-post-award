import { useEffect } from "react";

import { scrollToTheTopInstantly } from "@framework/util";
import { Params } from "@ui/helpers/make-url";
import { useStores } from "@ui/redux";

/**
 * @description This dispatches preflight requests thus avoiding loading, prefer static data which is unlikely to frequently change.
 *
 * Notice this is not invoked within any react hooks, these DO NOT RUN on SSR (Server Side Request)
 */
export function useAppMount(params: Params): void {
  const { projectId } = params;
  const stores = useStores();

  if (typeof projectId === "string") {
    stores.projects.isValidProject(projectId);
    stores.partners.getPartnersForProject(projectId);
  }

  // Note: Refactored from <Link /> - keep scroll position on page loads
  useEffect(() => {
    scrollToTheTopInstantly();
  }, []);
}
