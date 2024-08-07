import { ClientErrorResponse } from "@server/errorHandlers";
import { ExternalLink } from "@ui/components/atoms/ExternalLink/externalLink";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { Content } from "@ui/components/molecules/Content/content";
import { ErrorInformation } from "@ui/components/molecules/ErrorSummary/ErrorInformation";
import { Page } from "@ui/components/molecules/Page/Page";
import { Section } from "@ui/components/molecules/Section/section";
import { PageTitle } from "@ui/features/page-title";

export const GenericFallbackError = ({ error = null }: { error?: ClientErrorResponse | null }) => {
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

      {error && <ErrorInformation error={error} />}
    </Page>
  );
};
