import { Helmet } from "react-helmet";
import { renderToPipeableStream, renderToString } from "react-dom/server";
import { AnyAction, createStore, Store } from "redux";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom/server";
import { Request, Response } from "express";
import { getParamsFromUrl } from "@ui/helpers/make-url";
import { matchRoute } from "@ui/routing";
import { ErrorCode, IAppError, IClientUser, IContext, Authorisation } from "@framework/types";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import * as Actions from "@ui/redux/actions";
import { App } from "@ui/containers/app";
import {
  createStores,
  IStores,
  ModalProvider,
  ModalRegister,
  rootReducer,
  RootState,
  setupInitialState,
  setupServerMiddleware,
  StoresProvider,
} from "@ui/redux";
import { createErrorPayload } from "@shared/create-error-payload";
import { contextProvider } from "@server/features/common/contextProvider";
import { Results } from "@ui/validation";
import { ForbiddenError, FormHandlerError } from "./features/common/appError";

import { GetAllProjectRolesForUser } from "./features/projects/getAllProjectRolesForUser";
import { getErrorStatus } from "./errorHandlers";
import { renderHtml } from "./html";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { getServerGraphQLEnvironment, getServerGraphQLFinalRenderEnvironment } from "@gql/ServerGraphQLEnvironment";
import { SSRCache } from "react-relay-network-modern-ssr/lib/server";
import { loadQuery } from "relay-hooks";
import { GraphQLSchema } from "graphql";
import { clientConfigQueryQuery } from "@gql/query/clientConfigQuery";

interface IServerApp {
  requestUrl: string;
  store: Store<RootState>;
  stores: IStores;
  modalRegister: ModalRegister;
  relayEnvironment: RelayModernEnvironment;
}

const ServerApp = ({ requestUrl, store, stores, modalRegister, relayEnvironment }: IServerApp) => (
  <Provider store={store}>
    <StaticRouter location={requestUrl}>
      <StoresProvider value={stores}>
        <ModalProvider value={modalRegister}>
          <App store={store} relayEnvironment={relayEnvironment} />
        </ModalProvider>
      </StoresProvider>
    </StaticRouter>
  </Provider>
);

/**
 * The main server side process handled here.
 */
const serverRender =
  ({ schema, errorCount = 0 }: { schema: GraphQLSchema; errorCount?: number }) =>
  async (req: Request, res: Response, error?: IAppError): Promise<void> => {
    // If we've already tried to render the page 5 other times,
    // throw it.
    if (errorCount >= 5) throw error;

    const { nonce } = res.locals;
    const middleware = setupServerMiddleware();
    const context = contextProvider.start({ user: req.session?.user });
    const clientConfig = getClientConfig(context);
    const modalRegister = new ModalRegister();
    const { ServerGraphQLEnvironment, relayServerSSR } = getServerGraphQLEnvironment({ req, res, error, schema });
    const preloadedQuery = loadQuery();

    // Pre-load site configuration options
    await preloadedQuery.next(ServerGraphQLEnvironment, clientConfigQueryQuery, {});

    try {
      let auth: Authorisation;
      let user: IClientUser;
      let statusCode = 200;

      if (error && !(error instanceof FormHandlerError)) {
        auth = new Authorisation({});
        user = {
          roleInfo: auth.permissions,
          email: "",
          csrf: req.csrfToken(),
          projectId: req.session?.user.projectId,
        };
      } else {
        auth = await context.runQuery(new GetAllProjectRolesForUser());
        user = {
          roleInfo: auth.permissions,
          email: req.session?.user.email,
          projectId: req.session?.user.projectId,
          csrf: req.csrfToken(),
        };
      }

      const initialState = setupInitialState(user, clientConfig);
      const store = createStore(rootReducer, initialState, middleware);

      const stores = createStores(
        () => store.getState(),
        action => process.nextTick(() => store.dispatch(action as AnyAction)),
      );

      if (error) {
        if (error instanceof FormHandlerError) {
          if (error?.code === ErrorCode.VALIDATION_ERROR) {
            // We've got some kind of validation error, so let the user know that happened.
            store.dispatch(
              Actions.updateEditorAction(error.key, error.store, error.dto, error.error.results as Results<any>),
            );
          } else if (error) {
            // Some other validation error occurred, so we need to add it into store as actual error.
            // Need to pair with the submit action to keep count in sync.
            store.dispatch(Actions.handleEditorSubmit(error.key, error.store, error.dto, error.result));
            store.dispatch(
              Actions.handleEditorError({
                id: error.key,
                dto: error.dto,
                error: error.error,
                store: error.store,
                scrollToTop: false,
              }),
            );
          }
        } else {
          // We cannot handle these beautifully.
          statusCode = getErrorStatus(error);
          const errorPayload = createErrorPayload(error, false).params;
          store.dispatch(Actions.setError(errorPayload));
        }
      }

      const matched = matchRoute(req.url);
      const { params } = getParamsFromUrl(matched.routePath, req.url);

      if (matched.accessControl?.(auth, params as any, clientConfig) === false) {
        throw new ForbiddenError();
      }

      // Note: Keep resolving app queries + actions until completion for final render below
      await loadAllData(store, () => {
        renderApp({
          requestUrl: req.url,
          nonce,
          store,
          stores,
          modalRegister,
          relayEnvironment: ServerGraphQLEnvironment,
        });
      });

      // Wait until all Relay queries have been made.
      const relayData = await relayServerSSR.getCache();
      const finalRelayEnvironment = getServerGraphQLFinalRenderEnvironment(relayData);

      res.status(statusCode).send(
        renderApp({
          requestUrl: req.url,
          nonce,
          store,
          stores,
          modalRegister,
          relayEnvironment: finalRelayEnvironment,
          relayData,
        }),
      );
    } catch (renderError: unknown) {
      // If an error occured, re-do our render with an error message instead.
      serverRender({ schema, errorCount: errorCount + 1 })(req, res, renderError as IAppError);
    }
  };

/**
 * Populates the redux store before being added as preloaded state
 */
const loadAllData = (store: Store, render: () => void): Promise<void> => {
  return new Promise<void>(resolve => {
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
    store.dispatch(Actions.initaliseAction());
  });
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
  });
}

/**
 * gets the client config
 *
 * @deprecated GraphQL Migration. See ACC-9043.
 */
function getClientConfig(context: IContext): IClientConfig {
  return {
    ifsRoot: context.config.urls.ifsRoot,
    features: context.config.features,
    ssoEnabled: context.config.sso.enabled,
    options: context.config.options,
    logLevel: context.config.logLevel,
  };
}

export { serverRender };
