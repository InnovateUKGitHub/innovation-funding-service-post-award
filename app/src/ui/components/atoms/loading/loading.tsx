import { ReactNode, Suspense } from "react";
import { useContent } from "@ui/hooks/content.hook";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { useQuery } from "@framework/api-helpers/useQuery/useQuery";
import { OperationType } from "relay-runtime";
import { ErrorContainer } from "../../organisms/ErrorContainer/ErrorContainer";
import { GovWidthContainer } from "../GovWidthContainer/GovWidthContainer";
import { getErrorResponse } from "@server/errorHandlers";

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

const GraphQLLoader = <T extends OperationType>({
  isLoading,
  error,
}: Pick<graphqlLoadingAndErrorType<T>, "error" | "isLoading">) => {
  if (isLoading) return <LoadingMessage />;
  if (error) return <ErrorContainer error={getErrorResponse(error, "// TODO: Add a trace ID thing here")} />;

  return null;
};

export { SuspensePageLoader, isGraphQLLoading, GraphQLLoader };
