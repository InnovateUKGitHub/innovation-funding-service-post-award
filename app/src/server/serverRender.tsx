import { ErrorCode } from "@framework/constants/enums";
import { Authorisation } from "@framework/types/authorisation";
import { IAppError } from "@framework/types/IAppError";
import { IContext } from "@framework/types/IContext";
import { IClientUser } from "@framework/types/IUser";
import { getServerGraphQLEnvironment, getServerGraphQLFinalRenderEnvironment } from "@gql/ServerGraphQLEnvironment";
import { contextProvider } from "@server/features/common/contextProvider";
import { createErrorPayload } from "@shared/create-error-payload";
import { Logger } from "@shared/developmentLogger";
import { App } from "@ui/containers/app";
import { ApiErrorContextProvider } from "@ui/context/api-error";
import { FormErrorContextProvider } from "@ui/context/form-error";
import { getParamsFromUrl } from "@ui/helpers/make-url";
import { updateEditorAction, handleEditorSubmit, handleEditorError } from "@ui/redux/actions/common/editorActions";
import { setError } from "@ui/redux/actions/common/errorActions";
import { initaliseAction } from "@ui/redux/actions/initalise";
import { setupInitialState } from "@ui/redux/initialState";
import { setupServerMiddleware } from "@ui/redux/middleware";
import { ModalProvider, ModalRegister } from "@ui/redux/modalProvider";
import { IClientConfig } from "../types/IClientConfig";
import { rootReducer, RootState } from "@ui/redux/reducers/rootReducer";
import { createStores, IStores, StoresProvider } from "@ui/redux/storesProvider";
import { matchRoute } from "@ui/routing/matchRoute";
import { routeConfig } from "@ui/routing/routeConfig";
import { Result } from "@ui/validation/result";
import { Results } from "@ui/validation/results";
import { NextFunction, Request, Response } from "express";
import { GraphQLSchema } from "graphql";
import { renderToString } from "react-dom/server";
import { Helmet } from "react-helmet";
import { Provider } from "react-redux";
import { SSRCache } from "react-relay-network-modern-ssr/lib/server";
import { StaticRouter } from "react-router-dom/server";
import { AnyAction, createStore, Store } from "redux";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { getErrorStatus } from "./errorHandlers";
import { ForbiddenError, FormHandlerError, ZodFormHandlerError } from "./features/common/appError";
import { GetAllProjectRolesForUser } from "./features/projects/getAllProjectRolesForUser";
import { renderHtml } from "./html";
import { ClientConfigProvider } from "@ui/components/providers/ClientConfigProvider";
import { MessageContextProvider } from "@ui/context/messages";
import { setZodError } from "@ui/redux/actions/common/zodErrorAction";
import { setPreviousReactHookFormInput } from "@ui/redux/actions/common/previousReactHookFormInputAction";
import RelayServerSSR from "react-relay-network-modern-ssr/node8/server";

interface IServerApp {
  requestUrl: string;
  store: Store<RootState>;
  stores: IStores;
  modalRegister: ModalRegister;
  relayEnvironment: RelayModernEnvironment;
  formError?: Result[];
  apiError?: IAppError;
  clientConfig: IClientConfig;
}

const logger = new Logger("HTML Render");

const ServerApp = ({
  requestUrl,
  store,
  stores,
  modalRegister,
  relayEnvironment,
  formError,
  apiError,
  clientConfig,
}: IServerApp) => (
  <ClientConfigProvider config={clientConfig}>
    <ApiErrorContextProvider value={apiError}>
      <FormErrorContextProvider value={formError}>
        <Provider store={store}>
          <StaticRouter location={requestUrl}>
            <StoresProvider value={stores}>
              <ModalProvider value={modalRegister}>
                <MessageContextProvider>
                  <App store={store} relayEnvironment={relayEnvironment} />
                </MessageContextProvider>
              </ModalProvider>
            </StoresProvider>
          </StaticRouter>
        </Provider>
      </FormErrorContextProvider>
    </ApiErrorContextProvider>
  </ClientConfigProvider>
);

/**
 * The main server side process handled here.
 */
