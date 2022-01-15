import { useStores } from "@ui/redux";

/**
 * @description This dispatches preflight requests thus avoiding loading, prefer static data which is unlikely to frequently change.
 *
 * Notice this is not invoked within any react hooks, these DO NOT RUN on SSR (Server Side Request)
 */
export function useAppMount(projectId?: string): void {
  const stores = useStores();

  if (projectId) {
    stores.projects.isValidProject(projectId);

    stores.partners.getPartnersForProject(projectId);
  }
}
