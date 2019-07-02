import React from "react";
import { Request, Response } from "express";
import { renderToString } from "react-dom/server";
import { AnyAction, createStore, Dispatch, Store } from "redux";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router5";
import { constants as routerConstants, Router, State } from "router5";

import { errorHandlerRender } from "./errorHandlers";
import { rootReducer, RootState, setupInitialState, setupMiddleware } from "@ui/redux";
import { configureRouter, MatchedRoute, matchRoute } from "@ui/routing";
import { App } from "@ui/containers/app";
import { AsyncThunk, handleEditorError, udpatePageTitle, updateEditorAction } from "@ui/redux/actions";
import { renderHtml } from "./html";
import { ForbiddenError, FormHandlerError, NotFoundError } from "./features/common/appError";
import contextProvider from "./features/common/contextProvider";
import { GetAllProjectRolesForUser } from "./features/projects/getAllProjectRolesForUser";
import { Logger } from "./features/common/logger";
import { Authorisation, IAppError, IClientUser } from "@framework/types";
import { IClientConfig } from "@ui/redux/reducers/configReducer";

async function loadData(dispatch: Dispatch, getState: () => RootState, dataCalls: AsyncThunk<any>[]): Promise<void> {
  const allPromises = dataCalls.map(action => action(dispatch, getState, null));
  const loadingCount = getState().loadStatus;

  // nothing is loading so safe to return and then render
  if (loadingCount === 0) {
    return Promise.resolve();
  }
  // something is loading so wait for that to finish and then try again
  return Promise.all(allPromises).then(() => loadData(dispatch, getState, dataCalls));
}

export async function serverRender(req: Request, res: Response, error?: IAppError): Promise<void> {
  try {
    if (error && !(error instanceof FormHandlerError)) {
      throw error;
    }

    const router = configureRouter();
    const route = await startRouter(req, router);

    if (route && route.name === routerConstants.UNKNOWN_ROUTE) {
      throw new NotFoundError();
    }

    const context = contextProvider.start({ user: req.session!.user });
    const roleInfo = await context.runQuery(new GetAllProjectRolesForUser()).then(x => x.permissions);
    const auth = new Authorisation(roleInfo);
    const user: IClientUser = { ...req.session!.user, roleInfo };
    const clientConfig: IClientConfig = {
      ifsRoot: context.config.urls.ifsRoot,
      features: context.config.features,
      standardOverheadRate: context.config.standardOverheadRate,
      ssoEnabled: context.config.sso.enabled,
      maxFileSize: context.config.maxFileSize
    };

    const initialState = setupInitialState(route, user, clientConfig);
    const middleware = setupMiddleware(router, false);
    const store = createStore(rootReducer, initialState, middleware);
    const matched = matchRoute(route);
    const params = matched && matched.getParams && matched.getParams(route) || {};

    if (matched.accessControl && !matched.accessControl(auth, params, clientConfig)) {
      throw new ForbiddenError();
    }

    const actions = matched && matched.getLoadDataActions && matched.getLoadDataActions(params, auth) || [];

    if (error) {
      actions.push((dispatch) => {
        dispatch(updateEditorAction(error.key, error.store, error.dto, error.result));
        return Promise.resolve();
      });
      actions.push((dispatch) => {
        dispatch(handleEditorError({
          id: error.key,
          dto: error.dto,
          validation: error.result,
          error: error.error,
          store: error.store,
          scrollToTop: false
        }));
        return Promise.resolve();
      });
    }

    await loadData(store.dispatch, store.getState, actions);
    await dispatchPageTitleAction(matched, params, store);
    res.send(renderApp(router, store));
  }
  catch (e) {

    new Logger(req.session && req.session.user).error("Unable to render", e);

    const routeState: State = {
      name: e instanceof NotFoundError ? "errorNotFound" : "error",
      params: {},
      path: ""
    };

    const router = configureRouter();
    const store = createStore(rootReducer, { router: { route: routeState } });
    const matched = matchRoute(routeState);

    await dispatchPageTitleAction(matched, {}, store);
    errorHandlerRender(res, renderApp(router, store), e);
  }
}

function dispatchPageTitleAction(route: MatchedRoute, params: {}, store: Store<RootState, AnyAction>) {
  const action = udpatePageTitle(route, params);
  return action(store.dispatch, store.getState, null);
}

// wrap callback in Promise so we use await for consistency
function startRouter(req: Request, router: Router): Promise<State> {
  return new Promise((resolve, reject) => {
    router.start(req.originalUrl, (routeError, route) => {
      if (routeError) {
        return reject(routeError);
      }

      return resolve(route);
    });
  });
}

function renderApp(router: Router, store: Store<RootState>): string {
  const html = renderToString(
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  );

  const state = store.getState();

  return renderHtml(html, state.title.htmlTitle, state);
}
