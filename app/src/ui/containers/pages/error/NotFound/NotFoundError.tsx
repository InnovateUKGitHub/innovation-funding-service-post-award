import { PageTitle } from "@ui/features/page-title";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { Content } from "../../../../components/atomicDesign/molecules/Content/content";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Section } from "../../../../components/atomicDesign/molecules/Section/section";
import { ExternalLink } from "../../../../components/atomicDesign/atoms/ExternalLink/externalLink";

const innovateUKLink = "https://www.gov.uk/government/organisations/innovate-uk";

export const NotFoundError = () => {
  const dashboardLinkElement = (
    <a key="dashboard" href="/projects/dashboard">
      {" "}
    </a>
  );
  const innovateLinkElement = (
    <ExternalLink key="innovate" href={innovateUKLink}>
      {" "}
    </ExternalLink>
  );

  return (
    <Page isActive qa="not-found" pageTitle={<PageTitle />}>
      <Section>
        <SimpleString qa="errorMessage">
          <Content
            value={x => x.pages.notFoundError.goBackMessage}
            components={[dashboardLinkElement, innovateLinkElement]}
          />
        </SimpleString>
      </Section>
    </Page>
  );
};
