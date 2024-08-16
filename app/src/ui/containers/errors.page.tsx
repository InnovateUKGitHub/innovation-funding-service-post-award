import { ErrorContainer } from "@ui/components/organisms/ErrorContainer/ErrorContainer";
import { NotFoundError } from "@ui/containers/pages/error/NotFound/NotFoundError";
import { defineRoute } from "./containerBase";
import { useServerErrorContext } from "@ui/context/server-error";

/**
 * Error Route Container
 *
 * fetches error from stores and returns ErrorContainer component
 *
 * defaults to "Unknown Error"
 */
function ErrorRouteContainer() {
  const errorPayload = useServerErrorContext() ?? { errorCode: 1, errorType: "UNKNOWN ERROR" };

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
