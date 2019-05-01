import { dataStoreHelper, editorStoreHelper } from "./common";
import { IEditorStore, RootState } from "../reducers";
import { ClaimDtoValidator } from "../../validators/claimDtoValidator";
import { getCostCategories } from "./costCategories";
import { getKey } from "../../../util/key";
import { ClaimDto } from "../../../types";
import { Pending } from "../../../shared/pending";
import { ClaimLineItemFormValidator } from "@ui/validators";
import { range } from "@shared/range";
import { ClaimLineItemsFormData } from "@framework/types/dtos/claimLineItemsFormData";

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
  const details = getCostsSummaryForPeriod(partnerId, periodId).getPending(store).data || [];
  const costCategories = getCostCategories().getPending(store).data || [];
  return new ClaimDtoValidator(claim, details, costCategories, false);
};

export const claimLineItemsStore = "claimLineItems";
export const claimLineItemsFormStore = "claimLineItemsForm";

export const getClaimLineItemEditor = (partnerId: string, periodId: number, costCategoryId: string) => editorStoreHelper<ClaimLineItemsFormData, ClaimLineItemFormValidator>(
  claimLineItemsFormStore,
  x => x.claimLineItemsForm,
  (store) => createClaimLineItemEditorDto(partnerId, periodId, costCategoryId, store),
  (claimLineItemForm) => new ClaimLineItemFormValidator(claimLineItemForm, false),
  findClaimLineItemsByPartnerCostCategoryAndPeriod(partnerId, costCategoryId, periodId).key
);

export const findClaimLineItemsByPartnerCostCategoryAndPeriod = (partnerId: string, costCategoryId: string, periodId: number) => dataStoreHelper(claimLineItemsStore, `partnerId=${partnerId}&costCategoryId=${costCategoryId}&periodId=${periodId}`);

const createClaimLineItemEditorDto = (partnerId: string, periodId: number, costCategoryId: string, state: RootState): Pending<ClaimLineItemsFormData> => {
  return Pending.combine({
    lineItems: findClaimLineItemsByPartnerCostCategoryAndPeriod(partnerId, costCategoryId, periodId).getPending(state),
    claimDetails: getClaimDetails(partnerId, periodId, costCategoryId).getPending(state),
  }).then((x) => {
    const items = x!.lineItems || [];
    // if rendering on client and has items saved then render them
    // else rendering on server or no items saved so render default number
    const lineItems = (items.length && state.isClient) || items.length > 10 ? items : range(state.isClient ? 2 : 10).map((lineItem, index) => items[index] || ({
      costCategoryId,
      partnerId,
      periodId
    }));
    return {
      lineItems,
      claimDetails: x!.claimDetails
    };
  });
};

export const claimDetailsStore = "claimDetails";
export const findClaimDetailsByPartner = (partnerId: string) => dataStoreHelper(claimDetailsStore, `partnerId=${partnerId}`);

export const getCostsSummaryForPeriod = (partnerId: string, periodId: number) => dataStoreHelper("costsSummary", `partnerId=${partnerId}&periodId=${periodId}`);

export const getCurrentClaim = (state: RootState, partnerId: string): Pending<ClaimDto | null> => {
  return findClaimsByPartner(partnerId)
    .getPending(state)
    .then(claims => (claims || []).find(x => !x.isApproved) || null);
};

export const getProjectCurrentClaims = (state: RootState, projectId: string): Pending<ClaimDto[]> => {
  return findClaimsByProject(projectId)
    .getPending(state)
    .then(claims => (claims || []).filter(x => !x.isApproved));
};

export const getProjectPreviousClaims = (state: RootState, projectId: string): Pending<ClaimDto[]> => {
  return findClaimsByProject(projectId)
    .getPending(state)
    .then(claims => (claims ||[]).filter(x => x.isApproved));
};

export const getPreviousClaims = (state: RootState, partnerId: string): Pending<ClaimDto[]> => {
  return findClaimsByPartner(partnerId)
    .getPending(state)
    .then(claims => (claims ||[]).filter(x => x.isApproved));
};

export const getClaimDetails = (partnerId: string, periodId: number, costCategoryId: string) => dataStoreHelper("claimDetail", getKey(partnerId, periodId, costCategoryId));
