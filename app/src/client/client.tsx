import { CopyLanguages } from "@copy/data";
import { parseLogLevel } from "@framework/types/logLevel";
import { ClientGraphQLEnvironment } from "@gql/ClientGraphQLEnvironment";
import { Logger } from "@shared/developmentLogger";
import { processDto } from "@shared/processResponse";
import { App } from "@ui/app/app";
import { ApiErrorContextProvider } from "@ui/context/api-error";
import { FormErrorContextProvider } from "@ui/context/form-error";
import { MessageContextProvider } from "@ui/context/messages";
import { useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { clientInternationalisation } from "./clientInternationalisation";
import { getPolyfills } from "./polyfill";
import { Result } from "@ui/validation/result";
import { ClientConfigProvider } from "@ui/context/ClientConfigProvider";
import { IClientConfig } from "../types/IClientConfig";
import { FetchKeyProvider } from "@ui/context/FetchKeyProvider";
import { IClientUser } from "@framework/types/IUser";
import { UserProvider } from "@ui/context/user";
import { ZodIssue } from "zod";
import { ServerZodErrorProvider } from "@ui/context/server-zod-error";
import { ServerInputContextProvider } from "@ui/context/server-input";
import { IPreloadedDataContext, PreloadedDataContextProvider } from "@ui/context/preloaded-data";
import { ServerErrorContextProvider } from "@ui/context/server-error";
import { ClientErrorResponse } from "@framework/util/errorHandlers";

// get servers store to initialise client store
const clientConfig = processDto(window.__CLIENT_CONFIG__) as unknown as IClientConfig;
const formErrors = processDto(window.__PRELOADED_FORM_ERRORS__) as unknown as Result[] | undefined;
const apiErrors = (processDto(window.__PRELOADED_API_ERRORS__) || null) as unknown as ClientErrorResponse | null;
const preloadedMessages = (processDto(window.__PRELOADED_MESSAGES__) || null) as unknown as string[] | null;
const userConfig = processDto(window.__USER_CONFIG__) as unknown as IClientUser;
const serverZodErrors = processDto(window.__PRELOADED_SERVER_ZOD_ERRORS__ || []) as unknown as ZodIssue[];
const serverInput = processDto(window.__PRELOADED_SERVER_INPUT__ || null) as unknown as AnyObject;
const preloadedData = (processDto(window.__PRELOADED_DATA__) || null) as AnyObject | null;
const serverErrors = processDto(window.__PRELOADED_SERVER_ERRORS__ || null) as ClientErrorResponse;

Logger.setDefaultOptions({ logLevel: parseLogLevel(clientConfig.logLevel) });

const Client = () => {
  useEffect(() => {
    const jsEnabledAnimationFrame = requestAnimationFrame(() => {
      window.document.body.classList.add("js-enabled");
    });

    // Unsubscribe when the <Client /> will unmount.
    // Cancel adding js-enabled class if the client unmounts.
    return () => {
      clearTimeout(jsEnabledAnimationFrame);
    };
  }, []);

  return (
    <ServerErrorContextProvider value={serverErrors}>
      <ServerInputContextProvider value={serverInput ?? {}}>
        <ServerZodErrorProvider value={serverZodErrors}>
          <UserProvider value={userConfig}>
            <FetchKeyProvider>
              <ClientConfigProvider config={clientConfig}>
                <ApiErrorContextProvider value={apiErrors}>
                  <FormErrorContextProvider value={formErrors}>
                    <PreloadedDataContextProvider preloadedData={preloadedData as IPreloadedDataContext["data"]}>
                      <MessageContextProvider preloadedMessages={preloadedMessages}>
                        <BrowserRouter>
                          <App relayEnvironment={ClientGraphQLEnvironment} />
                        </BrowserRouter>
                      </MessageContextProvider>
                    </PreloadedDataContextProvider>
                  </FormErrorContextProvider>
                </ApiErrorContextProvider>
              </ClientConfigProvider>
            </FetchKeyProvider>
          </UserProvider>
        </ServerZodErrorProvider>
      </ServerInputContextProvider>
    </ServerErrorContextProvider>
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
