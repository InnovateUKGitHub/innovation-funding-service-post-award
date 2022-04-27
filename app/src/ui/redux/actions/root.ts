import { RootState } from "../reducers";
import { DataLoadAction, EditorAction, MessageActions, TransitionActions, ErrorActions } from "./common";

import { InitaliseAction } from "./initalise";


export type RootActions =  DataLoadAction | EditorAction | MessageActions | InitaliseAction | TransitionActions | ErrorActions;

type TypedThunk = (dispatch: (action: RootActions) => void, getState: () => RootState) => void;

export type RootActionsOrThunk = RootActions | TypedThunk;
