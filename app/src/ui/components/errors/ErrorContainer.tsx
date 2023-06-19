import { ErrorPayload, createErrorPayload } from "@shared/create-error-payload";
import { ContentProvider } from "@ui/redux/contentProvider";
import { PageTitleProvider } from "@ui/features/page-title";
import { useInitContent } from "@ui/features/use-initial-content";
import { errorPages, internalErrorFallback, InternalErrorTypes } from "./error.config";
import { FallbackProps } from "react-error-boundary";
import { IAppError } from "@framework/types/IAppError";
import { useStores } from "@ui/redux/storesProvider";
import { FullHeight } from "../FullHeight";
import { GovWidthContainer } from "../layout/GovWidthContainer";
import { Header } from "../layout/header";

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
  const stores = useStores();
  const config = stores.config.getConfig();

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
