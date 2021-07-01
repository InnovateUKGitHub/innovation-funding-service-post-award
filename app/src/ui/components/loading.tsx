import React, { Fragment } from "react";
import { IAppError } from "@framework/types/IAppError";
import { useContent } from "@ui/hooks";
import { ErrorCode, LoadingStatus } from "@framework/constants";
import { Pending } from "../../shared/pending";
import { ErrorSummary } from "./errorSummary";
import { ErrorContainer, ErrorContainerProps } from "./errors";
import { SimpleString } from "./renderers";

export interface LoadingProps<T> {
  pending: Pending<T>;
  // TODO: Investigate a stricter type which has to return an element / null
  render: (data: T, loading?: boolean) => React.ReactNode;
  renderError?: (error?: IAppError) => JSX.Element;
  renderLoading?: () => JSX.Element;
}

export function Loader<T>({ pending, render, renderError, renderLoading }: LoadingProps<T>) {
  const pendingWaiting = () => {
    const loadingElement = (renderLoading && renderLoading()) || <LoadingMessage />;

    return pending.data ? render(pending.data, true) : loadingElement;
  };

  const pendingError = (error?: IAppError) => {
    const hasRenderError = renderError && renderError(error);

    return hasRenderError || (error && <ErrorSummary {...error} />);
  };

  let pendingElement: React.ReactNode;

  switch (pending.state) {
    case LoadingStatus.Failed:
      pendingElement = pendingError(pending.error);
      break;

    case LoadingStatus.Stale:
    case LoadingStatus.Loading:
      pendingElement = pendingWaiting();
      break;

    case LoadingStatus.Done:
    case LoadingStatus.Updated:
      pendingElement = render(pending.data!, false);
      break;

    case LoadingStatus.Preload:
    default:
      pendingElement = null;
  }

  // TODO: Update this to .includes during tsc upgrade
  const isTextElement = ["string", "number"].indexOf(typeof pendingElement) !== -1;
  const LoadingElement = isTextElement ? "span" : Fragment;

  return <LoadingElement>{pendingElement}</LoadingElement>;
}

function LoadingMessage() {
  const { getContent } = useContent();
  const loadingMessage = getContent(x => x.components.loading.message);

  return (
    <SimpleString className="govuk-!-padding-top-5 govuk-!-padding-bottom-5" qa="loading-message">
      {loadingMessage}
    </SimpleString>
  );
}

export function PageLoader<T>(props: LoadingProps<T>) {
  const handleError: LoadingProps<T>["renderError"] = e => {
    const hasRequestError = e?.code === ErrorCode.REQUEST_ERROR;

    const errorProps: ErrorContainerProps = {
      errorCode: e?.code,
      errorType: hasRequestError ? "NOT_FOUND" : e?.message,
    };

    return <ErrorContainer {...errorProps} />;
  };

  return <Loader renderError={handleError} {...props} />;
}
