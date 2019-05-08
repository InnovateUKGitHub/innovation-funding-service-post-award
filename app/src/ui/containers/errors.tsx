import React from "react";
import { ContainerBase, ReduxContainer } from "./containerBase";
import { StandardErrorPage } from "../components/standardErrorPage";
import { NotFoundErrorPage } from "../components/notFoundErrorPage";

interface Data {
  errorType: "standard" | "notFound";
}

class Component extends ContainerBase<{}, Data> {
  render() {
    return this.props.errorType === "notFound" ? <NotFoundErrorPage /> : <StandardErrorPage />;
  }
}

const containerDefinition = ReduxContainer.for<{}, Data, {}>(Component);

const Error = containerDefinition.connect({
  withData: () => ({ errorType: "standard" }),
  withCallbacks: () => ({})
});

export const ErrorRoute = containerDefinition.route({
  routeName: "error",
  routePath: "/error",
  getParams: () => ({}),
  getLoadDataActions: () => [],
  container: Error,
  getTitle: () => ({
    htmlTitle: "Error",
    displayTitle: "Something has gone wrong at our end"
  })
});

const ErrorNotFound = containerDefinition.connect({
  withData: () => ({ errorType: "notFound" }),
  withCallbacks: () => ({})
});

export const ErrorNotFoundRoute = containerDefinition.route({
  routeName: "errorNotFound",
  routePath: "/error-not-found",
  getParams: () => ({}),
  getLoadDataActions: () => [],
  container: ErrorNotFound,
  getTitle: () => ({
    htmlTitle: "Page not found",
    displayTitle: "Page not found"
  })
});
