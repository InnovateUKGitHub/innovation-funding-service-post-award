import { PartnerClaimStatus } from "@framework/constants";
import { ClaimStatus } from "@framework/constants";
import { PartnerDto } from "@framework/dtos";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";

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

export const mapClaimStatusValueToLabel = (value: string) => {
  switch (value) {
    case "Submitted":
      return "Submitted to Monitoring Officer";
    case "MO Queried":
      return "Queried by Monitoring Officer";
    case "Awaiting IAR":
      return "Independent accountant's report required";
    case "Awaiting IUK Approval":
      return "Submitted to Innovate UK";
    case "Innovate Queried":
      return "Queried by Innovate UK";
    case "Payment Requested":
      return "Payment requested from external funder";
    case "Approved":
      return "Payment being processed";
    default:
      return value;
  }
};

export const mapToClaimStatusLabel = (
  claimStatus: ClaimStatus,
  originalStatusLabel: string,
  competitionType: PartnerDto["competitionType"],
): string => {
  if (claimStatus !== ClaimStatus.AWAITING_IAR) return originalStatusLabel;

  const { isKTP } = checkProjectCompetition(competitionType);

  // Note: Only preform ClaimStatus.AWAITING_IAR label change
  return isKTP ? "Awaiting Schedule 3" : ClaimStatus.AWAITING_IAR;
};
