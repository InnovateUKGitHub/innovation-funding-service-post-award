import { CopyLanguages } from "@copy/data";
import { parseLogLevel } from "@framework/types/logLevel";
import { ClientGraphQLEnvironment } from "@gql/ClientGraphQLEnvironment";
import { Logger } from "@shared/developmentLogger";
import { processDto } from "@shared/processResponse";
import { App } from "@ui/containers/app";
import { ApiErrorContextProvider } from "@ui/context/api-error";
import { FormErrorContextProvider } from "@ui/context/form-error";
import { ModalProvider, ModalRegister } from "@ui/redux/modalProvider";
import { createStores, StoresProvider } from "@ui/redux/storesProvider";
import { MessageContextProvider } from "@ui/context/messages";
import { useEffect, useState } from "react";
import { hydrateRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import type { PreloadedState } from "redux";
import { AnyAction, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { clientInternationalisation } from "./clientInternationalisation";
import { getPolyfills } from "./polyfill";
import { setupClientMiddleware } from "@ui/redux/middleware";
import { IAppError } from "@framework/types/IAppError";
import { RootState, rootReducer } from "@ui/redux/reducers/rootReducer";
import { Result } from "@ui/validation/result";
import { initaliseAction } from "@ui/redux/actions/initalise";
import { ClientConfigProvider } from "@ui/components/providers/ClientConfigProvider";
import { IClientConfig } from "src/types/IClientConfig";

// get servers store to initialise client store
const clientConfig = processDto(window.__CLIENT_CONFIG__) as unknown as IClientConfig;
const serverState = processDto(window.__PRELOADED_STATE__) as unknown as PreloadedState<RootState>;
const formErrors = processDto(window.__PRELOADED_FORM_ERRORS__) as unknown as Result[] | undefined;
const apiErrors = (processDto(window.__PRELOADED_API_ERRORS__) || null) as unknown as IAppError | null;
Logger.setDefaultOptions({ logLevel: parseLogLevel(clientConfig.logLevel) });

const middleware = composeWithDevTools(setupClientMiddleware());
const store = createStore(rootReducer, serverState, middleware);

// Create a IFS-PA (not Redux) store.
const getStores = () => {
  return createStores({
    getState: () => store.getState(),
    dispatch: action => store.dispatch(action as AnyAction),
  });
};

// make sure middleware and reducers have run
store.dispatch(initaliseAction());

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
      <ClientConfigProvider config={clientConfig}>
        <ApiErrorContextProvider value={apiErrors}>
          <FormErrorContextProvider value={formErrors}>
            <MessageContextProvider>
              <BrowserRouter>
                <StoresProvider value={getStores()}>
                  <ModalProvider value={new ModalRegister()}>
                    <App store={store} relayEnvironment={ClientGraphQLEnvironment} />
                  </ModalProvider>
                </StoresProvider>
              </BrowserRouter>
            </MessageContextProvider>
          </FormErrorContextProvider>
        </ApiErrorContextProvider>
      </ClientConfigProvider>
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
