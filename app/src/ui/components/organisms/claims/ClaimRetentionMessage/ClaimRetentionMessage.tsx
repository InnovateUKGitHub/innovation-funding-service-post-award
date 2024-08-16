import { ClaimOverrideRateDto } from "@framework/dtos/claimOverrideRate";
import { CostsSummaryForPeriodDto } from "@framework/dtos/costsSummaryForPeriodDto";
import { PartnerDtoGql } from "@framework/dtos/partnerDto";
import { getAwardRate } from "@framework/util/awardRate";
import { multiplyCurrency, roundCurrency } from "@framework/util/numberHelper";
import { useContent } from "@ui/hooks/content.hook";
import { useMemo } from "react";
import { ValidationMessage } from "../../../molecules/validation/ValidationMessage/ValidationMessage";

const ClaimRetentionMessage = ({
  partner,
  claimDetails,
  claimOverrides,
  periodId,
}: {
  partner: Pick<PartnerDtoGql, "capLimitGrant" | "totalGrantApproved" | "id" | "awardRate">;
  claimDetails: Pick<CostsSummaryForPeriodDto, "costsClaimedThisPeriod" | "costCategoryId">[];
  claimOverrides: ClaimOverrideRateDto;
  periodId: PeriodId;
}) => {
  const { getContent } = useContent();

  const totalCostsClaimedThisPeriod = useMemo(
    () =>
      // No need to round currency here since it's rounded further down
      claimDetails.reduce(
        (sum, x) =>
          sum +
          multiplyCurrency(
            x.costsClaimedThisPeriod,
            getAwardRate({ partner, claimOverrides, costCategoryId: x.costCategoryId, periodId }),
          ),
        0,
      ),
    [claimDetails, claimOverrides, partner, periodId],
  );

  if (roundCurrency((partner.totalGrantApproved ?? 0) + totalCostsClaimedThisPeriod) > partner.capLimitGrant) {
    return (
      <ValidationMessage message={getContent(x => x.components.claimRetentionMessage.message)} messageType="info" />
    );
  }

  return null;
};

export { ClaimRetentionMessage };