const serverRender =
  ({ schema }: { schema: GraphQLSchema }) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async ({ req, res, next, err }: { req: Request; res: Response; next: NextFunction; err?: any }): Promise<void> => {
    const { nonce } = res.locals;
    const middleware = setupServerMiddleware();
    const context = contextProvider.start({ user: req.session?.user });
    const clientConfig = getClientConfig(context);
    const modalRegister = new ModalRegister();
    const { ServerGraphQLEnvironment, relayServerSSR } = await getServerGraphQLEnvironment({ req, res, schema });
    let isErrorPage = false;

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
        auth = await context.runQuery(new GetAllProjectRolesForUser());
        user = {
          roleInfo: auth.permissions,
          email: req.session?.user.email,
          projectId: req.session?.user.projectId,
          userSwitcherSearchQuery: req.session?.user.userSwitcherSearchQuery,
          csrf: req.csrfToken(),
        };
      }

      const initialState = setupInitialState(user, clientConfig);
      const store = createStore(rootReducer, initialState, middleware);

      const stores = createStores({
        getState: () => store.getState(),
        dispatch: action => process.nextTick(() => store.dispatch(action as AnyAction)),
      });

      let renderUrl = req.url;

      let formError: Result[] = [];
      let apiError: IAppError | undefined;
      if (err) {
        // A form handler error is an error that renders the original page.
        if (err instanceof ZodFormHandlerError) {
          // Dispatch the Zod issues we have into Redux, such that they are
          // available on page load.
          store.dispatch(setZodError(err.zodIssues));

          // If a DTO is provided, add to Redux state so that it may be used
          // to repopulate the user's input form.
          if (err.dto) store.dispatch(setPreviousReactHookFormInput(err.dto));
        } else if (err instanceof FormHandlerError) {
          // Mark the error message that we obtained into the Redux store.
          if (err?.code === ErrorCode.VALIDATION_ERROR) {
            // We've got some kind of validation error, so let the user know that happened.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            store.dispatch(updateEditorAction(err.key, err.store, err.dto, err.error.results as Results<any>));
            formError = formError.concat(err?.error?.results?.errors ?? []);
          } else {
            // Some other validation error occurred, so we need to add it into store as actual error.
            // Need to pair with the submit action to keep count in sync.
            store.dispatch(handleEditorSubmit(err.key, err.store, err.dto, err.result));
            store.dispatch(
              handleEditorError({
                id: err.key,
                dto: err.dto,
                error: err.error,
                store: err.store,
                scrollToTop: false,
              }),
            );
            apiError = err.error;
          }
        } else {
          // We cannot handle these beautifully.
          statusCode = getErrorStatus(err);
          const errorPayload = createErrorPayload(err, false).params;
          store.dispatch(setError(errorPayload));
          renderUrl = routeConfig.error.getLink({}).path;
          isErrorPage = true;
          apiError = errorPayload as unknown as IAppError;
        }
      }

      // If a fatal error has NOT occurred...
      if (!isErrorPage) {
        const matched = matchRoute(req.url);
        const { params } = getParamsFromUrl(matched.routePath, req.url);

        // Check if they are allowed to access this page.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (matched.accessControl?.(auth, params as any, clientConfig) === false) {
          return next(new ForbiddenError());
        }

        // Run any pre-loaded redux actions that may be emitted by form handlers.
        if (res.locals.preloadedReduxActions) {
          for (const action of res.locals.preloadedReduxActions) {
            store.dispatch(action);
          }
        }
      }

      // Note: Keep resolving app queries + actions until completion for final render below
      await loadAllData(store, relayServerSSR, () => {
        renderApp({
          requestUrl: renderUrl,
          nonce,
          store,
          stores,
          modalRegister,
          relayEnvironment: ServerGraphQLEnvironment,
          clientConfig,
        });
      });

      // Wait until all Relay queries have been made.
      const relayData = await relayServerSSR.getCache();
      const finalRelayEnvironment = getServerGraphQLFinalRenderEnvironment(relayData);

      res.status(statusCode).send(
        renderApp({
          requestUrl: renderUrl,
          nonce,
          store,
          stores,
          modalRegister,
          relayEnvironment: finalRelayEnvironment,
          relayData,
          formError,
          apiError,
          clientConfig,
        }),
      );
    } catch (renderError: unknown) {
      logger.error("Caught a server render error", renderError);
      next(renderError);
    }
  };

/**
 * Populates the redux store before being added as preloaded state
 */
const loadAllData = async (store: Store, relayServerSSR: RelayServerSSR, render: () => void): Promise<void> => {
  await new Promise<void>(resolve => {
    const unsubscribeStore = store.subscribe(() => {
      if (store.getState().loadStatus === 0) {
        // render the app to cause any other actions to go round the loop
        render();

        // queue to see if all data loads are finished
        // if they haven't finished it is presumed a promise is still to resolve
        // causing another store changed event
        process.nextTick(() => {
          if (store.getState().loadStatus === 0) {
            unsubscribeStore();

            resolve();
          }
        });
      }
    });

    // initial action to kick of callbacks
    store.dispatch(initaliseAction());
  });

  // Rerender for nested "useLazyLoadQuery"
  await relayServerSSR.getCache();
  render();
};

/**
 * renders the app server side
 */
function renderApp(props: {
  requestUrl: string;
  nonce: string;
  store: Store<RootState>;
  stores: IStores;
  modalRegister: ModalRegister;
  relayEnvironment: RelayModernEnvironment;
  relayData?: SSRCache;
  formError?: Result[] | undefined;
  apiError?: IAppError | undefined;
  clientConfig: IClientConfig;
}): string {
  const state = props.store.getState();
  const html = renderToString(<ServerApp {...props} />);
  // Note: Must be called after "renderToString"
  const helmet = Helmet.renderStatic();

  return renderHtml({
    HelmetInstance: helmet,
    html,
    preloadedState: state,
    nonce: props.nonce,
    relayData: props.relayData,
    formError: props.formError,
    apiError: props.apiError,
    clientConfig: props.clientConfig,
  });
}

/**
 * Pick the ClientConfig from Context.
 */
function getClientConfig(context: IContext): IClientConfig {
  return {
    ifsRoot: context.config.urls.ifsRoot,
    features: context.config.features,
    ssoEnabled: context.config.sso.enabled,
    options: context.config.options,
    accEnvironment: context.config.accEnvironment,
    logLevel: context.config.logLevel,
  };
}

export { serverRender };
