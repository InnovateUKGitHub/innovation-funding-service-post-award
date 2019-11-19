import React from "react";
import { Provider } from "react-redux";
import { AnyAction, createStore } from "redux";
import { RouterProvider } from "react-router5";
import { hydrate } from "react-dom";

import { Polyfill } from "./polyfill";

import { configureRouter, routeConfig } from "@ui/routing";
import { createStores, rootReducer, setupMiddleware, StoresProvider } from "@ui/redux";
import { App } from "../ui/containers/app";
import { processDto } from "../shared/processResponse";
import * as Actions from "@ui/redux/actions";

// get servers store to initalise client store
const serverState = processDto((window as any).__PRELOADED_STATE__);
serverState.isClient = true;

const routes = routeConfig;
const router = configureRouter(routes);
const middleware = setupMiddleware(router, true);
const store = createStore(rootReducer, serverState, middleware);

// factory to make the stores for the provider
const getStores = () => {
  return createStores(
    () => store.getState(),
    (action) => setTimeout(() => store.dispatch(action as AnyAction))
  );
};

// add to global to help dev
(window as any).Store = store;

// make sure middleware and reducers have run
store.dispatch(Actions.initaliseAction());

Polyfill().then(() => router.start(() => hydrate((
  // @todo remove once react/redux connect can be removed
  <Provider store={store}>
    <RouterProvider router={router}>
      <StoresProvider value={getStores()}>
        <App store={store} routes={routes}/>
      </StoresProvider>
    </RouterProvider>
  </Provider>),
  document.getElementById("root")
)));
