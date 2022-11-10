import { PageTitle } from "@ui/features/page-title";

import { Page, Section } from "../layout";
import { SimpleString } from "../renderers/simpleString";
import { ExternalLink } from "../renderers";
import { Content } from "../content";

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
