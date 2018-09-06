import React from "react";
import { Request, Response } from "express";
import { renderToString } from "react-dom/server";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router5";

import { renderHtml } from "./html";
import { rootReducer, setupInitialState, setupMiddleware } from "../redux";
import { configureRouter, matchRouteLoader } from "../routing";
import { App } from "../containers/app";

export function serverRender(req: Request, res: Response) {
  const router = configureRouter();

  router.start(req.originalUrl, (routeError, route) => {
    const initialState = setupInitialState(route);
    const middleware = setupMiddleware(router, false);
    const store = createStore(rootReducer, initialState, middleware);
    const loader = matchRouteLoader(route);
    const actions = loader(route!) || [];

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
