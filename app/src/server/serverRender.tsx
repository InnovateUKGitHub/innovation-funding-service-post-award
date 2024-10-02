import { ErrorCode } from "@framework/constants/enums";
import { Authorisation } from "@framework/types/authorisation";
import { IClientUser } from "@framework/types/IUser";
import { getServerGraphQLEnvironment, getServerGraphQLFinalRenderEnvironment } from "@gql/ServerGraphQLEnvironment";
import { contextProvider } from "@server/features/common/contextProvider";
import { Logger } from "@shared/developmentLogger";
import { App } from "@ui/app/app";
import { ApiErrorContextProvider } from "@ui/context/api-error";
import { FormErrorContextProvider } from "@ui/context/form-error";
import { getParamsFromUrl } from "@ui/helpers/make-url";
import { IClientConfig } from "../types/IClientConfig";
import { matchRoute } from "@ui/routing/matchRoute";
import { Result } from "@ui/validation/result";
import { NextFunction, Request, Response } from "express";
import { GraphQLSchema } from "graphql";
import { renderToString } from "react-dom/server";
import { Helmet } from "react-helmet";
import { StaticRouter } from "react-router-dom/server";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { ClientErrorResponse, getErrorResponse, getErrorStatus } from "@framework/util/errorHandlers";
import { ForbiddenError, FormHandlerError, ZodFormHandlerError } from "./features/common/appError";
import { GetAllProjectRolesForUser } from "./features/projects/getAllProjectRolesForUser";
import { renderHtml } from "./html";
import { ClientConfigProvider } from "@ui/context/ClientConfigProvider";
import { MessageContextProvider } from "@ui/context/messages";
import { UserProvider } from "@ui/context/user";
import { ZodIssue } from "zod";
import { ServerZodErrorProvider } from "@ui/context/server-zod-error";
import { ServerInputContextProvider } from "@ui/context/server-input";
import { IPreloadedDataContext, PreloadedDataContextProvider } from "@ui/context/preloaded-data";
import RelayServerSSR, { SSRCache } from "react-relay-network-modern-ssr/lib/server";
import { ServerErrorContextProvider } from "@ui/context/server-error";
import { configuration } from "./features/common/config";

interface IServerApp {
  requestUrl: string;
  relayEnvironment: RelayModernEnvironment;
  formError?: Result[];
  apiError: ClientErrorResponse | null;
  clientConfig: IClientConfig;
  messages?: string[] | null;
  userConfig: IClientUser;
  serverZodErrors: ZodIssue[];
  preloadedServerInput: AnyObject | undefined;
  preloadedData: AnyObject;
  preloadedServerErrors: ClientErrorResponse | null;
  isErrorPage: boolean;
}

const logger = new Logger("HTML Render");

const ServerApp = ({
  requestUrl,
  relayEnvironment,
  formError,
  apiError,
  clientConfig,
  messages,
  userConfig,
  serverZodErrors,
  preloadedServerInput,
  preloadedData,
  preloadedServerErrors,
}: IServerApp) => (
  <ServerErrorContextProvider value={preloadedServerErrors}>
    <ServerInputContextProvider value={preloadedServerInput}>
      <ServerZodErrorProvider value={serverZodErrors}>
        <UserProvider value={userConfig}>
          <ClientConfigProvider config={clientConfig}>
            <ApiErrorContextProvider value={apiError}>
              <FormErrorContextProvider value={formError}>
                <StaticRouter location={requestUrl}>
                  <PreloadedDataContextProvider preloadedData={preloadedData as IPreloadedDataContext["data"]}>
                    <MessageContextProvider preloadedMessages={messages}>
                      <App relayEnvironment={relayEnvironment} />
                    </MessageContextProvider>
                  </PreloadedDataContextProvider>
                </StaticRouter>
              </FormErrorContextProvider>
            </ApiErrorContextProvider>
          </ClientConfigProvider>
        </UserProvider>
      </ServerZodErrorProvider>
    </ServerInputContextProvider>
  </ServerErrorContextProvider>
);

/**
 * The main server side process handled here.
 */
