import { RootState } from "../reducers/rootReducer";
import { DataLoadAction } from "./common/dataLoad";
import { EditorAction } from "./common/editorActions";
import { ErrorActions } from "./common/errorActions";
import { MessageActions } from "./common/messageActions";
import { PreviousReactHookFormActions } from "./common/previousReactHookFormInputAction";
import { TransitionActions } from "./common/transitionActions";
import { ZodErrorActions } from "./common/zodErrorAction";
import { InitaliseAction } from "./initalise";

export type RootActions =
  | DataLoadAction
  | EditorAction
  | MessageActions
  | InitaliseAction
  | TransitionActions
  | ErrorActions
  | ZodErrorActions
  | PreviousReactHookFormActions;

type TypedThunk = (dispatch: (action: RootActions) => void, getState: () => RootState) => void;

export type RootActionsOrThunk = RootActions | TypedThunk;
