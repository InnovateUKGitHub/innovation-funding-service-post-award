import { Helmet } from "react-helmet";
import { renderToString } from "react-dom/server";
import { AnyAction, createStore, Store } from "redux";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom/server";
import { NextFunction, Request, Response } from "express";
import { getParamsFromUrl } from "@ui/helpers/make-url";
import { matchRoute, routeConfig } from "@ui/routing";
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
import { Logger } from "@shared/developmentLogger";

interface IServerApp {
  requestUrl: string;
  store: Store<RootState>;
  stores: IStores;
  modalRegister: ModalRegister;
  relayEnvironment: RelayModernEnvironment;
}

const logger = new Logger("HTML Render");

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
  ({ schema }: { schema: GraphQLSchema }) =>
  async ({ req, res, next, err }: { req: Request; res: Response; next: NextFunction; err?: any }): Promise<void> => {
    const { nonce } = res.locals;
    const middleware = setupServerMiddleware();
    const context = contextProvider.start({ user: req.session?.user });
    const clientConfig = getClientConfig(context);
    const modalRegister = new ModalRegister();
    const { ServerGraphQLEnvironment, relayServerSSR } = await getServerGraphQLEnvironment({ req, res, schema });
    const preloadedQuery = loadQuery();
    let isErrorPage = false;

    // Pre-load site configuration options
    await preloadedQuery.next(ServerGraphQLEnvironment, clientConfigQueryQuery, {});

    try {
      let auth: Authorisation;
      let user: IClientUser;
      let statusCode = 200;

      if (err && !(err instanceof FormHandlerError)) {
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

      let renderUrl = req.url;

      if (err) {
        if (err instanceof FormHandlerError) {
          // A form handler error is an error that renders the original page.
          // Mark the error message that we obtained into the Redux store.
          if (err?.code === ErrorCode.VALIDATION_ERROR) {
            // We've got some kind of validation error, so let the user know that happened.
            store.dispatch(Actions.updateEditorAction(err.key, err.store, err.dto, err.error.results as Results<any>));
          } else {
            // Some other validation error occurred, so we need to add it into store as actual error.
            // Need to pair with the submit action to keep count in sync.
            store.dispatch(Actions.handleEditorSubmit(err.key, err.store, err.dto, err.result));
            store.dispatch(
              Actions.handleEditorError({
                id: err.key,
                dto: err.dto,
                error: err.error,
                store: err.store,
                scrollToTop: false,
              }),
            );
          }
        } else {
          // We cannot handle these beautifully.
          statusCode = getErrorStatus(err);
          const errorPayload = createErrorPayload(err, false).params;
          store.dispatch(Actions.setError(errorPayload));
          renderUrl = routeConfig.error.getLink({}).path;
          isErrorPage = true;
        }
      }

      // If a fatal error has NOT occurred...
      if (!isErrorPage) {
        const matched = matchRoute(req.url);
        const { params } = getParamsFromUrl(matched.routePath, req.url);

        // Check if they are allowed to access this page.
        if (matched.accessControl?.(auth, params as any, clientConfig) === false) {
          return next(new ForbiddenError());
        }
      }

      // Note: Keep resolving app queries + actions until completion for final render below
      await loadAllData(store, () => {
        renderApp({
          requestUrl: renderUrl,
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
          requestUrl: renderUrl,
          nonce,
          store,
          stores,
          modalRegister,
          relayEnvironment: finalRelayEnvironment,
          relayData,
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
