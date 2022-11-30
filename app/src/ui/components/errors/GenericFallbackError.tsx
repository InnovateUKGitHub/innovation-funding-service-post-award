import { ErrorPayload } from "@shared/create-error-payload";
import { PageTitle } from "@ui/features/page-title";

import { Page } from "../layout/page";
import { Section } from "../layout/section";
import { H2 } from "../typography";
import { ExternalLink } from "../renderers";
import { SimpleString } from "../renderers/simpleString";
import { Content } from "../content";
import { useClientOptionsQuery } from "@gql/hooks/useSiteOptionsQuery";

export type GenericFallbackErrorProps = ErrorPayload["params"];

export const GenericFallbackError = ({ errorStack, errorMessage }: GenericFallbackErrorProps) => {
  const { data } = useClientOptionsQuery();

  const goToDashboardLink = <ExternalLink href="/projects/dashboard"> </ExternalLink>;

  const internalError = !data.clientConfig.ssoEnabled && (errorStack || errorMessage);

  return (
    <Page qa="fallback-error" pageTitle={<PageTitle />}>
      <Section>
        <SimpleString qa="message">
          <Content value={x => x.pages.genericFallbackError.message} components={[goToDashboardLink]} />
        </SimpleString>
      </Section>

      {internalError && (
        <Section>
          <H2>
            <Content value={x => x.pages.genericFallbackError.developerHeading} />
          </H2>

          <pre style={{ whiteSpace: "pre-wrap" }}>{internalError}</pre>
        </Section>
      )}
    </Page>
  );
};
