import { ApiClient } from "../../apiClient";
import { conditionalLoad } from "./common";
import { getAllPcrs, getAllPcrTypes, getPcr, getPcrEditor, getPcrEditorForCreate } from "../selectors/pcrs";
import { PCRDto } from "@framework/dtos";
import * as Actions from "@ui/redux/actions/common";
import { scrollToTheTopSmoothly } from "@framework/util";
import { LoadingStatus } from "@shared/pending";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { ProjectChangeRequestDtoValidatorForCreate } from "@ui/validators/projectChangeRequestDtoValidatorForCreate";
import { Authorisation } from "@framework/types";

export function loadPcrTypes() {
  return conditionalLoad(getAllPcrTypes(), params => ApiClient.pcrs.getTypes({ ...params }));
}

export function loadPcrs(projectId: string) {
  return conditionalLoad(getAllPcrs(projectId), params => ApiClient.pcrs.getAll({ projectId, ...params }));
}

export function loadPcr(projectId: string, id: string) {
  return conditionalLoad(getPcr(projectId, id), params => ApiClient.pcrs.get({ projectId, id, ...params }));
}

// update editor with validation
export function validatePCR(projectId: string, pcrId: string, dto: PCRDto, showErrors?: boolean): Actions.SyncThunk<PCRDtoValidator, Actions.UpdateEditorAction> {
  return (dispatch, getState) => {
    const selector = getPcrEditor(projectId, pcrId);
    const state = getState();

    if (showErrors === null || showErrors === undefined) {
      const current = state.editors[selector.store][selector.key];
      showErrors = current && current.validator.showValidationErrors || false;
    }

    const projectRoles = new Authorisation(state.user.roleInfo).forProject(projectId).getRoles();
    const original = getPcr(projectId, pcrId).get(state);
    const itemTypes = getAllPcrTypes().get(state).data;
    const validator = new PCRDtoValidator(dto, projectRoles, original.data, itemTypes, showErrors);

    dispatch(Actions.updateEditorAction(selector.key, selector.store, dto, validator));
    return validator;
  };
}

export function savePCR(projectId: string, pcrId: string, dto: PCRDto, onComplete: () => void, message?: string): Actions.AsyncThunk<void, Actions.DataLoadAction | Actions.EditorAction | Actions.messageSuccess> {
  return (dispatch, getState) => {

    const state = getState();
    const selector = getPcrEditor(projectId, pcrId);
    const validation = validatePCR(projectId, pcrId, dto, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    dispatch(Actions.handleEditorSubmit(selector.key, selector.store, dto, validation));

    return ApiClient.pcrs.update({ projectId, id: pcrId, pcr: dto, user: state.user }).then((result) => {
      dispatch(Actions.dataLoadAction(selector.key, selector.store, LoadingStatus.Updated, result));
      dispatch(Actions.handleEditorSuccess(selector.key, selector.store));

      if (message) dispatch(Actions.messageSuccess(message));
      onComplete();
    })
      .catch((e) => {
        dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto, validation, error: e }));
      });
  };
}

// update editor with validation
export function validateProjectChangeRequestForCreate(projectId: string, dto: PCRDto, showErrors?: boolean): Actions.SyncThunk<ProjectChangeRequestDtoValidatorForCreate, Actions.UpdateEditorAction> {
  return (dispatch, getState) => {
    const selector = getPcrEditorForCreate(projectId);
    const state = getState();

    if (showErrors === null || showErrors === undefined) {
      const current = state.editors[selector.store][selector.key];
      showErrors = current && current.validator.showValidationErrors || false;
    }
    const itemTypes = getAllPcrTypes().get(state).data;
    const validator = new ProjectChangeRequestDtoValidatorForCreate(dto, itemTypes, showErrors);

    dispatch(Actions.updateEditorAction(selector.key, selector.store, dto, validator));
    return validator;
  };
}

export function createProjectChangeRequest(projectId: string, dto: PCRDto, onComplete: (dto: PCRDto) => void): Actions.SyncThunk<void, Actions.EditorAction | Actions.DataLoadAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = getPcrEditorForCreate(projectId);

    const validation = validateProjectChangeRequestForCreate(projectId, dto, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    dispatch(Actions.handleEditorSubmit(selector.key, selector.store, dto, validation));

    return ApiClient.pcrs.create({ projectId, projectChangeRequestDto: dto, user: state.user })
      .then((result) => {
        dispatch(Actions.dataLoadAction(selector.key, selector.store, LoadingStatus.Updated, result));
        dispatch(Actions.handleEditorSuccess(selector.key, selector.store));
        onComplete(result);
      })
      .catch((e) => {
        dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto, validation, error: e }));
      });
  };
}

export function deletePCR(projectId: string, pcrId: string, dto: PCRDto, onComplete: () => void, message?: string): Actions.AsyncThunk<void, Actions.DataLoadAction | Actions.EditorAction | Actions.messageSuccess> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = Selectors.getPcrEditor(projectId, pcrId);

    const projectRoles = new Authorisation(state.user.roleInfo).forProject(projectId).getRoles();

    const validator = new PCRDtoValidator(dto, projectRoles, dto, true);
    dispatch(Actions.handleEditorSubmit(selector.key, selector.store, dto, validator));

    return ApiClient.pcrs.delete({projectId, id: pcrId, user: state.user })
      .then(() => {
        dispatch(Actions.handleEditorSuccess(selector.key, selector.store));
        if(message) {
          dispatch(Actions.messageSuccess(message));
        }
        onComplete();
      })
      .catch((e: any) => {
        dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto, validation: validator, error: e}));
      });
  };
}
