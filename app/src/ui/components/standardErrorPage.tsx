import React from "react";
import { Page } from "./layout/page";
import { Section } from "./layout/section";
import { SimpleString } from "./renderers/simpleString";
import { PageTitle } from "@ui/components/layout";
import { ContentConsumer } from "@ui/redux/contentProvider";

export const StandardErrorPage = () => (
  <ContentConsumer>
    {
      content => (
        <Page
          pageTitle={<PageTitle title={content.errors.unexpected.title().displayTitle} />}
          backLink={null}
        >
          <Section>
            <SimpleString>
              You can either go back to the page you were previously on or go back to your <a href="/projects/dashboard">dashboard</a>.
            </SimpleString>
          </Section>
        </Page>
      )
    }
  </ContentConsumer>
);
