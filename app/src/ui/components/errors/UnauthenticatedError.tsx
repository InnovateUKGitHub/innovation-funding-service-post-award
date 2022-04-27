import { useContent } from "@ui/hooks";
import { PageTitle } from "@ui/features/page-title";
import { Page, Section } from "@ui/components";
import { ExternalLink, SimpleString } from "@ui/components/renderers";

export function UnauthenticatedError() {
  const { getContent } = useContent();

  const contactUsPreLink = getContent(x => x.errors.unauthenticated.contactUsPreLinkContent);
  const contactUsLinkText = getContent(x => x.errors.unauthenticated.contactUsLinkTextContent);
  const contactLink = "https://apply-for-innovation-funding.service.gov.uk/info/contact";
  const contactUsLink = <ExternalLink href={contactLink}>{contactUsLinkText}</ExternalLink>;

  const contactUsPostLink = getContent(x => x.errors.unauthenticated.contactUsPostLinkContent);

  return (
    <Page qa="unauthenticated-error" pageTitle={<PageTitle />}>
      <Section>
        <SimpleString qa="reason">
          {contactUsPreLink} {contactUsLink} {contactUsPostLink}
        </SimpleString>
      </Section>
    </Page>
  );
}
