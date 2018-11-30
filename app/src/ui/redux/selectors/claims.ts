import { dataStoreHelper, editorStoreHelper } from "./common";
import { RootState } from "../reducers";
import { ClaimDtoValidator } from "../../validators/claimDtoValidator";
import { getCostCategories } from "./costCategories";
import { getKey } from "../../../util/key";
import { ClaimDto, ClaimStatus } from "../../../types";
import { Pending } from "../../../shared/pending";

export const claimsStore = "claims";
export const findClaimsByPartner = (partnerId: string) => dataStoreHelper(claimsStore, `partnerId=${partnerId}`);
export const findClaimsByProject = (projectId: string) => dataStoreHelper(claimsStore, `projectId=${projectId}`);

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

const isActiveClaim = (claim: ClaimDto) => [ClaimStatus.APPROVED, ClaimStatus.PAID, ClaimStatus.NEW].indexOf(claim.status) < 0;

export const getCurrentClaim = (state: RootState, partnerId: string): Pending<ClaimDto | null> => {
  return findClaimsByPartner(partnerId).getPending(state).then(claims => {
    if (!claims) return null;
    return claims.find(isActiveClaim) || null;
  });
};

export const getProjectCurrentClaims = (state: RootState, projectId: string): Pending<ClaimDto[]> => {
  return findClaimsByProject(projectId).getPending(state).then(claims => {
    if (!claims) return [];
    return claims.filter(isActiveClaim);
  });
};

export const getProjectPreviousClaims = (state: RootState, projectId: string): Pending<ClaimDto[]> => {
  return Pending.combine(
    findClaimsByProject(projectId).getPending(state),
    getProjectCurrentClaims(state, projectId),
    (allClaims, currentClaims) => {
      if (!allClaims) return [];
      if (currentClaims.length === 0) return allClaims;
      const currentClaimIds = currentClaims.map(x => x.id);
      return allClaims.filter(claim => currentClaimIds.indexOf(claim.id) >= 0);
    }
  );
};

export const getPreviousClaims = (state: RootState, partnerId: string): Pending<ClaimDto[]> => {
  return Pending.combine(
    findClaimsByPartner(partnerId).getPending(state),
    getCurrentClaim(state, partnerId),
    (claims, currentClaim) => {
      if (!claims) return [];
      if (!currentClaim) return claims;
      return claims.filter(claim => claim.id !== currentClaim.id);
    }
  );
};
