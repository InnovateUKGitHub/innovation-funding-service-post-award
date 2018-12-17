import { actions } from "redux-router5";
import {
  ActionsUnion,
  DataLoadAction,
  EditorAction
} from "./common";

type RouterActions = ActionsUnion<typeof actions>;

export type RootActions =
  RouterActions  |
  DataLoadAction |
  EditorAction
  ;
