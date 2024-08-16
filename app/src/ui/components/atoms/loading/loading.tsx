import { ReactNode, Suspense } from "react";
import { createErrorPayload } from "@shared/create-error-payload";
import { useContent } from "@ui/hooks/content.hook";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { useQuery } from "@framework/api-helpers/useQuery/useQuery";
import { OperationType } from "relay-runtime";
import { ErrorCode } from "@framework/constants/enums";
import { ErrorContainer } from "../../organisms/ErrorContainer/ErrorContainer";
import { GovWidthContainer } from "../GovWidthContainer/GovWidthContainer";

export const LoadingMessage = () => {
  const { getContent } = useContent();
  const loadingMessage = getContent(x => x.components.loading.message);

  return (
    <SimpleString className="govuk-!-padding-top-5 govuk-!-padding-bottom-5" qa="loading-message">
      {loadingMessage}
    </SimpleString>
  );
};

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
