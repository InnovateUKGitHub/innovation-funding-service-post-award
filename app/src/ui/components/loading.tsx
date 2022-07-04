import React, { Fragment } from "react";

import { AppError } from "@shared/appError";
import { createErrorPayload } from "@shared/create-error-payload";
import { Pending } from "@shared/pending";
import { IAppError } from "@framework/types/IAppError";
import { ErrorCode, LoadingStatus } from "@framework/constants";

import { useContent } from "@ui/hooks";
import { ErrorSummary } from "@ui/components/errorSummary";
import { ErrorContainer } from "@ui/components/errors";
import { SimpleString } from "@ui/components/renderers";

export interface LoadingProps<T> {
  pending: Pending<T>;
  // TODO: Investigate a stricter type which has to return an element / null
  render: (data: T, loading?: boolean) => React.ReactNode;
  renderError?: (error: IAppError) => JSX.Element;
  renderLoading?: () => JSX.Element;
}

export function Loader<T>({ pending, render, renderError, renderLoading }: LoadingProps<T>) {
  const fallbackPendingError = new AppError(ErrorCode.UNKNOWN_ERROR, "An error has occurred while fetching data.");

  const handleWaiting = () => {
    const loadingUi = renderLoading?.() || <LoadingMessage />;

    return pending.data ? render(pending.data, true) : loadingUi;
  };

  const handleError = (error: IAppError = fallbackPendingError) => {
    return renderError?.(error) || <ErrorSummary {...error} />;
  };

  let pendingElement: React.ReactNode;

  switch (pending.state) {
    case LoadingStatus.Failed:
      pendingElement = handleError(pending.error);
      break;

    case LoadingStatus.Stale:
    case LoadingStatus.Loading:
      pendingElement = handleWaiting();
      break;

    case LoadingStatus.Done:
    case LoadingStatus.Updated:
      pendingElement = render(pending.data!, false);
      break;

    case LoadingStatus.Preload:
    default:
      pendingElement = null;
  }

  const isTextElement = ["string", "number"].includes(typeof pendingElement);
  const LoadingElement = isTextElement ? "span" : Fragment;

  return <LoadingElement>{pendingElement}</LoadingElement>;
}

export function LoadingMessage() {
  const { getContent } = useContent();
  const loadingMessage = getContent(x => x.components.loading.message);

  return (
    <SimpleString className="govuk-!-padding-top-5 govuk-!-padding-bottom-5" qa="loading-message">
      {loadingMessage}
    </SimpleString>
  );
}

export function PageLoader<T>(props: LoadingProps<T>) {
  const handleError: LoadingProps<T>["renderError"] = renderError => {
    const hasRequestError = renderError.code === ErrorCode.REQUEST_ERROR;

    if (hasRequestError) {
      renderError.message = "NOT_FOUND";
    }

    const error = createErrorPayload(renderError, hasRequestError).params;

    return <ErrorContainer from="PageLoader" {...error} />;
  };

  return <Loader renderError={handleError} {...props} />;
}
