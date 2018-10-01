import { combineReducers } from "redux";
import { router5Reducer } from "redux-router5";
import { dataReducer } from "./common";
import { loadStatusReducer } from "./loadStatusReducer";
import { editorReducer } from "./editorsReducer";

export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
  router: router5Reducer,
  data: dataReducer,
  editors: editorReducer,
  loadStatus: loadStatusReducer
});
