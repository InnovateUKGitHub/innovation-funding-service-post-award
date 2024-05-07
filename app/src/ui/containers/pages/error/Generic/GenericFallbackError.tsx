import { ErrorPayload } from "@shared/create-error-payload";
import { PageTitle } from "@ui/features/page-title";

import { Page } from "../../../../components/bjss/Page/page";
import { Section } from "../../../../components/atomicDesign/molecules/Section/section";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { Content } from "../../../../components/atomicDesign/molecules/Content/content";
import { ExternalLink } from "../../../../components/atomicDesign/atoms/ExternalLink/externalLink";
import { H2 } from "../../../../components/atomicDesign/atoms/Heading/Heading.variants";
import { useClientConfig } from "@ui/components/providers/ClientConfigProvider";
import { useRoutes } from "@ui/redux/routesProvider";
import { ErrorDetails } from "@ui/components/atomicDesign/molecules/ErrorSummary/ErrorDetails";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";

export type GenericFallbackErrorProps = ErrorPayload["params"];

export const GenericFallbackError = ({ errorStack, errorMessage, errorDetails }: GenericFallbackErrorProps) => {
  const config = useClientConfig();

  const internalError = !config.ssoEnabled && (errorStack || errorMessage || errorDetails);

  return (
    <Page isActive qa="fallback-error" pageTitle={<PageTitle />}>
      <Section>
        <SimpleString qa="message">
          <Content
            value={x => x.pages.genericFallbackError.message}
            components={[
              <ExternalLink key="0" href="/projects/dashboard">
                {" "}
              </ExternalLink>,
            ]}
          />
        </SimpleString>
      </Section>

      {internalError && (
        <Section>
          <H2>
            <Content value={x => x.pages.genericFallbackError.developerHeading} />
          </H2>

          {errorMessage && <P>{errorMessage}</P>}

          {errorStack && <pre style={{ whiteSpace: "pre-wrap" }}>{errorStack}</pre>}

          {errorDetails && (
            <ol>
              <ErrorDetails details={errorDetails} />
            </ol>
          )}
        </Section>
      )}
    </Page>
  );
};
