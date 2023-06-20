import { ErrorContainer } from "@ui/components/errors/ErrorContainer";
import { NotFoundError } from "@ui/components/errors/NotFoundError";
import { useStores } from "@ui/redux/storesProvider";
import { defineRoute } from "./containerBase";

/**
 * Error Route Container
 *
 * fetches error from stores and returns ErrorContainer component
 *
 * defaults to "Unknown Error"
 */
function ErrorRouteContainer() {
  const stores = useStores();
  const errorPayload = stores.errorDetails.errors() ?? { errorCode: 1, errorType: "UNKNOWN ERROR" };

  return <ErrorContainer {...errorPayload} />;
}

export const ErrorRoute = defineRoute({
  routeName: "error",
  routePath: "/error",
  container: ErrorRouteContainer,
  getParams: () => ({}),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.genericFallbackError.title),
});

export const ErrorNotFoundContainer = NotFoundError;

export const ErrorNotFoundRoute = defineRoute({
  routeName: "errorNotFound",
  routePath: "/error-not-found",
  container: ErrorNotFoundContainer,
  getParams: () => ({}),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.notFoundError.title),
});
