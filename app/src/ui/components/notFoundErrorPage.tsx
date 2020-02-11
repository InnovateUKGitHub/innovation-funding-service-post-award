import React from "react";
import { Page } from "./layout/page";
import { Section } from "./layout/section";
import { SimpleString } from "./renderers/simpleString";
import { PageTitle } from "@ui/components/layout";
import { ContentConsumer } from "@ui/redux/contentProvider";

export const NotFoundErrorPage = () => (
  <ContentConsumer>
    {
      content => (
        <Page
          pageTitle={<PageTitle title={content.errors.notfound.title().displayTitle} />}
          backLink={null}
        >
          <Section>
            <SimpleString qa="errorMessage">
              Please check the web address or search term you entered for any errors. You can return to <a href="/projects/dashboard">your dashboard</a> or go back to the <a href="/">Innovate UK homepage</a>.
            </SimpleString>
          </Section>
        </Page>
      )
    }
  </ContentConsumer>
);
