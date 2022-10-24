import { ErrorPayload } from "@shared/create-error-payload";
import { PageTitle } from "@ui/features/page-title";
import { useContent } from "@ui/hooks";
import { useStores } from "@ui/redux";

import { Page } from "../layout/page";
import { Section } from "../layout/section";
import { H2 } from "../typography";
import { ExternalLink } from "../renderers";
import { SimpleString } from "../renderers/simpleString";

export type GenericFallbackErrorProps = ErrorPayload["params"];

export const GenericFallbackError = ({ errorStack, errorMessage }: GenericFallbackErrorProps) => {
  const { getContent } = useContent();
  const { ssoEnabled } = useStores().config.getConfig();

  const errorMessageMessage = getContent(x => x.pages.genericFallbackError.message);
  const dashboardTextMessage = getContent(x => x.pages.genericFallbackError.dashboardText);

  const dashboardLink = "/projects/dashboard";
  const goToDashboardLink = <ExternalLink href={dashboardLink}>{dashboardTextMessage}</ExternalLink>;

  const internalError = !ssoEnabled && (errorStack || errorMessage);

  return (
    <Page qa="fallback-error" pageTitle={<PageTitle />}>
      <Section>
        <SimpleString>
          {errorMessageMessage} {goToDashboardLink}.
        </SimpleString>
      </Section>

      {internalError && (
        <Section>
          <H2>Internal Developer Error</H2>

          <pre style={{ whiteSpace: "pre-wrap" }}>{internalError}</pre>
        </Section>
      )}
    </Page>
  );
};
