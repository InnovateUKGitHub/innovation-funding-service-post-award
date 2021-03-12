import { ErrorContainer, ErrorContainerProps, NotFoundError } from "../components/errors";
import { BaseProps, defineRoute } from "./containerBase";

function ErrorRouteContainer(props: BaseProps) {
  const errorProps: ErrorContainerProps = {
    errorCode: props.route.params.errorProps,
    errorType: props.route.params.errorType,
  };

  return <ErrorContainer {...props} {...errorProps} />;
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
