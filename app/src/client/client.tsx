import React from "react";
import { hydrate } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { RouterProvider } from "react-router5";
import { configureRouter } from "../ui/routing";
import { rootReducer, setupMiddleware } from "../ui/redux";
import { App } from "../ui/containers/app";
import { processDto } from "../shared/processResponse";

const serverState = processDto((window as any).__PRELOADED_STATE__);

console.log("initial state", serverState);
// const logger = (claimStore) => (next) => (action) => {
//   console.log("logging", action, next);
//   return next(action);
// }

const router     = configureRouter();
const middleware = setupMiddleware(router, true);
const store      = createStore(rootReducer, serverState, middleware);

(window as any).Store = store;

// window["router"] = router;
// window["claimStore"] = claimStore;

router.start(() => {
  hydrate((
    <Provider store={store}>
        <RouterProvider router={router}>
            <App />
        </RouterProvider>
    </Provider>),
    document.getElementById("root")
  );
});
