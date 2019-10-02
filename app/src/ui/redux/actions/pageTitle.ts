import { AsyncThunk, createAction } from "./common/createAction";
import { MatchedRoute } from "@ui/routing/matchRoute";
import { IStores } from "../storesProvider";

export type SetPageTitleAction = ReturnType<typeof setPageTitle>;
export const setPageTitle = (title: { displayTitle: string, htmlTitle: string }) => createAction("SET_PAGE_TITLE", title);

export const udpatePageTitle = (route: MatchedRoute, params: {}, stores: IStores): AsyncThunk<void, SetPageTitleAction> => {
  return (dispatch, getState) => {
    const state = getState();
    const title = route.getTitle(state, params, stores);

    if(!state.title || title.displayTitle !== state.title.displayTitle || title.htmlTitle !== state.title.htmlTitle) {
      dispatch(setPageTitle(title));
    }

    return Promise.resolve();
  };
};
