import { useEffect } from "react";

import { scrollToTheTopInstantly } from "@framework/util";
import { useStores } from "@ui/redux";

/**
 * @description This dispatches preflight requests thus avoiding loading, prefer static data which is unlikely to frequently change.
 *
 * Notice this is not invoked within any react hooks, these DO NOT RUN on SSR (Server Side Request)
 */
export function useAppMount<T extends { projectId?: ProjectId | undefined | null }>(params: T): void {
  const { projectId } = params;
  const stores = useStores();

  if (typeof projectId === "string") {
    stores.projects.isValidProject(projectId);
    stores.partners.getPartnersForProject(projectId);
  }

  const pathname = typeof window !== "undefined" ? window?.location?.pathname : "";
  // Note: Refactored from <Link /> - keep scroll position on page loads
  useEffect(() => {
    scrollToTheTopInstantly();
  }, [pathname]);
}
