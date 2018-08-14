import React from "react";
import { hydrate } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { RouterProvider } from "react-router5";
import { configureRouter } from "../routing";
import { rootReducer, setupMiddleware } from "../redux";
import { App } from "../containers";

const serverState = (window as any).__PRELOADED_STATE__;

// const logger = (store) => (next) => (action) => {
//   console.log("logging", action, next);
//   return next(action);
// }

const router     = configureRouter();
const middleware = setupMiddleware(router);
const store      = createStore(rootReducer, serverState, middleware);

// window["router"] = router;
// window["store"] = store;

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
