import { dataStoreHelper, editorStoreHelper } from "./common";
import { RootState } from "../reducers";
import { ClaimDtoValidator } from "../../validators/claimDtoValidator";
import { getCostCategories } from "./costCategories";
import { LoadingStatus, Pending } from "../../../shared/pending";
import { ClaimDto, ClaimStatus } from "@framework/types";
import { getKey } from "@framework/util/key";
import { ClaimDetailsValidator } from "@ui/validators";
import { range } from "@shared/range";
import { getLeadPartner } from "@ui/redux/selectors/partners";

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
  const originalStatus = getClaim(partnerId, periodId).getPending(store).then(x => x.status);
  const details = getCostsSummaryForPeriod(partnerId, periodId).getPending(store);
  const costCategories = getCostCategories().getPending(store);
  return Pending.combine({
    originalStatus,
    details,
    costCategories
  }).then(x => new ClaimDtoValidator(claim, x.originalStatus, x.details, x.costCategories, false));
};

export const claimDetailStore = "claimDetail";

export const getClaimDetails = (partnerId: string, periodId: number, costCategoryId: string) => dataStoreHelper(claimDetailStore, getKey(partnerId, periodId, costCategoryId));

export const getClaimDetailsEditor = (partnerId: string, periodId: number, costCategoryId: string) => editorStoreHelper<ClaimDetailsDto, ClaimDetailsValidator>(
  claimDetailStore,
  x => x.claimDetail,
  (store) => createClaimDetailsEditorDto(partnerId, periodId, costCategoryId, store),
  (claimLineItemForm) => Pending.done(new ClaimDetailsValidator(claimLineItemForm, false)),
  getClaimDetails(partnerId, periodId, costCategoryId).key
);

const createClaimDetailsEditorDto = (partnerId: string, periodId: number, costCategoryId: string, state: RootState): Pending<ClaimDetailsDto> => {
  return getClaimDetails(partnerId, periodId, costCategoryId).getPending(state).then((claimDetails) => {
    const items = claimDetails.lineItems || [];
    // if rendering on client and has items saved then render them
    // else rendering on server or no items saved so render default number
    const lineItems = (items.length && state.isClient) || items.length > 10 ? items : range(state.isClient ? 2 : 10).map((lineItem, index) => items[index] || ({
      costCategoryId,
      partnerId,
      periodId
    }));
    return {
      ...claimDetails,
      lineItems
    };
  });
};

export const claimDetailsStore = "claimDetails";
export const findClaimDetailsByPartner = (partnerId: string) => dataStoreHelper(claimDetailsStore, `partnerId=${partnerId}`);

export const costsSummaryForPeriodStore = "costsSummary";
export const getCostsSummaryForPeriod = (partnerId: string, periodId: number) => dataStoreHelper(costsSummaryForPeriodStore, `partnerId=${partnerId}&periodId=${periodId}`);

export const claimStatusChangesStore = "claimStatusChanges";
export const getClaimStatusChanges = (projectId: string, partnerId: string, periodId: number) =>  dataStoreHelper(claimStatusChangesStore, getKey(projectId, partnerId, periodId));

export const getCurrentClaim = (state: RootState, partnerId: string): Pending<ClaimDto | null> => {
  const pending = findClaimsByPartner(partnerId).getPending(state);
  return pending.then(claims => claims.find(x => !x.isApproved) || null);
};

export const getLeadPartnerCurrentClaim = (state: RootState, projectId: string) => {
  return getLeadPartner(state, projectId).chain(partner => {
    if (!partner) {
      return new Pending(LoadingStatus.Done, null);
    }
    return getProjectCurrentClaims(state, projectId).then(claims => claims.find(x => x.partnerId === partner.id));
  });
};

export const getProjectCurrentClaims = (state: RootState, projectId: string): Pending<ClaimDto[]> => {
  return findClaimsByProject(projectId)
    .getPending(state)
    .then(claims => claims.filter(x => !x.isApproved));
};

export const getProjectPreviousClaims = (state: RootState, projectId: string): Pending<ClaimDto[]> => {
  return findClaimsByProject(projectId)
    .getPending(state)
    .then(claims => claims.filter(x => x.isApproved));
};

export const getPreviousClaims = (state: RootState, partnerId: string): Pending<ClaimDto[]> => {
  return findClaimsByPartner(partnerId)
    .getPending(state)
    .then(claims => claims.filter(x => x.isApproved));
};
