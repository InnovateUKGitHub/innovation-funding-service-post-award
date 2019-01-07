import React from "react";
import { Request, Response } from "express";
import { renderToString } from "react-dom/server";
import { AnyAction, createStore, Dispatch } from "redux";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router5";
import { constants as routerConstants } from "router5";

import { renderHtml } from "./html";
import { rootReducer, RootState, setupInitialState, setupMiddleware } from "../ui/redux";
import { configureRouter, matchRoute } from "../ui/routing";
import { App } from "../ui/containers/app";
import { Results } from "../ui/validation/results";
import { AsyncThunk, handleEditorError, updateEditorAction } from "../ui/redux/actions/common";
import { IAppError } from "../types/IAppError";
import { errorHandlerRender } from "./errorHandlers";
import { NotFoundError } from "./features/common/appError";

async function loadData(dispatch: Dispatch<AnyAction>, getState: () => RootState, dataCalls: AsyncThunk<any>[]): Promise<void> {
  const allPromises = dataCalls.map(action => action(dispatch, getState, null));
  const loadingCount = getState().loadStatus;

  // nothing is loading so safe to return and then render
  if (loadingCount === 0) {
    return Promise.resolve();
  }
  // something is loading so wait for that to finish and then try again
  return Promise.all(allPromises).then(() => loadData(dispatch, getState, dataCalls));
}

export function serverRender(req: Request, res: Response, errorDetails?: { key: string, store: string, dto: {}, result: Results<{}>, error: IAppError }) {
  try {
    const router = configureRouter();

    router.start(req.originalUrl, async (routeError, route) => {
      if (routeError) {
        throw new Error("Server error");
      }

      if (route && route.name === routerConstants.UNKNOWN_ROUTE) {
        throw new NotFoundError();
      }

      const initialState = setupInitialState(route, req.session!.user);
      const middleware = setupMiddleware(router, false);
      const store = createStore(rootReducer, initialState, middleware);
      const matched = matchRoute(route);
      const params = matched && matched.getParams && matched.getParams(route!) || {};
      const actions = matched && matched.getLoadDataActions && matched.getLoadDataActions(params) || [];

      if (errorDetails) {
        actions.push((dispatch, getState) => {
          dispatch(updateEditorAction(errorDetails.key, errorDetails.store, errorDetails.dto, errorDetails.result));
          return Promise.resolve();
        });
        actions.push((dispatch, getState) => {
          dispatch(handleEditorError({
            id: errorDetails.key,
            dto: errorDetails.dto,
            validation: errorDetails.result,
            error: errorDetails.error,
            store: errorDetails.store,
            scrollToTop: false
          }));
          return Promise.resolve();
        });
      }

      await loadData(store.dispatch, store.getState, actions);
      const html = renderToString(
        <Provider store={store}>
          <RouterProvider router={router}>
            <App />
          </RouterProvider>
        </Provider>
      );

      return res.send(renderHtml(html, store.getState()));
    });
  }
  catch(e) {
    return errorHandlerRender(res, e);
  }
}
