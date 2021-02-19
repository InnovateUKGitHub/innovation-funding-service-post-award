import { actions as router5Actions } from "redux-router5";
import { RootState } from "../reducers";
import {
  ActionsUnion,
  DataLoadAction,
  EditorAction,
  MessageActions
} from "./common";

import { SetPageTitleAction } from "./pageTitle";
import { InitaliseAction } from "./initalise";

type RouterActions = ActionsUnion<typeof router5Actions>;

export type RootActions =
  RouterActions |
  DataLoadAction |
  EditorAction |
  MessageActions |
  SetPageTitleAction |
  InitaliseAction
  ;

type TypedThunk = (dispatch: (action: RootActions) => void, getState: () => RootState) => void;

export type RootActionsOrThunk = RootActions | TypedThunk;
