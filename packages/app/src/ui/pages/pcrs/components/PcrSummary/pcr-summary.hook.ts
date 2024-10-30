import { PCRItemType } from "@framework/constants/pcrConstants";
import { useState } from "react";
import { PcrSummaryProps, PcrSummaryResponse } from "./pcr-summary.interface";
import { partnerSummaryData } from "./summary-sections/reallocate-costs";

// TODO: Investigate useMemo for inbound props!

/**
 * hook to get state for PCR summary
 */
export function usePcrSummary({ type, partners, virement }: PcrSummaryProps): PcrSummaryResponse {
  const [allowSubmit, setButtonVisibility] = useState<boolean>(true);

  const handleSubmitDisplay = (enableSubmit: boolean): void => setButtonVisibility(enableSubmit);

  const summaryState: PcrSummaryResponse = {
    data: null,
    isSummaryValid: true,
    allowSubmit,
    handleSubmitDisplay,
  };

  if (type === PCRItemType.MultiplePartnerFinancialVirement) {
    const partnerVirementState = partnerSummaryData({ partners, virement });

    return {
      ...summaryState,
      ...partnerVirementState,
    };
  }

  return summaryState;
}
