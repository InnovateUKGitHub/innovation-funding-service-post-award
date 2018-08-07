import React from "react";
import { Request, Response } from "express";
import { renderToString } from "react-dom/server";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router5";

import { renderHtml } from "./html";
import { rootReducer, setupInitialState, setupMiddleware } from "../redux";
import { configureRouter, matchRouteLoader } from '../routing';
import { App } from "../containers";

export function serverRender(req: Request, res: Response) {
  const router = configureRouter();

  router.start(req.originalUrl, (routeError, route) => {
    // handle for route not found?
    // if(routeError) {
    //   return res.status(500).send(routeError);
    // }

    const initialState = setupInitialState(route);
    const middleware   = setupMiddleware(router);
    const store        = createStore(rootReducer, initialState, middleware);
    const loader       = matchRouteLoader(route);

    loader(store.dispatch, store.getState).then(() => {
      const html = renderToString(
        <Provider store={store}>
          <RouterProvider router={router}>
            <App serverSide={true} />
          </RouterProvider>
        </Provider>
      );

      return res.send(renderHtml(html));
    })
    .catch((error: any) => {
      console.log("error", error);
      res.status(500).send(error);
    });
  });
}
