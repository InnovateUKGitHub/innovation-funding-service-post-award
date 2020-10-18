import React from "react";
import { renderToString } from "react-dom/server";
import { AnyAction, createStore, Store } from "redux";
import { constants as routerConstants, Router, State } from "router5";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router5";
import { Request, Response } from "express";

import { configureRouter, IRoutes, MatchedRoute, matchRoute, routeConfig } from "@ui/routing";
import { ErrorCode, IAppError, IClientUser, IContext } from "@framework/types";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import * as Actions from "@ui/redux/actions";
import { App } from "@ui/containers/app";
import { Content } from "@content/content";
import {
  createStores,
  IStores,
  ModalProvider,
  ModalRegister,
  rootReducer,
  RootState,
  setupInitialState,
  setupMiddleware,
  StoresProvider,
} from "@ui/redux";

import contextProvider from "./features/common/contextProvider";
import { ForbiddenError, FormHandlerError, NotFoundError } from "./features/common/appError";
import { GetAllProjectRolesForUser } from "./features/projects/getAllProjectRolesForUser";
import { Logger } from "./features/common/logger";
import { getErrorStatus } from "./errorHandlers";
import { renderHtml } from "./html";

export async function serverRender(req: Request, res: Response, error?: IAppError): Promise<void> {
  const content = new Content();
  const nonce = res.locals.nonce;

  try {
    if (error && !(error instanceof FormHandlerError)) {
      throw error;
    }

    const routes = routeConfig;
    const router = configureRouter(routes);
    const route = await startRouter(req, router);

    if (route.name === routerConstants.UNKNOWN_ROUTE) {
      throw new NotFoundError();
    }

    const context = contextProvider.start({ user: req.session!.user });
    const auth = await context.runQuery(new GetAllProjectRolesForUser());

    const user: IClientUser = { roleInfo: auth.permissions, email: req.session!.user.email, csrf: req.csrfToken() };
    const clientConfig = getClientConfig(context);

    const initialState = setupInitialState(route, user, clientConfig);
    const middleware = setupMiddleware(router, false);
    const store = createStore(rootReducer, initialState, middleware);
    const modalRegister = new ModalRegister();

    const stores = createStores(
      () => store.getState(),
      action => process.nextTick(() => store.dispatch(action as AnyAction)),
    );

    const matched = matchRoute(route);
    const params = matched.getParams(route);

    if (matched.accessControl && !matched.accessControl(auth, params, clientConfig)) {
      throw new ForbiddenError();
    }

    await loadAllData(store, () => {
      // render the app to cause any other actions to go round the loop
      renderApp(router, nonce, store, stores, routes, modalRegister);
    });

    onComplete(store, stores, content, matched, params, error);

    res.send(renderApp(router, nonce, store, stores, routes, modalRegister));
  } catch (e) {
    // TODO capture stack trace for logs
    new Logger(req.session && req.session.user).error("Unable to render", e);

    const routeState: State = {
      name: e instanceof NotFoundError ? "errorNotFound" : "error",
      params: {},
      path: "",
    };

    const initalState = {
      router: { route: routeState },
    };

    const routes = routeConfig;
    const router = configureRouter(routes);
    const store = createStore(rootReducer, initalState);
    const stores = createStores(
      () => store.getState(),
      action => process.nextTick(() => store.dispatch(action as AnyAction)),
    );

    const matched = matchRoute(routeState);

    store.dispatch(Actions.setPageTitle(matched.getTitle({ params: routeState.params, stores, content })));

    res.status(getErrorStatus(e)).send(renderApp(router, nonce, store, stores, routes, new ModalRegister()));
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

const onComplete = (
  store: Store,
  stores: IStores,
  content: Content,
  matched: MatchedRoute,
  params: {},
  error?: FormHandlerError,
) => {
  // validation error occurred so add it into store as validation error
  if (error && error.code === ErrorCode.VALIDATION_ERROR) {
    store.dispatch(Actions.updateEditorAction(error.key, error.store, error.dto, error.error.results!));
  }

  // some other validation error occurred so add it into store as actual error
  // need to pair with the submit action to keep count in sync
  else if (error) {
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

  store.dispatch(Actions.setPageTitle(matched.getTitle({ params, stores, content })));
};

// wrap callback in Promise so we use await for consistency
function startRouter(req: Request, router: Router): Promise<State> {
  return new Promise((resolve, reject) => {
    router.start(req.originalUrl, (routeError, route) => {
      if (routeError || !route) {
        return reject(routeError);
      }

      return resolve(route);
    });
  });
}

function renderApp(
  router: Router,
  nonce: string,
  store: Store<RootState>,
  stores: IStores,
  routes: IRoutes,
  modalRegister: ModalRegister,
): string {
  const html = renderToString(
    <Provider store={store}>
      <RouterProvider router={router}>
        <StoresProvider value={stores}>
          <ModalProvider value={modalRegister}>
            <App store={store} routes={routes} />
          </ModalProvider>
        </StoresProvider>
      </RouterProvider>
    </Provider>,
  );

  const state = store.getState();

  return renderHtml(html, state.title.htmlTitle, state, nonce);
}

function getClientConfig(context: IContext): IClientConfig {
  return {
    ifsRoot: context.config.urls.ifsRoot,
    features: context.config.features,
    ssoEnabled: context.config.sso.enabled,
    options: context.config.options,
  };
}