const serverRender =
  ({ schema }: { schema: GraphQLSchema }) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async ({ req, res, next, err }: { req: Request; res: Response; next: NextFunction; err?: any }): Promise<void> => {
    const { nonce } = res.locals;
    const { ServerGraphQLEnvironment, relayServerSSR } = await getServerGraphQLEnvironment({ req, res, schema });
    let isErrorPage = false;
    const jsDisabled = req.headers["x-acc-js-disabled"] === "true";
    const clientConfig = getClientConfig();

    try {
      let auth: Authorisation;
      let user: IClientUser;
      let statusCode = 200;

      if (err && !(err instanceof FormHandlerError || err instanceof ZodFormHandlerError)) {
        auth = new Authorisation({});
        user = {
          roleInfo: auth.permissions,
          email: "",
          csrf: req.csrfToken(),
          projectId: req.session?.user.projectId,
          userSwitcherSearchQuery: req.session?.user.userSwitcherSearchQuery,
        };
      } else {
        const context = await contextProvider.start({ user: req.session?.user, traceId: res?.locals.traceId });
        auth = await context.runQuery(new GetAllProjectRolesForUser());
        user = {
          roleInfo: auth.permissions,
          email: req.session?.user.email,
          projectId: req.session?.user.projectId,
          userSwitcherSearchQuery: req.session?.user.userSwitcherSearchQuery,
          csrf: req.csrfToken(),
        };
      }

      let formError: Result[] = [];
      let apiError: ClientErrorResponse | null = null;
      if (err) {
        // A form handler error is an error that renders the original page.
        if (err instanceof ZodFormHandlerError) {
          res.locals.serverZodErrors = err.zodIssues;

          // If a DTO is provided, add to Redux state so that it may be used
          // to repopulate the user's input form.
          if (err.dto) {
            res.locals.preloadedServerInput = err.dto;
          }
        } else if (err instanceof FormHandlerError) {
          // Mark the error message that we obtained into the Redux store.
          if (err?.code === ErrorCode.VALIDATION_ERROR) {
            // We've got some kind of validation error, so let the user know that happened.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formError = formError.concat(err?.cause?.results?.errors ?? []);
          } else {
            // Some other validation error occurred, so we need to add it into store as actual error.
            // Need to pair with the submit action to keep count in sync.

            apiError = getErrorResponse(err.cause, res.locals.traceId);
          }
        } else {
          // We cannot handle these beautifully.
          statusCode = getErrorStatus(err);
          const errorPayload = getErrorResponse(err, res.locals.traceId);
          res.locals.preloadedServerErrors = errorPayload;
          isErrorPage = true;
          apiError = errorPayload;
        }
      }

      // If a fatal error has NOT occurred...
      if (!isErrorPage) {
        const matched = matchRoute(req.url);
        const { params } = getParamsFromUrl(matched.routePath, req.url);

        // Check if they are allowed to access this page.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (matched.accessControl?.(auth, params as any, clientConfig) === false) {
          logger.warn("Access control failure", {
            route: req.url,
            routeName: matched.routeName,
            username: req.session?.user.email,
            traceId: res.locals.traceId,
          });
          return next(new ForbiddenError());
        }
      }

      // Note: Keep resolving app queries + actions until completion for final render below
      await loadAllData(relayServerSSR, () => {
        renderApp({
          requestUrl: req.url,
          nonce,
          relayEnvironment: ServerGraphQLEnvironment,
          clientConfig,
          jsDisabled,
          messages: res.locals.messages,
          userConfig: user,
          serverZodErrors: res.locals.serverZodErrors,
          preloadedServerInput: res.locals.preloadedServerInput,
          preloadedData: res.locals.preloadedData,
          preloadedServerErrors: res.locals.preloadedServerErrors,
          apiError,
          isErrorPage,
        });
      });

      // Wait until all Relay queries have been made.
      const relayData = await relayServerSSR.getCache();
      const finalRelayEnvironment = getServerGraphQLFinalRenderEnvironment(relayData);

      const relayErrors = relayData.filter(([, data]) => data.errors && data.errors.length > 0);

      if (relayErrors.length) {
        statusCode = 500;
        isErrorPage = true;
      }

      res.status(statusCode).send(
        renderApp({
          requestUrl: req.url,
          nonce,
          relayEnvironment: finalRelayEnvironment,
          relayData,
          formError,
          apiError,
          clientConfig,
          jsDisabled,
          userConfig: user,
          messages: res.locals.messages,
          serverZodErrors: res.locals.serverZodErrors,
          preloadedServerInput: res.locals.preloadedServerInput,
          preloadedData: res.locals.preloadedData,
          preloadedServerErrors: res.locals.preloadedServerErrors,
          isErrorPage,
        }),
      );
    } catch (renderError: unknown) {
      logger.error(
        "Caught a server render error",
        { user: req.session?.user.email, traceId: res.locals.traceId },
        renderError,
      );
      next(renderError);
    }
  };

/**
 * Populates the redux store before being added as preloaded state
 */
const loadAllData = async (relayServerSSR: RelayServerSSR, render: () => void): Promise<void> => {
  // Re-render the page 4 more times to ensure all lazyLoadQuerys are completed
  for (let i = 0; i < 4; i++) {
    // Rerender for nested "useLazyLoadQuery"
    await relayServerSSR.getCache();
    render();
  }
};

/**
 * renders the app server side
 */
function renderApp(props: {
  requestUrl: string;
  nonce: string;
  relayEnvironment: RelayModernEnvironment;
  relayData?: SSRCache;
  formError?: Result[] | undefined;
  apiError: ClientErrorResponse | null;
  clientConfig: IClientConfig;
  jsDisabled: boolean;
  messages?: string[];
  userConfig: IClientUser;
  serverZodErrors: ZodIssue[];
  preloadedServerInput: AnyObject | undefined;
  preloadedData: AnyObject;
  preloadedServerErrors: ClientErrorResponse | null;
  isErrorPage: boolean;
}): string {
  const html = renderToString(<ServerApp {...props} />);
  // Note: Must be called after "renderToString"
  const helmet = Helmet.renderStatic();

  return renderHtml({
    HelmetInstance: helmet,
    html,
    nonce: props.nonce,
    relayData: props.relayData,
    formError: props.formError,
    apiError: props.apiError,
    clientConfig: props.clientConfig,
    jsDisabled: props.jsDisabled,
    messages: props.messages,
    userConfig: props.userConfig,
    serverZodErrors: props.serverZodErrors,
    preloadedServerInput: props.preloadedServerInput,
    preloadedData: props.preloadedData,
    preloadedServerErrors: props.preloadedServerErrors,
    isErrorPage: props.isErrorPage,
  });
}

/**
 * Pick the ClientConfig from Context.
 */
function getClientConfig(): IClientConfig {
  return {
    ifsRoot: configuration.urls.ifsRoot,
    features: configuration.features,
    ssoEnabled: configuration.sso.enabled,
    options: configuration.options,
    accEnvironment: configuration.accEnvironment,
    logLevel: configuration.logLevel,
    developer: { oidc: { enabled: configuration.developer.oidc.enabled } },
  };
}

export { serverRender };
