import * as React from "react";
import { LoadingStatus, Pending } from "../../shared/pending";
import { ErrorSummary } from "./errorSummary";
import { ErrorCode, IAppError } from "@framework/types/IAppError";
import { StandardErrorPage } from "./standardErrorPage";
import { NotFoundErrorPage } from "./notFoundErrorPage";
import { SimpleString } from "./renderers";
import { useContent } from "@ui/redux/contentProvider";

type LoadingError = IAppError | null;

export interface LoadingProps<T> {
  pending: Pending<T>;
  render: (data: T, loading?: boolean) => React.ReactNode;
  renderError?: (error?: LoadingError) => React.ReactNode;
  renderLoading?: () => React.ReactNode;
}

export function Loader<T>(props: LoadingProps<T>) {
  const { getContent } = useContent();

  const renderDone = (data: T, loading: boolean) => props.render(data, loading);

  const renderLoading = (): React.ReactNode => {
    const loading = getContent((x) => x.components.loading.message);

    return !!props.renderLoading ? (
      props.renderLoading()
    ) : (
      <SimpleString className="govuk-!-padding-top-5 govuk-!-padding-bottom-5" qa="loading-message">
        {loading}
      </SimpleString>
    );
  };

  const renderError = (error?: LoadingError): React.ReactNode => {
    if (props.renderError) return props.renderError(error);

    return error ? <ErrorSummary code={error.code} /> : null;
  };

  let result;

  switch (props.pending.state) {
    // don't render anything as the request hasn't been made
    case LoadingStatus.Preload:
      return null;
    // request completed, call the given render function
    case LoadingStatus.Done:
    case LoadingStatus.Updated:
      result = renderDone(props.pending.data!, false);
      break;
    // request is loading or data marked as stale
    case LoadingStatus.Stale:
    case LoadingStatus.Loading:
      // if we have data render it, otherwise call the loading function
      if (props.pending.data) {
        result = renderDone(props.pending.data, true);
      } else {
        result = renderLoading();
      }
      break;
    // request failed for some reason, call the error function to handle it
    case LoadingStatus.Failed:
      result = renderError(props.pending.error);
      break;
    // shouldn't ever be in a status not handled above
    default:
      throw new Error("Broken pending data, status missing.");
  }

  if (typeof result === "string") {
    return <span>{result}</span>;
  } else if (Array.isArray(result)) {
    return <div>{result}</div>;
  } else {
    return result as JSX.Element;
  }
}

export function PageLoader<T>(props: LoadingProps<T>) {
  return (
    <Loader
      {...props}
      renderError={(error) =>
        error && error.code === ErrorCode.REQUEST_ERROR ? <NotFoundErrorPage /> : <StandardErrorPage />
      }
    />
  );
}
