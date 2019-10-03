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

export const ErrorRoute = defineRoute<Params>({
  routeName: "error",
  routePath: "/error",
  container: ErrorContainer,
  getParams: () => ({ errorType: "standard" }),
  getTitle: () => ({
    htmlTitle: "Error",
    displayTitle: "Something has gone wrong at our end"
  })
});

export const ErrorNotFoundRoute = defineRoute<Params>({
  routeName: "errorNotFound",
  routePath: "/error-not-found",
  getParams: () => ({errorType: "notFound"}),
  container: ErrorContainer,
  getTitle: () => ({
    htmlTitle: "Page not found",
    displayTitle: "Page not found"
  })
});
