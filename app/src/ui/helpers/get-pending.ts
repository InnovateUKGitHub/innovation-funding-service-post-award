import { LoadingStatus } from "@framework/constants/enums";
import { Pending } from "@shared/pending";
import { isEmpty } from "./is-empty";

type IPendingStatus = "IDLE" | "LOADING" | "RESOLVED" | "REJECTED";

/**
 * gets pending status
 */
export function getPending<T>({ state, data, error = undefined }: Pending<T>) {
  const shouldCheckData = state === LoadingStatus.Loading || state === LoadingStatus.Stale;

  // Note: We coerce this as an object as that is what is returned -> new Pending()
  const displayLoading = shouldCheckData ? isEmpty(data as unknown as object) : false;

  const newPendingStatusWorkflow: Record<LoadingStatus, IPendingStatus> = {
    [LoadingStatus.Preload]: "IDLE",
    [LoadingStatus.Loading]: displayLoading ? "LOADING" : "RESOLVED",
    [LoadingStatus.Stale]: displayLoading ? "LOADING" : "RESOLVED",
    [LoadingStatus.Done]: "RESOLVED",
    [LoadingStatus.Failed]: "REJECTED",
    [LoadingStatus.Updated]: "RESOLVED",
  };

  const status: IPendingStatus = newPendingStatusWorkflow[state];

  const isLoading = status === "LOADING";
  const isIdle = status === "IDLE";
  const isResolved = status === "RESOLVED";
  const isRejected = status === "REJECTED";

  // Note: Ensure data is resolved before returning it (undefined escape hatch)
  const payload = (isResolved && data) || undefined;

  return {
    payload,
    error,
    isIdle,
    isLoading: isLoading || isIdle,
    isResolved,
    isRejected,
  };
}
