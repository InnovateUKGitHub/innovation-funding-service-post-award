import { actionTypes } from "redux-router5";
import { RootActions } from "../actions/root";

export const historyReducer = (state = 0 , action: RootActions) => {
  if (action.type === actionTypes.TRANSITION_SUCCESS) {
    return state + 1;
  }
  return state;
};
