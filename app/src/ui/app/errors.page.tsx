import { ErrorContainer } from "@ui/components/organisms/ErrorContainer/ErrorContainer";
import { NotFoundError } from "@ui/pages/error/NotFound/NotFoundError";
import { defineRoute } from "../app/containerBase";
import { useServerErrorContext } from "@ui/context/server-error";

const ErrorRouteContainer = () => {
  const error = useServerErrorContext();
  return <ErrorContainer error={error} />;
};

export const ErrorRoute = defineRoute({
  routeName: "error",
  routePath: "/error",
  container: ErrorRouteContainer,
  getParams: () => ({}),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.genericFallbackError.title),
});

export const ErrorNotFoundRoute = defineRoute({
  routeName: "errorNotFound",
  routePath: "/error-not-found",
  container: NotFoundError,
  getParams: () => ({}),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.notFoundError.title),
});
