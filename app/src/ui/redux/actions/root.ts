import { actions } from "redux-router5";
import {
  ActionsUnion,
  DataLoadAction,
  EditorAction,
  MessageActions
} from "./common";

type RouterActions = ActionsUnion<typeof actions>;

export type RootActions =
  RouterActions  |
  DataLoadAction |
  EditorAction   |
  MessageActions
;
