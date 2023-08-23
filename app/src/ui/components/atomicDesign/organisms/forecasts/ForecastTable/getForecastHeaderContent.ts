import { ContentSelector } from "@copy/type";
import { ClaimStatus } from "@framework/constants/claimStatus";

export enum ClaimStatusGroup {
  CLAIMED,
  EDITABLE_CLAIMING,
  SUBMITTED_CLAIMING,
  FORECAST,
  UNUSED,
}

const getClaimStatusGroup = (status: ClaimStatus) => {
  switch (status) {
    case ClaimStatus.UNKNOWN:
    case ClaimStatus.NEW:
      return ClaimStatusGroup.FORECAST;
    case ClaimStatus.DRAFT:
    case ClaimStatus.MO_QUERIED:
    case ClaimStatus.INNOVATE_QUERIED:
      return ClaimStatusGroup.EDITABLE_CLAIMING;
    case ClaimStatus.SUBMITTED:
    case ClaimStatus.AWAITING_IUK_APPROVAL:
    case ClaimStatus.AWAITING_IAR:
    case ClaimStatus.PAYMENT_REQUESTED:
      return ClaimStatusGroup.SUBMITTED_CLAIMING;
    case ClaimStatus.APPROVED:
    case ClaimStatus.PAID:
      return ClaimStatusGroup.CLAIMED;
    case ClaimStatus.NOT_USED:
      return ClaimStatusGroup.UNUSED;
  }
};

const getForecastHeaderContent = (status: ClaimStatusGroup): ContentSelector => {
  switch (status) {
    case ClaimStatusGroup.FORECAST:
      return x => x.components.forecastTable.forecastHeader;
    case ClaimStatusGroup.EDITABLE_CLAIMING:
    case ClaimStatusGroup.SUBMITTED_CLAIMING:
      return x => x.components.forecastTable.costsClaimingHeader;
    case ClaimStatusGroup.CLAIMED:
      return x => x.components.forecastTable.costsClaimedHeader;
    case ClaimStatusGroup.UNUSED:
      return x => x.components.forecastTable.unusedHeader;
  }
};

export { getClaimStatusGroup, getForecastHeaderContent };
