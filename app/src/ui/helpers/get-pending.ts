import { LoadingStatus } from "@framework/constants/enums";
import { Pending } from "@shared/pending";

type IPendingStatus = "IDLE" | "LOADING" | "RESOLVED" | "REJECTED";

export function getPending<T>({ state, data, error }: Pending<T>) {
  const newPendingStatusWorkflow: Record<LoadingStatus, IPendingStatus> = {
    [LoadingStatus.Preload]: "IDLE",
    [LoadingStatus.Loading]: data ? "RESOLVED" : "LOADING",
    [LoadingStatus.Stale]: data ? "RESOLVED" : "LOADING",
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
    error: error ?? undefined,
    isIdle,
    isLoading: isLoading || isIdle,
    isResolved,
    isRejected,
  };
}
