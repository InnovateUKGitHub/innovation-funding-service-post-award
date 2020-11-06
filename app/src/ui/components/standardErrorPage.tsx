import React from "react";
import { Page } from "./layout/page";
import { Section } from "./layout/section";
import { SimpleString } from "./renderers/simpleString";
import { PageTitle } from "@ui/components/layout";
import { useContent } from "@ui/redux/contentProvider";
import { ExternalLink } from "./renderers";

const dashboardLink = "/projects/dashboard";

export const StandardErrorPage = () => {
  const { getContent } = useContent();

  const errorTitle = getContent((x) => x.errors.unexpected.errorTitle);

  const errorMessage = getContent((x) => x.components.standardErrorPage.standardError);
  const dashboardText = getContent((x) => x.components.standardErrorPage.dashboardText);

  const errorContent = (
    <>
      {errorMessage} <ExternalLink href={dashboardLink}>{dashboardText}</ExternalLink>.
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
