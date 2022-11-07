import { getPending } from "@ui/helpers/get-pending";
import { useStores } from "@ui/redux";

/**
 * hook returns competition type from project id
 */
export function useCompetitionType(projectId: string | undefined): string | undefined {
  const { projects } = useStores();

  // Note: It is likely that the visitor is on a non-project page or dev has forgotten 'projectId' in getParams()
  if (!projectId) return undefined;

  const { isRejected, payload, error } = getPending(projects.getById(projectId));

  if (isRejected) {
    throw new Error(error ?? `There was an error getting the competitionType from projectId - ${projectId}`);
  }
  return payload?.competitionType ?? undefined;
}
