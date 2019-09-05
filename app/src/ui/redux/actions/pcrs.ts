import { ApiClient } from "../../apiClient";
import { conditionalLoad } from "./common";
import { getAllPcrs, getAllPcrTypes, getPcr, getPcrEditor } from "../selectors/pcrs";
import { PCRDto } from "@framework/dtos";
import * as Actions from "@ui/redux/actions/common";
import { scrollToTheTopSmoothly } from "@framework/util";
import { LoadingStatus } from "@shared/pending";
import { Results } from "@ui/validation";

export function loadPcrTypes() {
  return conditionalLoad(getAllPcrTypes(), params => ApiClient.pcrs.getTypes({...params}));
}

export function loadPcrs(projectId: string) {
  return conditionalLoad(getAllPcrs(projectId), params => ApiClient.pcrs.getAll({ projectId,...params}));
}

export function loadPcr(projectId: string, id: string) {
  return conditionalLoad(getPcr(projectId, id), params => ApiClient.pcrs.get({ projectId, id,...params}));
}

export function createProjectChangeRequest(projectId: string, projectChangeRequestDto: PCRDto, onComplete: (dto: PCRDto) => void): Actions.SyncThunk<void, Actions.EditorAction | Actions.DataLoadAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = getPcrEditor(projectId);
    const validation = new Results(projectChangeRequestDto, false);

    // TODO use real validator

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    dispatch(Actions.handleEditorSubmit(selector.key, selector.store, projectChangeRequestDto, validation));

    return ApiClient.pcrs.create({ projectId, projectChangeRequestDto, user: state.user })
      .then((result) => {
        dispatch(Actions.dataLoadAction(selector.key, selector.store, LoadingStatus.Updated, result));
        dispatch(Actions.handleEditorSuccess(selector.key, selector.store));
        onComplete(result);
      })
      .catch((e) => {
        dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto: projectChangeRequestDto, validation, error: e }));
      });
  };
}
