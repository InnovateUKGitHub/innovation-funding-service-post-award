import React from "react";
import * as ACC from "./index";
import { HomeRoute, ProjectDashboardRoute } from "../containers";

export const NotFoundErrorPage = () => (
  <ACC.Page
    pageTitle={<ACC.Title title="Page not found" />}
    backLink={null}
  >
    <ACC.Section>
      <ACC.Renderers.SimpleString qa="errorMessage">
        Please check the web address or search term you entered for any errors. You can return to <a href={ProjectDashboardRoute.routePath}>your dashboard</a> or go back to the <ACC.Link route={HomeRoute.getLink({})}>Innovate UK homepage</ACC.Link>.
      </ACC.Renderers.SimpleString>
    </ACC.Section>
  </ACC.Page>
);
