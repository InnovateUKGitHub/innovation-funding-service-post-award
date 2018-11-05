import { actions } from "redux-router5";
import { ActionsUnion, DataLoadAction, UpdateEditorAction } from "./common";

type RouterActions = ActionsUnion<typeof actions>;

export type RootActions =
  RouterActions  |
  DataLoadAction |
  UpdateEditorAction
  ;
