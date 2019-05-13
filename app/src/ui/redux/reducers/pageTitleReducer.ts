import { RootActions } from "../actions/root";

export interface PageTitleState {
  htmlTitle: string;
  displayTitle: string;
}

export const pageTitleReducer = (state: PageTitleState = { displayTitle: "", htmlTitle: "" }, action: RootActions) => {
  if (action.type === "SET_PAGE_TITLE") {
    return {
      displayTitle: action.payload.displayTitle || state.displayTitle,
      htmlTitle: action.payload.htmlTitle + " - Innovation Funding Service"  || state.htmlTitle
    };
  }
  return state;
};
