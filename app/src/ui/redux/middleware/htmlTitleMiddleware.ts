import { AnyAction, Dispatch, MiddlewareAPI } from "redux";
import { RootState } from "../reducers/rootReducer";

// cannot be used on server!!!
export const htmlTitleMiddleware = (store: MiddlewareAPI<Dispatch, RootState>) => (next: Dispatch) => (action: AnyAction) => {
  const originalTitle = store.getState().title.htmlTitle;
  next(action);
  const newTitle = store.getState().title.htmlTitle;
  if(originalTitle !== newTitle) {
    document.title = newTitle;
  }
};
