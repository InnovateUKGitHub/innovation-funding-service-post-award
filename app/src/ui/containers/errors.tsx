import React from "react";
import { BaseProps, defineRoute } from "./containerBase";
import { StandardErrorPage } from "../components/standardErrorPage";
import { NotFoundErrorPage } from "../components/notFoundErrorPage";

interface Params {
  errorType: "standard" | "notFound";
}

const ErrorContainer = (props: Params & BaseProps) => (
  props.errorType === "notFound" ? <NotFoundErrorPage /> : <StandardErrorPage />
);

export const ErrorRoute = defineRoute<{}>({
  routeName: "error",
  routePath: "/error",
  container: (params) => <ErrorContainer errorType="standard" {...params}/>,
  getParams: () => ({}),
  getTitle: () => ({
    htmlTitle: "Error",
    displayTitle: "Something has gone wrong at our end"
  })
});

export const ErrorNotFoundRoute = defineRoute<{}>({
  routeName: "errorNotFound",
  routePath: "/error-not-found",
  container: (params) => <ErrorContainer errorType="notFound" {...params}/>,
  getParams: () => ({}),
  getTitle: () => ({
    htmlTitle: "Page not found",
    displayTitle: "Page not found"
  })
});
