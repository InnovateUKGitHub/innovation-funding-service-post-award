import { combineReducers } from "redux";
import { router5Reducer } from "redux-router5";
import { dataReducer } from "./common";
import { loadStatusReducer } from "./loadStatusReducer";

export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
  router: router5Reducer,
  data: dataReducer,
  loadStatus: loadStatusReducer
});
