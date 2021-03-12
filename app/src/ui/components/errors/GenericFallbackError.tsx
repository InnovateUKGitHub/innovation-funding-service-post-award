import { PageTitle } from "@ui/components/layout";
import { useContent } from "@ui/hooks";

import { Page } from "../layout/page";
import { Section } from "../layout/section";
import { ExternalLink } from "../renderers";
import { SimpleString } from "../renderers/simpleString";

export const GenericFallbackError = () => {
  const { getContent } = useContent();

  const errorMessage = getContent(x => x.errors.genericFallback.standardError);
  const dashboardText = getContent(x => x.errors.genericFallback.dashboardText);

  const dashboardLink = "/projects/dashboard";
  const goToDashboardLink = <ExternalLink href={dashboardLink}>{dashboardText}</ExternalLink>;

  return (
    <Page qa="fallback-error" pageTitle={<PageTitle />}>
      <Section>
        <SimpleString>
          {errorMessage} {goToDashboardLink}.
        </SimpleString>
      </Section>
    </Page>
  );
};
