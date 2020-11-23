import React from "react";
import { ClaimDto, PartnerDto } from "@framework/types";
import { ShortDateRange } from "../renderers/date";
import { getPartnerName, PartnerName } from "@ui/components";

export interface ClaimPeriodProps {
  claim: Pick<ClaimDto, "periodId" | "periodStartDate" | "periodEndDate">;
  partner?: Pick<PartnerDto, "name" | "isWithdrawn" | "isLead">;
}

export function getClaimPeriodDate({ claim, partner }: ClaimPeriodProps) {
  const partnerClaim = "claim for period";
  const fallbackClaimPeriod = "Period";
  const periodId = claim.periodId + ":";
  const periodPrefix = partner ? `${getPartnerName(partner)} ${partnerClaim}` : fallbackClaimPeriod;

  return (
    <>
      {periodPrefix} {periodId} <ShortDateRange start={claim.periodStartDate} end={claim.periodEndDate} />
    </>
  );
}

/**
 * @deprecated Please use getClaimPeriodDate()
 */
export const ClaimPeriodDate: React.FunctionComponent<ClaimPeriodProps> = (props) => {
  return getClaimPeriodDate(props);
};
