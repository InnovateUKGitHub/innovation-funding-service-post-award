import React from "react";
import { hydrate } from "react-dom";
import i18next from "i18next";
import { Provider } from "react-redux";
import { AnyAction, createStore } from "redux";
import { RouterProvider } from "react-router5";

import * as Actions from "@ui/redux/actions";
import { configureRouter, routeConfig } from "@ui/routing";
import { processDto } from "@shared/processResponse";
import { App } from "@ui/containers/app";
import {
  createStores,
  IStores,
  ModalProvider,
  ModalRegister,
  rootReducer,
  setupMiddleware,
  StoresConsumer,
  StoresProvider,
} from "@ui/redux";

import { Polyfill } from "./polyfill";

// get servers store to initialise client store
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
    action => setTimeout(() => store.dispatch(action as AnyAction)),
  );
};

// add to global to help dev
(window as any).Store = store;

// make sure middleware and reducers have run
store.dispatch(Actions.initaliseAction());

class Client extends React.Component<{}> {
  render() {
    return (
      // @todo remove once react/redux connect can be removed
      <Provider store={store}>
        <RouterProvider router={router}>
          <StoresProvider value={getStores()}>
            <StoresConsumer>{stores => <AppWithContent stores={stores} store={store} />}</StoresConsumer>
          </StoresProvider>
        </RouterProvider>
      </Provider>
    );
  }
}

class AppWithContent extends React.Component<{ stores: IStores; store: typeof store }> {
  constructor(props: any) {
    super(props);
    // whenever the store changes force a rerender this will flow down to container level
    // where if no props have changed rendering stops
    this.props.store.subscribe(() => this.setState({ marker: {} }));
  }

  render() {
    return (
      <ModalProvider value={new ModalRegister()}>
        <App store={store} routes={routes} />
      </ModalProvider>
    );
  }
}

Polyfill()
  .then(() =>
    i18next.init({
      lng: "en",
      fallbackLng: "en",
      defaultNS: "default",
      interpolation: {
        format: (value: string, format, lng) => {
          if (format === "lowercase") return value.toLocaleLowerCase();
          return value;
        },
      },
    }),
  )
  // temporarily add it globally to help debugging...
  .then(() => ((window as any).i18n = i18next))
  .then(() => {
    // get the english by default, if supporting another language and the browser specifies it then would need to get that too
    return fetch("/globalization/en")
      .then(content => {
        if (content.ok) {
          return content.json();
        } else {
          throw new Error(`Unable to load content : ${content.status} : ${content.statusText}`);
        }
      })
      .then(content => {
        i18next.addResourceBundle("en", "default", content, true, true);
      });
  })
  .then(() => router.start(() => hydrate(<Client />, document.getElementById("root"))));
