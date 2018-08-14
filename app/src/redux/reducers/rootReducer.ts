import { combineReducers } from "redux";
import { router5Reducer } from "redux-router5";
import { CommonReducer } from "./common";

export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
  router: router5Reducer,
  data: CommonReducer
});
