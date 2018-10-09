import { actions as routeActions } from "redux-router5";
import { conditionalLoad, dataLoadAction, DataLoadAction } from "./dataLoad";
import { ApiClient } from "../../../shared/apiClient";
import { ClaimDto, ClaimLineItemDto } from "../../models";
import { AsyncThunk, SyncThunk } from ".";
import { ClaimDtoValidator } from "../../validators/claimDtoValidator";
import { UpdateEditorAction, updateEditorAction } from "./editorActions";

export function navigateTo(routeInfo: ILinkInfo) {
  return routeActions.navigateTo(routeInfo.routeName, routeInfo.routeParams);
}
