import { useContent } from "@ui/hooks";
import { PageTitle } from "@ui/features/page-title";
import { Page, Section } from "@ui/components";
import { ExternalLink, SimpleString } from "@ui/components/renderers";
import { UserChanger } from "@ui/containers/developer/UserChanger";
import { useStores } from "@ui/redux";

export function UnauthenticatedError() {
  const { getContent } = useContent();
  const { ssoEnabled } = useStores().config.getConfig();

  const contactUsPreLink = getContent(x => x.pages.unauthenticatedError.preLinkContent);
  const contactUsLinkText = getContent(x => x.pages.unauthenticatedError.linkTextContent);
  const contactLink = "https://apply-for-innovation-funding.service.gov.uk/info/contact";
  const contactUsLink = <ExternalLink href={contactLink}>{contactUsLinkText}</ExternalLink>;

  const contactUsPostLink = getContent(x => x.pages.unauthenticatedError.postLinkContent);

  return (
    <Page qa="unauthenticated-error" pageTitle={<PageTitle />}>
      <Section>
        <SimpleString qa="reason">
          {contactUsPreLink} {contactUsLink} {contactUsPostLink}
        </SimpleString>
      </Section>

      {!ssoEnabled && <UserChanger />}
    </Page>
  );
}
