import { ContentProvider } from "@ui/context/contentProvider";
import { PageTitleProvider } from "@ui/features/page-title";
import { useInitContent } from "@ui/features/use-initial-content";
import { FallbackProps } from "react-error-boundary";
import { FullHeight } from "../../atoms/FullHeight/FullHeight";
import { GovWidthContainer } from "../../atoms/GovWidthContainer/GovWidthContainer";
import { Header } from "../Header/header";
import { useClientConfig } from "@ui/context/ClientConfigProvider";
import { ErrorCode } from "@framework/constants/enums";
import { NotFoundError } from "@ui/containers/pages/error/NotFound/NotFoundError";
import { UnauthenticatedError } from "@ui/containers/pages/error/Unauthenticated/UnauthenticatedError";
import { GenericFallbackError } from "@ui/containers/pages/error/Generic/GenericFallbackError";
import { ClientErrorResponse, getErrorResponse } from "@server/errorHandlers";

export const ErrorContainer = ({ error }: { error?: ClientErrorResponse | null }) => {
  switch (error?.code) {
    case ErrorCode.NOT_FOUND:
      return <NotFoundError />;
    case ErrorCode.UNAUTHENTICATED_ERROR:
      return <UnauthenticatedError />;
    default:
      return <GenericFallbackError error={error} />;
  }
};

/**
 * Pull required props from ErrorBoundary
 * Requires Providers and page layout because fallback lies outside main react component tree
 */
export function ErrorBoundaryFallback({ error }: FallbackProps) {
  const errorPayload = getErrorResponse(error, null);
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
              <ErrorContainer error={errorPayload} />
            </GovWidthContainer>
          </FullHeight.Content>
        </FullHeight.Container>
      </PageTitleProvider>
    </ContentProvider>
  );
}
