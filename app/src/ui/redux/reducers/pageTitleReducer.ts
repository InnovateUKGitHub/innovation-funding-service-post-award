import { RootActions } from "../actions/root";

export interface PageTitleState {
  htmlTitle: string;
  displayTitle: string;
}

export const pageTitleReducer = (state: PageTitleState = { displayTitle: "", htmlTitle: "" }, action: RootActions) => {
  if (action.type === "SET_PAGE_TITLE") {
    if (action.payload.htmlTitle !== state.htmlTitle || action.payload.displayTitle !== state.displayTitle) {
      return Object.assign({}, state, action.payload);
    }
  }
  return state;
};
