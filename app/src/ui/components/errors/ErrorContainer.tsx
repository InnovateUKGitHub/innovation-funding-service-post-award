import { IAppError } from "@framework/types";
import { createErrorPayload } from "@shared/create-error-payload";
import { errorPages, internalErrorFallback, InternalErrorTypes } from "./error.config";

export interface ErrorContainerProps {
  errorType?: string | InternalErrorTypes;
  errorCode?: number;
}

/**
 * Error hoc which switches between UI based on errorType
 */
export const ErrorContainer = ({ errorType, ...props }: ErrorContainerProps) => {
  const predefinedError = errorType && errorPages[errorType as InternalErrorTypes];
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
