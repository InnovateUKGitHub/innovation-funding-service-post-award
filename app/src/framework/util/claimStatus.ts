import { PartnerClaimStatus } from "@framework/constants";

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
