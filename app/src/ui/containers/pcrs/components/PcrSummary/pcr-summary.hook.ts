import { PCRItemType } from "@framework/types";

import { PcrSummaryProps, PcrSummaryResponse } from "./pcr-summary.interface";
import { partnerSummaryData } from "./summary-sections/reallocate-costs";

// TODO: Investigate useMemo for inbound props!
export function usePcrSummary({ type, partners, virement }: PcrSummaryProps): PcrSummaryResponse {
  if (type === PCRItemType.MultiplePartnerFinancialVirement) {
    return partnerSummaryData({ partners, virement });
  }

  return {
    data: null,
    isSummaryValid: true,
  };
}
