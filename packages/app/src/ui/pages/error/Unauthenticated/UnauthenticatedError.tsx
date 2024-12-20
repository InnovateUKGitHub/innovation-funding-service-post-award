import { PageTitle } from "@ui/hooks/page-title";
import { Content } from "../../../components/molecules/Content/content";
import { Page } from "@ui/components/molecules/Page/Page";
import { Section } from "../../../components/molecules/Section/section";
import { ExternalLink } from "../../../components/atoms/ExternalLink/externalLink";
import { SimpleString } from "../../../components/atoms/SimpleString/simpleString";
import { ClientErrorResponse } from "@framework/util/errorHandlers";
import { ErrorInformation } from "@ui/components/molecules/ErrorSummary/ErrorInformation";

export const UnauthenticatedError = ({ error = null }: { error?: ClientErrorResponse | null }) => {
  const contactLink = "https://apply-for-innovation-funding.service.gov.uk/info/contact";

  return (
    <Page isActive qa="unauthenticated-error" pageTitle={<PageTitle />}>
      <Section>
        <SimpleString qa="reason">
          <Content
            value={x => x.pages.unauthenticatedError.contactUs}
            components={[
              <ExternalLink key="link" href={contactLink}>
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
