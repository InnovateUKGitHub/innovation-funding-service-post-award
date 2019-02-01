import React from "react";
import { SimpleString } from "./renderers";
import { Link } from "./links";
import { PageError } from "./pageError";
import { ProjectDashboardRoute } from "../containers/projects";

export const NotFoundErrorPage = () => (
  <PageError title="Something has gone wrong at our end">
    <SimpleString>
      You can either go back to the page you were previously on or go back to your <Link route={ProjectDashboardRoute.getLink({})}>dashboard</Link>.
    </SimpleString>
  </PageError>
);
