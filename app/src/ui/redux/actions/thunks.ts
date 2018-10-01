import {conditionalLoad, dataLoadAction, DataLoadAction} from "./dataLoad";
import { ApiClient } from "../../../shared/apiClient";
import { ClaimDto } from "../../models";
import {AsyncThunk, SyncThunk} from ".";
import { ClaimDtoValidator } from "../../validators/claimDtoValidator";
import { UpdateEditorAction, updateEditorAction } from "./editorActions";
import { actions as routeActions } from "redux-router5";
import {LoadingStatus} from "../../../shared/pending";

export function loadContacts() {
  return conditionalLoad(
    "all",
    "contacts",
    () => ApiClient.contacts.getAll()
  );
}

export function loadContact(id: string) {
  return conditionalLoad(
    id,
    "contact",
    () => ApiClient.contacts.get(id)
  );
}

export function loadClaimsForPartner(partnerId: string) {
  return conditionalLoad(
    partnerId,
    "claims",
    () => ApiClient.claims.getAllByPartnerId(partnerId)
  );
}

export function loadClaimLineItemsForCategory(partnerId: string, costCategoryId: string, periodId: number) {
  return conditionalLoad(
    partnerId,
    "claimLineItems",
    () => ApiClient.claimLineItems.getAllForCategory(partnerId, costCategoryId, periodId)
  );
}

export function loadClaimDetailsForPartner(partnerId: string, periodId: number) {
  return conditionalLoad(
    partnerId + "_" + periodId,
    "claimDetails",
    () => ApiClient.claimDetails.getAllByPartnerId(partnerId, periodId)
  );
}

export function loadProject(id: string) {
  return conditionalLoad(
    id,
    "project",
    () => {
      return ApiClient.projects.get(id);
    }
  );
}

export function loadPartner(id: string) {
  return conditionalLoad(
    id,
    "partner",
    () => {
      return ApiClient.partners.get(id);
    }
  );
}

export function loadProjects() {
  return conditionalLoad(
    "all",
    "projects",
    () => ApiClient.projects.getAll()
  );
}

export function loadPatnersForProject(projectId: string) {
  return conditionalLoad(
    projectId,
    "partners",
    () => ApiClient.partners.getAllByProjectId(projectId)
  );
}

export function loadContactsForProject(projectId: string) {
  return conditionalLoad(
    projectId,
    "projectContacts",
    () => ApiClient.projectContacts.getAllByProjectId(projectId)
  );
}

export function loadCostCategories() {
  return conditionalLoad(
    "all",
    "costCategories",
    () => ApiClient.costCategories.getAll()
  );
}

export function loadClaim(claimId: string) {
  return conditionalLoad(
    claimId,
    "claim",
    () => ApiClient.claims.getById(claimId)
  );
}

export function validateClaim(id: string, dto: ClaimDto, showErrors?: boolean): SyncThunk<ClaimDtoValidator, UpdateEditorAction> {
  return (dispatch, getState) => {
    const state = getState();
    if (showErrors === null || showErrors === undefined) {
      const current = state.editors.claim[id];
      showErrors = current && current.validator.showValidationErrors() || false;
    }
    const validator = new ClaimDtoValidator(dto, showErrors);
    dispatch(updateEditorAction(id, "claim", dto, validator));
    return validator;
  };
}

export function saveClaim(id: string, dto: ClaimDto, onComplete: () => void): AsyncThunk<void, DataLoadAction | UpdateEditorAction> {
  return (dispatch, getState) => {
    const validation = validateClaim(id, dto, true)(dispatch, getState, null);
    if (!validation.isValid()) {
      return Promise.resolve();
    }
    return ApiClient.claims.update(id, dto).then((result) => {
      dispatch(dataLoadAction(id, "claim", LoadingStatus.Done, result));
      onComplete();
    }).catch((e) => {
      dispatch(updateEditorAction(id, "claim", dto, validation, e));
    });
  };
}

export function navigateTo(routeInfo: ILinkInfo) {
  return routeActions.navigateTo(routeInfo.routeName, routeInfo.routeParams);
}
