import React from "react";
import { hydrate } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { RouterProvider } from "react-router5";
import { configureRouter } from "../ui/routing";
import { rootReducer, setupMiddleware } from "../ui/redux";
import { App } from "../ui/containers/app";
import { processDto } from "../shared/processResponse";
import { Polyfill } from "./polyfill";
import { pageLoadStatusKey } from "../ui/redux/middleware/loadStatusMiddleware";

const serverState = processDto((window as any).__PRELOADED_STATE__);
serverState.isClient = true;

(window as any)[pageLoadStatusKey] = true;

const router     = configureRouter();
const middleware = setupMiddleware(router, true);
const store      = createStore(rootReducer, serverState, middleware);

(window as any).Store = store;

Polyfill().then(() => router.start(() => hydrate((
  <Provider store={store}>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </Provider>),
  document.getElementById("root")
)));
