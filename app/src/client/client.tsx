import { useEffect, useState } from "react";
import { hydrateRoot } from "react-dom/client";
import i18next from "i18next";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AnyAction, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import type { PreloadedState } from "redux";
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
  RootState,
} from "@ui/redux";

import { getPolyfills } from "./polyfill";
import { Logger } from "@shared/developmentLogger";
import { allLanguages, allNamespaces, CopyLanguages, CopyNamespaces } from "@copy/data";
import { initReactI18next } from "react-i18next";
import { ClientGraphQLEnvironment } from "@gql/ClientGraphQLEnvironment";
import { parseLogLevel } from "@framework/types/logLevel";
import { i18nInterpolationOptions } from "@copy/interpolation";

// get servers store to initialise client store
const serverState = processDto(window.__PRELOADED_STATE__) as unknown as PreloadedState<RootState>;
Logger.setDefaultOptions({ logLevel: parseLogLevel(serverState.config.logLevel) });

const middleware = composeWithDevTools(setupClientMiddleware());
const store = createStore(rootReducer, serverState, middleware);

// Create a IFS-PA (not Redux) store.
const getStores = () => {
  return createStores(
    () => store.getState(),
    action => store.dispatch(action as AnyAction),
  );
};

// make sure middleware and reducers have run
store.dispatch(Actions.initaliseAction());

const Client = () => {
  const [, setState] = useState(0);

  useEffect(() => {
    const jsEnabledAnimationFrame = setTimeout(() => {
      window.document.body.classList.add("js-enabled");
    }, 100);

    // Whenever our IFS-PA store changes...
    const unsub = store.subscribe(() => {
      // Wait for the render to finish, before setting state to trigger a rerender.
      setTimeout(() => setState(s => s + 1));
    });

    // Unsubscribe when the <Client /> will unmount.
    // Cancel adding js-enabled class if the client unmounts.
    return () => {
      unsub();
      clearTimeout(jsEnabledAnimationFrame);
    };
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <StoresProvider value={getStores()}>
          <ModalProvider value={new ModalRegister()}>
            <App store={store} relayEnvironment={ClientGraphQLEnvironment} />
          </ModalProvider>
        </StoresProvider>
      </BrowserRouter>
    </Provider>
  );
};

(async () => {
  await getPolyfills();

  await i18next.use(initReactI18next).init({
    lng: CopyLanguages.en_GB,
    fallbackLng: CopyLanguages.en_GB,
    defaultNS: CopyNamespaces.DEFAULT,
    fallbackNS: CopyNamespaces.DEFAULT,
    interpolation: i18nInterpolationOptions,
  });

  const promises = [];

  // TODO: Don't fetch ALL languages and namespaces by default.
  for (const namespace of allNamespaces) {
    for (const language of allLanguages) {
      const promise = fetch(`/internationalisation/${language}/${namespace}`)
        .then(res => res.json())
        .then(data => {
          i18next.addResourceBundle("en-GB", namespace, data, true, true);
        });

      promises.push(promise);
    }
  }

  await Promise.all(promises);

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Cannot find Root element from which to attach the app");
  }
  hydrateRoot(rootElement, <Client />);
})();
