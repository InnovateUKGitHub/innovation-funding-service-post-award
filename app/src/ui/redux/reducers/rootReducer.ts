import { combineReducers } from "redux";
import { router5Reducer, RouterState } from "redux-router5";
import { dataReducer } from "./dataReducer";
import { loadStatusReducer } from "./loadStatusReducer";
import { editorReducer } from "./editorsReducer";
import { userReducer } from "./userReducer";

export type DataState = ReturnType<typeof dataReducer>;
export type DataStateKeys = keyof DataState;
export type EditorState = ReturnType<typeof editorReducer>;
export type EditorStateKeys = keyof EditorState;

export interface RootState {
  router: RouterState;
  data: DataState;
  editors: EditorState;
  loadStatus: number;
  user: IUser;
  isClient: boolean;
};

export const rootReducer = combineReducers<RootState>({
  router: router5Reducer,
  data: dataReducer,
  editors: editorReducer,
  loadStatus: loadStatusReducer,
  user: userReducer,
  isClient: (state: boolean = false) => state
});
