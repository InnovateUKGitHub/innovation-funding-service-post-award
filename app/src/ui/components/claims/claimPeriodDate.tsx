import { ClaimDto } from "@framework/dtos/claimDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { getPartnerName } from "../partners/partnerName";
import { ShortDateRange } from "../renderers/date";

export interface ClaimPeriodProps {
  claim: Pick<ClaimDto, "periodId" | "periodStartDate" | "periodEndDate">;
  partner?: Pick<PartnerDto, "name" | "isWithdrawn" | "isLead">;
}

export const ClaimPeriodDate = ({ claim, partner }: ClaimPeriodProps) => {
  const partnerClaim = "claim for period";
  const fallbackClaimPeriod = "Period";
  const periodId = claim.periodId + ":";
  const periodPrefix = partner ? `${getPartnerName(partner)} ${partnerClaim}` : fallbackClaimPeriod;

  return (
    <>
      {periodPrefix} {periodId} <ShortDateRange start={claim.periodStartDate} end={claim.periodEndDate} />
    </>
  );
};
