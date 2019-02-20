import React from "react";
import * as ACC from "./index";
import { ProjectDashboardRoute } from "../containers/projects";

export const StandardErrorPage = () => (
  <ACC.Page>
    <ACC.Title title="Something has gone wrong at our end" />
    <ACC.Section>
      <ACC.Renderers.SimpleString>
        You can either go back to the page you were previously on or go back to your <ACC.Link route={ProjectDashboardRoute.getLink({})}>dashboard</ACC.Link>.
      </ACC.Renderers.SimpleString>
    </ACC.Section>
  </ACC.Page>
);
