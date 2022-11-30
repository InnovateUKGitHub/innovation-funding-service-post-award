import { PageTitle } from "@ui/features/page-title";
import { Page, Section, Content } from "@ui/components";
import { ExternalLink, SimpleString } from "@ui/components/renderers";

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
