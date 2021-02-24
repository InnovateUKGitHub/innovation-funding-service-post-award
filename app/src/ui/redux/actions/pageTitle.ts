import { MatchedRoute } from "@ui/routing/matchRoute";
import { Content } from "@content/content";
import { IStores } from "../storesProvider";
import { AsyncThunk, createAction } from "./common/createAction";

export type SetPageTitleAction = ReturnType<typeof setPageTitle>;
export const setPageTitle = (title: { displayTitle: string; htmlTitle: string }) => createAction("SET_PAGE_TITLE", title);

export const updatePageTitle = (route: MatchedRoute, params: {}, stores: IStores, content: Content): AsyncThunk<void, SetPageTitleAction> => {
  return (dispatch, getState) => {
    const state = getState();
    const title = route.getTitle({ params, stores, content });

    if (!state.title || title.displayTitle !== state.title.displayTitle || title.htmlTitle !== state.title.htmlTitle) {
      dispatch(setPageTitle(title));
    }

    return Promise.resolve();
  };
};
