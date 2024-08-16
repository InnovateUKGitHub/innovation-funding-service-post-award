import { PageTitle } from "@ui/features/page-title";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { Content } from "../../../../components/molecules/Content/content";
import { Page } from "@ui/components/molecules/Page/Page";
import { Section } from "../../../../components/molecules/Section/section";
import { ExternalLink } from "../../../../components/atoms/ExternalLink/externalLink";

const innovateUKLink = "https://www.gov.uk/government/organisations/innovate-uk";

export const NotFoundError = () => {
  const dashboardLinkElement = (
    <a key="dashboard" href="/projects/dashboard">
      {" "}
    </a>
  );
  const innovateLinkElement = (
    <ExternalLink key="innovate" href={innovateUKLink}>
      {" "}
    </ExternalLink>
  );

  return (
    <Page isActive qa="not-found" pageTitle={<PageTitle />}>
      <Section>
        <SimpleString qa="errorMessage">
          <Content
            value={x => x.pages.notFoundError.goBackMessage}
            components={[dashboardLinkElement, innovateLinkElement]}
          />
        </SimpleString>
      </Section>
    </Page>
  );
};
