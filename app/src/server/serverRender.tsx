import React from "react";
import { Request, Response } from "express";
import { renderToString } from "react-dom/server";
import { createStore, Dispatch, Store } from "redux";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router5";
import { constants as routerConstants, Router, State } from "router5";

import { renderHtml } from "./html";
import { rootReducer, RootState, setupInitialState, setupMiddleware } from "../ui/redux";
import { configureRouter, matchRoute } from "../ui/routing";
import { App } from "../ui/containers/app";
import { AsyncThunk, handleEditorError, updateEditorAction } from "../ui/redux/actions/common";
import { IAppError } from "../types/IAppError";
import { errorHandlerRender } from "./errorHandlers";
import { ForbiddenError, FormHandlerError, NotFoundError } from "./features/common/appError";
import contextProvider from "./features/common/contextProvider";
import { GetAllProjectRolesForUser } from "./features/projects/getAllProjectRolesForUser";
import { Authorisation, IClientUser } from "../types";
import { Logger } from "./features/common/logger";

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
    const user: IClientUser = { ...req.session!.user, roleInfo };

    const initialState = setupInitialState(route, user);
    const middleware = setupMiddleware(router, false);
    const store = createStore(rootReducer, initialState, middleware);
    const matched = matchRoute(route);
    const params = matched && matched.getParams && matched.getParams(route) || {};

    if (matched.accessControl && !matched.accessControl(new Authorisation(user.roleInfo), params)) {
      throw new ForbiddenError();
    }

    const actions = matched && matched.getLoadDataActions && matched.getLoadDataActions(params) || [];

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
    res.send(renderApp(router, store));
  }
  catch (e) {

    new Logger(req.session && req.session.user).error("Unable to render", e);

    const errorName = e instanceof NotFoundError ? "errorNotFound" : "error";
    const router = configureRouter();
    const store = createStore(rootReducer, { router: { route: { name: errorName } } });

    errorHandlerRender(res, renderApp(router, store), e);
  }
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

function renderApp(router: Router, store: Store): string {
  const html = renderToString(
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  );
  return renderHtml(html, store.getState());
}
