import { dataStoreHelper, editorStoreHelper, IDataSelector } from "./common";
import { ClaimDetailsDto, ClaimDetailsSummaryDto, ClaimDto, ClaimLineItemDto } from "../../models";
import { RootState } from "../reducers";
import { ClaimDtoValidator } from "../../validators/claimDtoValidator";
import { getCostCategories } from "./costCategories";
import { getKey } from "../../../util/key";

export const claimsStore = "claims";
export const findClaimsByPartner = (partnerId: string) => dataStoreHelper(claimsStore, `partnerId=${partnerId}`) as IDataSelector<ClaimDto[]>;

const claimStore = "claim";
export const getClaim = (partnerId: string, periodId: number) => dataStoreHelper(claimStore, getKey(partnerId, periodId)) as IDataSelector<ClaimDto>;

export const getClaimEditor = (partnerId: string, periodId: number) => editorStoreHelper<ClaimDto, ClaimDtoValidator>(
  claimStore,
  x => x.claim,
  (store) => createClaimEditorDto(partnerId, periodId, store),
  (claim, store) => createClaimValidator(partnerId, periodId, claim, store),
  `${partnerId}_${periodId}`
);

const createClaimEditorDto = (partnerId: string, periodId: number, store: RootState) => getClaim(partnerId, periodId).getPending(store);

const createClaimValidator = (partnerId: string, periodId: number, claim: ClaimDto, store: RootState) => {
  const details = findClaimDetailsSummaryByPartnerAndPeriod(partnerId, periodId).getPending(store).data || [];
  const costCategories = getCostCategories().getPending(store).data || [];
  return new ClaimDtoValidator(claim, details, costCategories, false);
};

export const claimLineItemsStore = "claimLineItems";
export const findClaimLineItemsByPartnerCostCategoryAndPeriod = (partnerId: string, costCategoryId: string, periodId: number) => dataStoreHelper(claimLineItemsStore, `partnerId=${partnerId}&costCategoryId=${costCategoryId}&periodId=${periodId}`) as IDataSelector<ClaimLineItemDto[]>;

export const claimDetailsStore = "claimDetails";
export const findClaimDetailsByPartner = (partnerId: string) => dataStoreHelper(claimDetailsStore, `partnerId=${partnerId}`) as IDataSelector<ClaimDetailsDto[]>;

export const claimDetailsSummaryStore = "claimDetailsSummary";
export const findClaimDetailsSummaryByPartnerAndPeriod = (partnerId: string, periodId: number) => dataStoreHelper(claimDetailsSummaryStore, `partnerId=${partnerId}&periodId=${periodId}`) as IDataSelector<ClaimDetailsSummaryDto[]>;
