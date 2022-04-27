import { useEffect } from "react";

import { useStores } from "@ui/redux";
import { scrollToTheTopInstantly } from "@framework/util";
import { useAppParams } from "@ui/features/use-app-params";

/**
 * @description This dispatches preflight requests thus avoiding loading, prefer static data which is unlikely to frequently change.
 *
 * Notice this is not invoked within any react hooks, these DO NOT RUN on SSR (Server Side Request)
 */
export function useAppMount(): void {
  const { projectId } = useAppParams<{ projectId?: string }>();
  const stores = useStores();

  if (projectId) {
    stores.projects.isValidProject(projectId);

    stores.partners.getPartnersForProject(projectId);
  }

  // Note: Refactored from <Link /> - keep scroll position on page loads
  useEffect(() => {
    scrollToTheTopInstantly();
  }, []);
}
