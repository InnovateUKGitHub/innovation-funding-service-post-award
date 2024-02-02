import React, { Fragment, ReactNode, Suspense } from "react";
import { AppError } from "@shared/appError";
import { createErrorPayload } from "@shared/create-error-payload";
import { Pending } from "@shared/pending";
import { IAppError } from "@framework/types/IAppError";
import { useContent } from "@ui/hooks/content.hook";
import { ErrorSummary } from "@ui/components/atomicDesign/molecules/ErrorSummary/ErrorSummary";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { useQuery } from "@framework/api-helpers/useQuery/useQuery";
import { OperationType } from "relay-runtime";
import { ErrorCode, LoadingStatus } from "@framework/constants/enums";
import { ErrorContainer } from "../atomicDesign/organisms/ErrorContainer/ErrorContainer";
import { GovWidthContainer } from "../atomicDesign/atoms/GovWidthContainer/GovWidthContainer";

export interface LoadingProps<T> {
  pending: Pending<T>;
  page?: boolean;

  // TODO: Investigate a stricter type which has to return an element / null
  render: (data: T, loading?: boolean) => React.ReactNode;
  renderError?: (error: IAppError) => JSX.Element;
  renderLoading?: () => JSX.Element;
}

/**
 * Loader component handles the loading status and changes to the UI for different loading states
 */
export function Loader<T>({ pending, render, renderError, renderLoading, page = false }: LoadingProps<T>) {
  const fallbackPendingError = new AppError(ErrorCode.UNKNOWN_ERROR, "An error has occurred while fetching data.");

  const handleWaiting = () => {
    const loadingUi = renderLoading?.() || <LoadingMessage />;

    return pending.data ? render(pending.data, true) : loadingUi;
  };

  const handleError = (error: IAppError = fallbackPendingError) => {
    return renderError?.(error) || <ErrorSummary error={error} />;
  };

  let pendingElement: React.ReactNode;

  switch (pending.state) {
    case LoadingStatus.Failed:
      pendingElement = handleError(pending.error);
      if (page) pendingElement = <GovWidthContainer>{pendingElement}</GovWidthContainer>;
      break;

    case LoadingStatus.Stale:
    case LoadingStatus.Loading:
      pendingElement = handleWaiting();
      if (page) pendingElement = <GovWidthContainer>{pendingElement}</GovWidthContainer>;
      break;

    case LoadingStatus.Done:
    case LoadingStatus.Updated:
      pendingElement = render(pending.data as T, false);
      break;

    case LoadingStatus.Preload:
    default:
      pendingElement = null;
  }

  const isTextElement = ["string", "number"].includes(typeof pendingElement);
  const LoadingElement = isTextElement ? "span" : Fragment;

  return <LoadingElement>{pendingElement}</LoadingElement>;
}

export const LoadingMessage = () => {
  const { getContent } = useContent();
  const loadingMessage = getContent(x => x.components.loading.message);

  return (
    <SimpleString className="govuk-!-padding-top-5 govuk-!-padding-bottom-5" qa="loading-message">
      {loadingMessage}
    </SimpleString>
  );
};

/**
 * Displays a loading screen as a page-sized form factor.
 * - shows the content of `render` if the `pending` succeeds.
 * - shows an error if the `pending` errors.
 * - shows a loading page while the `pending` is loading.
 */
export function PageLoader<T>(props: LoadingProps<T>) {
  const handleError: LoadingProps<T>["renderError"] = renderError => {
    const hasRequestError = renderError.code === ErrorCode.REQUEST_ERROR;

    if (hasRequestError) {
      renderError.message = "NOT_FOUND";
    }

    const error = createErrorPayload(renderError, hasRequestError).params;

    return <ErrorContainer from="PageLoader" {...error} />;
  };

  return <Loader page={true} renderError={handleError} {...props} />;
}

const SuspensePageLoader = ({ children }: { children: ReactNode }) => (
  <Suspense
    fallback={
      <GovWidthContainer>
        <LoadingMessage />
      </GovWidthContainer>
    }
  >
    {children}
  </Suspense>
);

type graphqlLoadingAndErrorType<T extends OperationType> = ReturnType<typeof useQuery<T>>;

const isGraphQLLoading = <T extends OperationType>(
  data: graphqlLoadingAndErrorType<T>["data"],
  error: graphqlLoadingAndErrorType<T>["error"],
  isLoading: graphqlLoadingAndErrorType<T>["isLoading"],
): data is null | undefined => {
  if (isLoading || error) return true;
  return false;
};

const GraphQLLoader = <T extends OperationType>(props: Pick<graphqlLoadingAndErrorType<T>, "error" | "isLoading">) => {
  if (props.isLoading) {
    return <LoadingMessage />;
  }

  if (props.error) {
    const error = createErrorPayload(
      {
        code: ErrorCode.UNKNOWN_ERROR,
        message: props.error.message,
        details: [],
      },
      true,
    ).params;

    return <ErrorContainer from="PageLoader" {...error} />;
  }

  return null;
};

export { SuspensePageLoader, isGraphQLLoading, GraphQLLoader };
