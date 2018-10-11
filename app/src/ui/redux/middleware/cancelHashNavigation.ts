import { Dispatch, MiddlewareAPI } from "redux";
import { RootState } from "../reducers/rootReducer";
import { RootActions } from "../actions/root";

// there seems to be a problem with reactrouter 5 seeing a hash navigation (<a href="#xxx"/>) as a actuall navigation
// this cancels it for the moment
export const cancelHashNavigation = (store: MiddlewareAPI<Dispatch, RootState>) => (next: Dispatch) => (action: RootActions) => {
  if(action.type === "@@router5/TRANSITION_START" || action.type === "@@router5/TRANSITION_SUCCESS"){
    if(action.payload.previousRoute && action.payload.route.path === action.payload.previousRoute.path){
      return;
    }
  }
  next(action);
};