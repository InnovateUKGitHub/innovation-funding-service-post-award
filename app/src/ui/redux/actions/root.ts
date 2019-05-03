import { actions } from "redux-router5";
import {
  ActionsUnion,
  DataLoadAction,
  EditorAction,
  MessageActions
} from "./common";

import { SetPageTitleAction } from "./pageTitle";

type RouterActions = ActionsUnion<typeof actions>;

export type RootActions =
  RouterActions |
  DataLoadAction |
  EditorAction |
  MessageActions |
  SetPageTitleAction
  ;
