import React from "react";
import * as ACC from "./index";

export const StandardErrorPage = () => (
  <ACC.Page
    pageTitle={<ACC.Title title="Something has gone wrong at our end"/>}
    backLink={null}
  >
    <ACC.Section>
      <ACC.Renderers.SimpleString>
        You can either go back to the page you were previously on or go back to your <a href="/projects/dashboard">dashboard</a>.
      </ACC.Renderers.SimpleString>
    </ACC.Section>
  </ACC.Page>
);
