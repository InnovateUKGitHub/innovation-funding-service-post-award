import { IAppError } from "@framework/types";
import { ErrorPayload, createErrorPayload } from "@shared/create-error-payload";

import { errorPages, internalErrorFallback, InternalErrorTypes } from "./error.config";

export type ErrorContainerProps = ErrorPayload["params"] & { from?: string };

/**
 * Error hoc which switches between UI based on errorType
 */
export const ErrorContainer = (props: ErrorContainerProps) => {
  const predefinedError = errorPages[props.errorType as InternalErrorTypes];

  const ErrorUI = predefinedError || internalErrorFallback;

  return <ErrorUI {...props} />;
};

/**
 * Pull required props from ErrorBoundary
 */
export function ErrorBoundaryFallback({ error }: { error: IAppError }) {
  const errorPayload = createErrorPayload(error, false);

  return <ErrorContainer {...errorPayload.params} />;
}
