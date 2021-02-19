
import { useContent } from "@ui/hooks";
import { PageTitle } from "@ui/components/layout";
import { Page } from "./layout/page";
import { Section } from "./layout/section";
import { SimpleString } from "./renderers/simpleString";
import { ExternalLink } from "./renderers";

const innovateUKLink = "https://www.gov.uk/government/organisations/innovate-uk";
const dashboardLink = "/projects/dashboard";

export function NotFoundErrorPage() {
  const { getContent } = useContent();

  const errorTitle = getContent((x) => x.errors.notfound.errorTitle);

  const errorMessage = getContent((x) => x.components.notFoundErrorPage.notFoundError);
  const goBackMessage = getContent((x) => x.components.notFoundErrorPage.goBackMessage);
  const homepage = getContent((x) => x.components.notFoundErrorPage.innovateUKMessage);
  const yourDashBoardMessage = getContent((x) => x.components.notFoundErrorPage.yourDashboardMessage);

  // prettier-ignore
  const errorContent = (
    <>
      {errorMessage} <ExternalLink href={dashboardLink} alt="go to Dashboard">{yourDashBoardMessage}</ExternalLink> {goBackMessage} <ExternalLink href={innovateUKLink} alt="go to Dashboard">{homepage}</ExternalLink>.
    </>
  );

  return (
    <Page pageTitle={<PageTitle title={errorTitle} />}>
      <Section>
        <SimpleString qa="errorMessage">{errorContent}</SimpleString>
      </Section>
    </Page>
  );
}
