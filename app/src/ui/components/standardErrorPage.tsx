import { useContent } from "@ui/hooks";
import { PageTitle } from "@ui/components/layout";
import { Page } from "./layout/page";
import { Section } from "./layout/section";
import { SimpleString } from "./renderers/simpleString";
import { ExternalLink } from "./renderers";

const dashboardLink = "/projects/dashboard";

export const StandardErrorPage = () => {
  const { getContent } = useContent();

  const errorTitle = getContent((x) => x.errors.unexpected.errorTitle);

  const errorMessage = getContent((x) => x.components.standardErrorPage.standardError);
  const dashboardText = getContent((x) => x.components.standardErrorPage.dashboardText);

  const errorContent = (
    <>
      {errorMessage} <ExternalLink href={dashboardLink} alt="go to Dashboard">{dashboardText}</ExternalLink>.
    </>
  );

  return (
    <Page pageTitle={<PageTitle title={errorTitle} />}>
      <Section>
        <SimpleString>{errorContent}</SimpleString>
      </Section>
    </Page>
  );
};
