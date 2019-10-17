import React from "react";
import { Page } from "./layout/page";
import { Section } from "./layout/section";
import { SimpleString } from "./renderers/simpleString";
import { PageTitle } from "@ui/components/layout";

export const StandardErrorPage = () => (
  <Page
    pageTitle={<PageTitle title="Something has gone wrong at our end" />}
    backLink={null}
  >
    <Section>
      <SimpleString>
        You can either go back to the page you were previously on or go back to your <a href="/projects/dashboard">dashboard</a>.
      </SimpleString>
    </Section>
  </Page>
);
