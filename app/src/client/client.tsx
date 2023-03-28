import { CopyLanguages } from "@copy/data";
import { parseLogLevel } from "@framework/types/logLevel";
import { ClientGraphQLEnvironment } from "@gql/ClientGraphQLEnvironment";
import { Logger } from "@shared/developmentLogger";
import { processDto } from "@shared/processResponse";
import { App } from "@ui/containers/app";
import {
  createStores,
  ModalProvider,
  ModalRegister,
  rootReducer,
  RootState,
  setupClientMiddleware,
  StoresProvider,
} from "@ui/redux";
import * as Actions from "@ui/redux/actions";
import { useEffect, useState } from "react";
import { hydrateRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import type { PreloadedState } from "redux";
import { AnyAction, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { clientInternationalisation } from "./clientInternationalisation";
import { getPolyfills } from "./polyfill";

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
    const jsEnabledAnimationFrame = requestAnimationFrame(() => {
      window.document.body.classList.add("js-enabled");
    });

    // Whenever our IFS-PA store changes...
    const unsubscribe = store.subscribe(() => {
      // Wait for the render to finish, before setting state to trigger a rerender.
      setTimeout(() => setState(s => s + 1));
    });

    // Unsubscribe when the <Client /> will unmount.
    // Cancel adding js-enabled class if the client unmounts.
    return () => {
      unsubscribe();
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
  await clientInternationalisation(CopyLanguages.en_GB);

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Cannot find Root element from which to attach the app");
  }
  hydrateRoot(rootElement, <Client />);
})();
