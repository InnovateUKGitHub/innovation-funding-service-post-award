import { useStores } from "@ui/redux";
import { ErrorContainer, NotFoundError } from "../components/errors";
import { defineRoute } from "./containerBase";

function ErrorRouteContainer() {
  const stores = useStores();
  const errorPayload = stores.errorDetails.errors() ?? { errorCode: 418, errorType: "UNKNOWN ERROR" };

  return <ErrorContainer {...errorPayload} />;
}

export const ErrorRoute = defineRoute<{}>({
  routeName: "error",
  routePath: "/error",
  container: ErrorRouteContainer,
  getParams: () => ({}),
  getTitle: ({ content }) => content.errors.genericFallback.title(),
});

export const ErrorNotFoundContainer = NotFoundError;

export const ErrorNotFoundRoute = defineRoute<{}>({
  routeName: "errorNotFound",
  routePath: "/error-not-found",
  container: ErrorNotFoundContainer,
  getParams: () => ({}),
  getTitle: ({ content }) => content.errors.notfound.title(),
});
