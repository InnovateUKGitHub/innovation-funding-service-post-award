import { PageTitle } from "@ui/features/page-title";
import { Content } from "../content";
import { Page } from "../layout/page";
import { Section } from "../layout/section";
import { ExternalLink } from "../renderers/externalLink";
import { SimpleString } from "../renderers/simpleString";

export const UnauthenticatedError = () => {
  const contactLink = "https://apply-for-innovation-funding.service.gov.uk/info/contact";

  return (
    <Page qa="unauthenticated-error" pageTitle={<PageTitle />}>
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
    </Page>
  );
};
