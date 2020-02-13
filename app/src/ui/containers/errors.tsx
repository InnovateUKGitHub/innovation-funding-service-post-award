import React from "react";
import { BaseProps, defineRoute } from "./containerBase";
import { StandardErrorPage } from "../components/standardErrorPage";
import { NotFoundErrorPage } from "../components/notFoundErrorPage";

interface Props {
  errorType: "standard" | "notFound";
}

const ErrorContainer = (props: Props & BaseProps) => (
  props.errorType === "notFound" ? <NotFoundErrorPage /> : <StandardErrorPage />
);

export const ErrorRoute = defineRoute<{}>({
  routeName: "error",
  routePath: "/error",
  container: (params) => <ErrorContainer errorType="standard" {...params}/>,
  getParams: () => ({}),
  getTitle: ({content}) => content.errors.unexpected.title()
});

export const ErrorNotFoundRoute = defineRoute<{}>({
  routeName: "errorNotFound",
  routePath: "/error-not-found",
  container: (params) => <ErrorContainer errorType="notFound" {...params}/>,
  getParams: () => ({}),
  getTitle: ({content}) => content.errors.notfound.title()
});
