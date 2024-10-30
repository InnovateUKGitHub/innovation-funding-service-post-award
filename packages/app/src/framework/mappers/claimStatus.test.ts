import { PartnerClaimStatus } from "@framework/constants/partner";
import { getClaimStatus } from "./claimStatus";

describe("getClaimStatus", () => {
  test.each`
    claimStatus          | enumValue
    ${"No Claims Due"}   | ${PartnerClaimStatus.NoClaimsDue}
    ${"Claim Due"}       | ${PartnerClaimStatus.ClaimDue}
    ${"Claims Overdue"}  | ${PartnerClaimStatus.ClaimsOverdue}
    ${"Claim Queried"}   | ${PartnerClaimStatus.ClaimQueried}
    ${"Claim Submitted"} | ${PartnerClaimStatus.ClaimSubmitted}
    ${"Awaiting IAR"}    | ${PartnerClaimStatus.IARRequired}
    ${"Other"}           | ${PartnerClaimStatus.Unknown}
  `(
    "should convert $claimStatus to $enumValue",
    ({ claimStatus, enumValue }: { claimStatus: string; enumValue: PartnerClaimStatus }) => {
      expect(getClaimStatus(claimStatus)).toEqual(enumValue);
    },
  );
});
