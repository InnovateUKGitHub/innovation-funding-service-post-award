import { useEffect, useState } from "react";
import { hydrateRoot } from "react-dom/client";
import i18next from "i18next";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AnyAction, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import * as Actions from "@ui/redux/actions";
import { processDto } from "@shared/processResponse";
import { App } from "@ui/containers/app";
import {
  createStores,
  rootReducer,
  setupClientMiddleware,
  StoresProvider,
  ModalProvider,
  ModalRegister,
} from "@ui/redux";

import { getPolyfills } from "./polyfill";

// get servers store to initialise client store
const serverState = processDto(window.__PRELOADED_STATE__);

const middleware = composeWithDevTools(setupClientMiddleware());
const store = createStore(rootReducer, serverState, middleware);

// factory to make the stores for the provider
const getStores = () => {
  return createStores(
    () => store.getState(),
    action => setTimeout(() => store.dispatch(action as AnyAction)),
  );
};

// make sure middleware and reducers have run
store.dispatch(Actions.initaliseAction());

const Client = () => {
  const [, setState] = useState(0);

  useEffect(() => {
    // whenever the store changes force a rerender this will flow down to container level
    // where if no props have changed rendering stops
    store.subscribe(() => setState(s => s + 1));
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <StoresProvider value={getStores()}>
          <ModalProvider value={new ModalRegister()}>
            <App store={store} />
          </ModalProvider>
        </StoresProvider>
      </BrowserRouter>
    </Provider>
  );
};

getPolyfills()
  .then(() =>
    i18next.init({
      lng: "en",
      fallbackLng: "en",
      defaultNS: "default",
      interpolation: {
        format: (value: string, format) => {
          if (format === "lowercase") return value.toLocaleLowerCase();
          return value;
        },
      },
    }),
  )
  // temporarily add it globally to help debugging...
  .then(() => (window.i18n = i18next))
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
  .then(() => {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("Cannot find Root element from which to attach the app");
    }
    hydrateRoot(rootElement, <Client />);
  });
