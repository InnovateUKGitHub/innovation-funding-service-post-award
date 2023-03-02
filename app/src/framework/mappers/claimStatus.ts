import { PartnerClaimStatus } from "@framework/constants";
import { ClaimStatus } from "@framework/constants";

/**
 * converts salesforce labels to claim status enum
 */
export function getClaimStatus(salesforceStatus: string): PartnerClaimStatus {
  switch (salesforceStatus) {
    case "No Claims Due":
      return PartnerClaimStatus.NoClaimsDue;
    case "Claim Due":
      return PartnerClaimStatus.ClaimDue;
    case "Claims Overdue":
      return PartnerClaimStatus.ClaimsOverdue;
    case "Claim Queried":
      return PartnerClaimStatus.ClaimQueried;
    case "Claim Submitted":
      return PartnerClaimStatus.ClaimSubmitted;
    case "Awaiting IAR":
      return PartnerClaimStatus.IARRequired;
    default:
      return PartnerClaimStatus.Unknown;
  }
}

export const mapToClaimStatus = (status: string): ClaimStatus => {
  for (const claimStatus in ClaimStatus) {
    if (status === ClaimStatus[claimStatus as keyof typeof ClaimStatus]) return status;
  }
  return ClaimStatus.UNKNOWN;
};
