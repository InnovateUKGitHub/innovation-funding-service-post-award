import { actions } from "redux-router5";
import { ActionsUnion, DataLoadAction, ResetEditorAction, ResetEditorsAction, UpdateEditorAction } from "./common";

type RouterActions = ActionsUnion<typeof actions>;

export type RootActions =
  RouterActions  |
  DataLoadAction |
  UpdateEditorAction |
  ResetEditorAction |
  ResetEditorsAction
  ;
