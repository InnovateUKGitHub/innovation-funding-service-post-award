import { RootActions } from "../actions/root";
import { actionTypes } from "redux-router5";

export const historyReducer = (state: number = 0 , action: RootActions) => {
  if (action.type === actionTypes.TRANSITION_SUCCESS) {
    return state + 1;
  }
  return state;
};
