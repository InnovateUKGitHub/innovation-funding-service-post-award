import { dataStoreHelper, editorStoreHelper } from "./common";
import { IEditorStore, RootState } from "../reducers";
import { ClaimDtoValidator } from "../../validators/claimDtoValidator";
import { getCostCategories } from "./costCategories";
import { getKey } from "../../../util/key";
import { ClaimDto } from "../../../types";
import { getClaimDocumentEditor } from "./documents";
import { Pending } from "../../../shared/pending";
import { DocumentUploadValidator } from "../../validators/documentUploadValidator";

export const claimsStore = "claims";
export const findClaimsByPartner = (partnerId: string) => dataStoreHelper(claimsStore, `partnerId=${partnerId}`);

const claimStore = "claim";
export const getClaim = (partnerId: string, periodId: number) => dataStoreHelper(claimStore, getKey(partnerId, periodId));

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
export const findClaimLineItemsByPartnerCostCategoryAndPeriod = (partnerId: string, costCategoryId: string, periodId: number) => dataStoreHelper(claimLineItemsStore, `partnerId=${partnerId}&costCategoryId=${costCategoryId}&periodId=${periodId}`);

export const claimDetailsStore = "claimDetails";
export const findClaimDetailsByPartner = (partnerId: string) => dataStoreHelper(claimDetailsStore, `partnerId=${partnerId}`);

export const claimDetailsSummaryStore = "claimDetailsSummary";
export const findClaimDetailsSummaryByPartnerAndPeriod = (partnerId: string, periodId: number) => dataStoreHelper(claimDetailsSummaryStore, `partnerId=${partnerId}&periodId=${periodId}`);

export const getCurrentClaim = (state: RootState, partnerId: string): Pending<ClaimDto | null> => {
  return findClaimsByPartner(partnerId).getPending(state).then(claims => {
    if (!claims) {
      return null;
    }
    return claims.find(claim => !claim.approvedDate) || null;
  });
};

export const getPreviousClaims = (state: RootState, partnerId: string): Pending<ClaimDto[]> => {
  return Pending.combine(
    findClaimsByPartner(partnerId).getPending(state),
    getCurrentClaim(state, partnerId),
    (claims, currentClaim) => {
      if (!claims || !currentClaim) {
        return [];
      }
      return currentClaim ? claims.filter(claim => claim.id !== currentClaim.id) : claims;
    }
  );
};
