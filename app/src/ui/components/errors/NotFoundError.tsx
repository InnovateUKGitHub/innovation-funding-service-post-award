import { PageTitle } from "@ui/features/page-title";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { Content } from "../content";
import { Page } from "../layout/page";
import { Section } from "../layout/section";
import { ExternalLink } from "../renderers/externalLink";

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
    <Page qa="not-found" pageTitle={<PageTitle />}>
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
