import { ErrorPayload } from "@shared/create-error-payload";
import { PageTitle } from "@ui/features/page-title";

import { Page } from "../../../../components/bjss/Page/page";
import { Section } from "../../../../components/atomicDesign/molecules/Section/section";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { Content } from "../../../../components/atomicDesign/molecules/Content/content";
import { ExternalLink } from "../../../../components/atomicDesign/atoms/ExternalLink/externalLink";
import { H2 } from "../../../../components/atomicDesign/atoms/Heading/Heading.variants";
import { useClientConfig } from "@ui/components/providers/ClientConfigProvider";

export type GenericFallbackErrorProps = ErrorPayload["params"];

export const GenericFallbackError = ({ errorStack, errorMessage }: GenericFallbackErrorProps) => {
  const config = useClientConfig();

  const goToDashboardLink = <ExternalLink href="/projects/dashboard"> </ExternalLink>;

  const internalError = !config.ssoEnabled && (errorStack || errorMessage);

  return (
    <Page isActive qa="fallback-error" pageTitle={<PageTitle />}>
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
