import React from "react";
import * as ACC from "./index";

export const NotFoundErrorPage = () => (
  <ACC.Page
    pageTitle={<ACC.Title title="Page not found"/>}
    backLink={null}
  >
    <ACC.Section>
      <ACC.Renderers.SimpleString qa="errorMessage">
        Please check the web address or search term you entered for any errors. You can return to <a href="/projects/dashboard">your dashboard</a> or go back to the <a href="/">Innovate UK homepage</a>.
      </ACC.Renderers.SimpleString>
    </ACC.Section>
  </ACC.Page>
);
