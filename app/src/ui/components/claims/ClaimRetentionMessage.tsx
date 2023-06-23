import { ClaimDto } from "@framework/dtos/claimDto";
import { PartnerDtoGql } from "@framework/dtos/partnerDto";
import { roundCurrency } from "@framework/util/numberHelper";
import { useContent } from "@ui/hooks/content.hook";
import { ValidationMessage } from "../validationMessage";

const ClaimRetentionMessage = ({
  partner,
  claim,
}: {
  partner: Pick<PartnerDtoGql, "capLimitGrant" | "totalParticipantCostsClaimed">;
  claim: Pick<ClaimDto, "periodCostsToBePaid">;
}) => {
  const { getContent } = useContent();

  if (roundCurrency((partner.totalParticipantCostsClaimed ?? 0) + claim.periodCostsToBePaid) > partner.capLimitGrant) {
    return (
      <ValidationMessage message={getContent(x => x.components.claimRetentionMessage.message)} messageType="info" />
    );
  }

  return null;
};

export { ClaimRetentionMessage };
