import { PageTitle } from "@ui/features/page-title";
import { Content } from "../../../../components/atomicDesign/molecules/Content/content";
import { Page } from "../../../../components/bjss/Page/page";
import { Section } from "../../../../components/atomicDesign/molecules/Section/section";
import { ExternalLink } from "../../../../components/atomicDesign/atoms/ExternalLink/externalLink";
import { SimpleString } from "../../../../components/atomicDesign/atoms/SimpleString/simpleString";

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
