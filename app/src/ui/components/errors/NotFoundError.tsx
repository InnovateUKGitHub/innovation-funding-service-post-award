import { useContent } from "@ui/hooks";
import { PageTitle } from "@ui/features/page-title";

import { Page, Section } from "../layout";
import { SimpleString } from "../renderers/simpleString";
import { ExternalLink } from "../renderers";

const innovateUKLink = "https://www.gov.uk/government/organisations/innovate-uk";

export function NotFoundError() {
  const { getContent } = useContent();

  const errorMessage = getContent(x => x.pages.notFoundError.errorMessage);
  const goBackMessage = getContent(x => x.pages.notFoundError.goBackMessage);
  const homepage = getContent(x => x.pages.notFoundError.innovateUkMessage);
  const yourDashBoardMessage = getContent(x => x.pages.notFoundError.yourDashBoard);

  const dashboardLinkElement = <a href="/projects/dashboard">{yourDashBoardMessage}</a>;
  const innovateLinkElement = <ExternalLink href={innovateUKLink}>{homepage}</ExternalLink>;

  return (
    <Page qa="not-found" pageTitle={<PageTitle />}>
      <Section>
        <SimpleString qa="errorMessage">
          {errorMessage} {dashboardLinkElement} {goBackMessage} {innovateLinkElement}.
        </SimpleString>
      </Section>
    </Page>
  );
}
