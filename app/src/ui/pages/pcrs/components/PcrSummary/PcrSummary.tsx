import { createContext, ReactElement, useContext } from "react";

import { PcrSummaryResponse, PcrSummaryProps } from "./pcr-summary.interface";
import { usePcrSummary } from "./pcr-summary.hook";

/**
 * Context Setup
 *
 * @description provides mechanism to access PCRItem specific summary-only payloads to nested children
 */
const PcrSummaryContext = createContext<PcrSummaryResponse | undefined>(undefined);

export const usePcrSummaryContext = (): PcrSummaryResponse => {
  const context = useContext(PcrSummaryContext);

  if (!context) {
    throw new Error("usePcrSummaryContext must be used within a PcrSummaryProvider");
  }

  return context;
};

export interface PcrSummaryProviderProps extends PcrSummaryProps {
  children: ReactElement;
}

/**
 * PcrSummary Wrapper
 *
 * @description required to populate PCR specific summary to children
 */
export function PcrSummaryProvider({ children, ...summaryPayload }: PcrSummaryProviderProps) {
  const summaryData = usePcrSummary(summaryPayload);

  return <PcrSummaryContext.Provider value={summaryData}>{children}</PcrSummaryContext.Provider>;
}

export interface PcrSummaryConsumerProps {
  children: (summaryContext: PcrSummaryResponse) => ReactElement;
}

/**
 * PcrSummary Consumer
 *
 * @description An interim component created due to class based UI
 * @todo Deprecate this in favour of usePcrSummaryContext() directly
 */
export function PcrSummaryConsumer({ children }: PcrSummaryConsumerProps) {
  const context = usePcrSummaryContext();

  return children(context);
}
