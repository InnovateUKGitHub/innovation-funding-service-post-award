import sumBy from "lodash/sumBy";
import { PartnerDtoGql } from "@framework/dtos/partnerDto";
import { roundCurrency } from "@framework/util/numberHelper";
import { useContent } from "@ui/hooks/content.hook";
import { ValidationMessage } from "../validationMessage";
import { CostsSummaryForPeriodDto } from "@framework/dtos/costsSummaryForPeriodDto";

const ClaimRetentionMessage = ({
  partner,
  claimDetails,
}: {
  partner: Pick<PartnerDtoGql, "capLimitGrant" | "totalParticipantCostsClaimed">;
  claimDetails: Pick<CostsSummaryForPeriodDto, "costsClaimedThisPeriod">[];
}) => {
  const { getContent } = useContent();
  const totalCostsClaimedThisPeriod = sumBy(claimDetails, "costsClaimedThisPeriod");

  if (
    roundCurrency((partner.totalParticipantCostsClaimed ?? 0) + totalCostsClaimedThisPeriod) > partner.capLimitGrant
  ) {
    return (
      <ValidationMessage message={getContent(x => x.components.claimRetentionMessage.message)} messageType="info" />
    );
  }

  return null;
};

export { ClaimRetentionMessage };
