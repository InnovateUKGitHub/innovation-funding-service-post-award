import { ErrorPayload, createErrorPayload } from "@shared/create-error-payload";
import { ContentProvider } from "@ui/context/contentProvider";
import { PageTitleProvider } from "@ui/features/page-title";
import { useInitContent } from "@ui/features/use-initial-content";
import { errorPages, internalErrorFallback, InternalErrorTypes } from "./utils/error.config";
import { FallbackProps } from "react-error-boundary";
import { IAppError } from "@framework/types/IAppError";
import { FullHeight } from "../../atoms/FullHeight/FullHeight";
import { GovWidthContainer } from "../../atoms/GovWidthContainer/GovWidthContainer";
import { Header } from "../Header/header";
import { useClientConfig } from "@ui/context/ClientConfigProvider";

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
 * Requires Providers and page layout because fallback lies outside main react component tree
 */
export function ErrorBoundaryFallback({ error }: FallbackProps) {
  const errorPayload = createErrorPayload(error as unknown as IAppError, false);
  const content = useInitContent();
  const config = useClientConfig();

  return (
    <ContentProvider value={content}>
      <PageTitleProvider title="Sorry, there is a problem with the service">
        <FullHeight.Container>
          <a href="#main-content" className="govuk-skip-link">
            Skip to main content
          </a>
          <Header headingLink={`${config.ifsRoot}/competition/search`} />
          <FullHeight.Content>
            <GovWidthContainer>
              <ErrorContainer {...errorPayload.params} />
            </GovWidthContainer>
          </FullHeight.Content>
        </FullHeight.Container>
      </PageTitleProvider>
    </ContentProvider>
  );
}
