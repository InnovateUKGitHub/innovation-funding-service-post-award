import { PageTitle } from "@ui/features/page-title";
import { Page, Section, Content } from "@ui/components";
import { ExternalLink, SimpleString } from "@ui/components/renderers";
import { UserSwitcher } from "@ui/containers/developer/UserSwitcher";
import { useStores } from "@ui/redux";

export const UnauthenticatedError = () => {
  const { ssoEnabled } = useStores().config.getConfig();

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
