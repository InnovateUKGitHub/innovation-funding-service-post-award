import { combineReducers } from "redux";
import { router5Reducer } from "redux-router5";
import { dataReducer } from "./dataReducer";
import { loadStatusReducer } from "./loadStatusReducer";
import { editorReducer } from "./editorsReducer";

export type RootState = ReturnType<typeof rootReducer>;
export type DataState = ReturnType<typeof dataReducer>;
export type DataStateKeys = keyof DataState;
export type EditorState = ReturnType<typeof editorReducer>;
export type EditorStateKeys = keyof EditorState;

export const rootReducer = combineReducers({
  router: router5Reducer,
  data: dataReducer,
  editors: editorReducer,
  loadStatus: loadStatusReducer
});
