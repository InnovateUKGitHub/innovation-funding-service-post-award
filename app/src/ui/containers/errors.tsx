import { ErrorContainer, ErrorContainerProps, NotFoundError } from "../components/errors";
import { BaseProps, defineRoute } from "./containerBase";

function ErrorRouteContainer({ route }: BaseProps) {
  const errorProps = route.params as ErrorContainerProps;

  return <ErrorContainer {...errorProps} />;
}

export const ErrorRoute = defineRoute<{}>({
  routeName: "error",
  routePath: "/error",
  container: ErrorRouteContainer,
  getParams: () => ({}),
  getTitle: ({ content }) => content.errors.genericFallback.title(),
});

export const ErrorNotFoundRoute = defineRoute<{}>({
  routeName: "errorNotFound",
  routePath: "/error-not-found",
  container: NotFoundError,
  getParams: () => ({}),
  getTitle: ({ content }) => content.errors.notfound.title(),
});
