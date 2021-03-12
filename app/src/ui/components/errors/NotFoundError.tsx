import { useContent } from "@ui/hooks";
import { PageTitle } from "@ui/components/layout";

import { Page, Section } from "../layout";
import { SimpleString } from "../renderers/simpleString";
import { ExternalLink } from "../renderers";

const innovateUKLink = "https://www.gov.uk/government/organisations/innovate-uk";

export function NotFoundError() {
  const { getContent } = useContent();

  const errorMessage = getContent(x => x.errors.notfound.notFoundError);
  const goBackMessage = getContent(x => x.errors.notfound.goBackMessage);
  const homepage = getContent(x => x.errors.notfound.innovateUKMessage);
  const yourDashBoardMessage = getContent(x => x.errors.notfound.yourDashboardMessage);

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
