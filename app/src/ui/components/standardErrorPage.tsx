import React from "react";
import { Page } from "./layout/page";
import { Title } from "./layout/title";
import { Section } from "./layout/section";
import { SimpleString } from "./renderers/simpleString";

export const StandardErrorPage = () => (
  <Page
    pageTitle={<Title title="Something has gone wrong at our end"/>}
    backLink={null}
  >
    <Section>
      <SimpleString>
        You can either go back to the page you were previously on or go back to your <a href="/projects/dashboard">dashboard</a>.
      </SimpleString>
    </Section>
  </Page>
);
