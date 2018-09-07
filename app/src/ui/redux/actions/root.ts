import { actions } from "redux-router5";
import { ActionsUnion } from "./common";
import { DataLoadAction } from "./dataLoad";

type RouterActions = ActionsUnion<typeof actions>;

export type RootActions =
  RouterActions  |
  DataLoadAction
;
