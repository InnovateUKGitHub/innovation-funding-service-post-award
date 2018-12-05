import React from "react";
import { Request, Response } from "express";
import { renderToString } from "react-dom/server";
import { AnyAction, createStore, Dispatch } from "redux";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router5";

import { renderHtml } from "./html";
import { rootReducer, RootState, setupInitialState, setupMiddleware } from "../ui/redux";
import { configureRouter, matchRoute } from "../ui/routing";
import { App } from "../ui/containers/app";
import { Results } from "../ui/validation/results";
import { AsyncThunk, updateEditorAction } from "../ui/redux/actions/common";

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

export function serverRender(req: Request, res: Response, validationError?: { key: string, store: string, dto: {}, result: Results<{}>, error: any }) {
  const router = configureRouter();

  router.start(req.originalUrl, (routeError, route) => {

    if (routeError) {
      console.log("router start error", routeError);
      return res.status(500).send(routeError);
    }

    const initialState = setupInitialState(route, req.session!.user);
    const middleware = setupMiddleware(router, false);
    const store = createStore(rootReducer, initialState, middleware);
    const matched = matchRoute(route);
    const params = matched && matched.getParams && matched.getParams(route!) || {};
    const actions = matched && matched.getLoadDataActions && matched.getLoadDataActions(params) || [];

    if (validationError) {
      actions.push((dispatch, getState) => {
        dispatch(updateEditorAction(validationError.key, validationError.store, validationError.dto, validationError.result, validationError.error));
        return Promise.resolve();
      });
    }

    loadData(store.dispatch, () => store.getState(), actions)
      .then(() => {
        const html = renderToString(
          <Provider store={store}>
            <RouterProvider router={router}>
              <App />
            </RouterProvider>
          </Provider>
        );

        return res.send(renderHtml(html, store.getState()));
      })
      .catch((error: any) => {
        console.log("server render error", error);
        res.status(500).send(error);
      });
  });
}
