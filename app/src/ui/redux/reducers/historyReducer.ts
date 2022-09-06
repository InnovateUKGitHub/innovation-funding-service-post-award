import { RootActions } from "../actions/root";

export const historyReducer = (state = 0, action: RootActions) => {
  if (action.type === "ROUTE_TRANSITION") {
    return state + 1;
  }
  return state;
};
