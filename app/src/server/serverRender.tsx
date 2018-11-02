import React from "react";
import { Request, Response } from "express";
import { renderToString } from "react-dom/server";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router5";

import { renderHtml } from "./html";
import { rootReducer, setupInitialState, setupMiddleware } from "../ui/redux";
import { configureRouter, matchRoute } from "../ui/routing";
import { App } from "../ui/containers/app";
import { Results } from "../ui/validation/results";
import { updateEditorAction } from "../ui/redux/actions/common";

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

    Promise.all(actions.map(action => action(store.dispatch, store.getState, null)))
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
