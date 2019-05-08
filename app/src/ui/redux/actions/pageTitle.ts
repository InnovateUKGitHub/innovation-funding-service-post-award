import { AsyncThunk, createAction } from "./common/createAction";
import { MatchedRoute } from "@framework/ui/routing/matchRoute";

export type SetPageTitleAction = ReturnType<typeof setPageTitle>;
const setPageTitle = (title: { displayTitle: string, htmlTitle: string }) => createAction("SET_PAGE_TITLE", title);

export const udpatePageTitle = (route: MatchedRoute, params: {}): AsyncThunk<void, SetPageTitleAction> => {
  return (dispatch, getState) => {
    const title = route.getTitle(getState(), params);

    dispatch(setPageTitle(title));

    return Promise.resolve();
  };
};
