import { Helmet } from "react-helmet";
import { renderToString } from "react-dom/server";
import { AnyAction, createStore, Store } from "redux";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom/server";
import { Request, Response } from "express";
import { getParamsFromUrl } from "@ui/helpers/make-url";
import { routeConfig, matchRoute } from "@ui/routing";
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
import { ForbiddenError,FormHandlerError } from "./features/common/appError";

import { GetAllProjectRolesForUser } from "./features/projects/getAllProjectRolesForUser";
import { Logger } from "./features/common/logger";
import { getErrorStatus } from "./errorHandlers";
import { renderHtml } from "./html";

export async function serverRender(req: Request, res: Response, error?: IAppError): Promise<void> {
  const { nonce } = res.locals;
  const middleware = setupServerMiddleware();
  const context = contextProvider.start({ user: req.session!.user });
  const clientConfig = getClientConfig(context);
  const modalRegister = new ModalRegister();

  try {
    if (error && !(error instanceof FormHandlerError)) {
      throw error;
    }

    const auth = await context.runQuery(new GetAllProjectRolesForUser());
    const user: IClientUser = { roleInfo: auth.permissions, email: req.session!.user.email, csrf: req.csrfToken() };
    const initialState = setupInitialState(user, clientConfig);
    const store = createStore(rootReducer, initialState, middleware);

    const stores = createStores(
      () => store.getState(),
      action => process.nextTick(() => store.dispatch(action as AnyAction)),
    );

    const matched = matchRoute(req.url);
    const params = getParamsFromUrl(matched.routePath, req.url);

    if (matched.accessControl?.(auth, params, clientConfig) === false) {
      throw new ForbiddenError();
    }

    // Note: Keep resolving app queries + actions until completion for final render below
    await loadAllData(store, () => {
      renderApp(req.url, nonce, store, stores, modalRegister);
    });

    onComplete(store, error);
    res.send(renderApp(req.url, nonce, store, stores, modalRegister));
  } catch (renderError: unknown) {

    // TODO: add error handling for salesforce errors e.g. invalid project id
    // Note: capture stack trace for logs
    new Logger(req.session?.user).error((renderError as IAppError).message, renderError);
    const errorStatusCode = getErrorStatus(renderError as IAppError);
    const errorPayload = createErrorPayload(renderError as IAppError, false).params;

    const auth = new Authorisation({});
    const user: IClientUser = { roleInfo: auth.permissions, email: "", csrf: req.csrfToken() };
    const initialState = setupInitialState(user, clientConfig);
    const store = createStore(rootReducer, initialState, middleware);

    const stores = createStores(
      () => store.getState(),
      action => process.nextTick(() => store.dispatch(action as AnyAction)),
    );

    // Note: Keep resolving app queries + actions until completion for final render below
    await loadAllData(store, () => {
      renderApp(req.url, nonce, store, stores, modalRegister);
    });

    store.dispatch(Actions.setError(errorPayload));

    res.status(errorStatusCode).send(renderApp(routeConfig.error.routePath, nonce, store, stores, modalRegister));
  }
}

function loadAllData(store: Store, render: () => void): Promise<void> {
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
}

function onComplete(store: Store, error?: FormHandlerError) {
  // validation error occurred so add it into store as validation error
  if (error?.code === ErrorCode.VALIDATION_ERROR) {
    store.dispatch(Actions.updateEditorAction(error.key, error.store, error.dto, error.error.results!));
  } else if (error) {
    // some other validation error occurred so add it into store as actual error
    // need to pair with the submit action to keep count in sync
    store.dispatch(Actions.handleEditorSubmit(error.key, error.store, error.dto, error.result));
    store.dispatch(
      Actions.handleEditorError({
        id: error.key,
        dto: error.dto,
        validation: error.result,
        error: error.error,
        store: error.store,
        scrollToTop: false,
      }),
    );
  }
}

function renderApp(
  requestUrl: string,
  nonce: string,
  store: Store<RootState>,
  stores: IStores,
  modalRegister: ModalRegister,
): string {
  const state = store.getState();
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={requestUrl}>
        <StoresProvider value={stores}>
          <ModalProvider value={modalRegister}>
            <App store={store} />
          </ModalProvider>
        </StoresProvider>
      </StaticRouter>
    </Provider>,
  );
  // Note: Must be called after "renderToString"
  const helmet = Helmet.renderStatic();

  return renderHtml(helmet, html, state, nonce);
}

function getClientConfig(context: IContext): IClientConfig {
  return {
    ifsRoot: context.config.urls.ifsRoot,
    features: context.config.features,
    ssoEnabled: context.config.sso.enabled,
    options: context.config.options,
  };
}
