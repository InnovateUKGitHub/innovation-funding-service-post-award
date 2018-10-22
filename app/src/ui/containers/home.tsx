import React from "react";
import { Link, Title } from "../components";
import { ContainerBase, ReduxContainer } from "./containerBase";
import { ClaimLineItemsRoute, ClaimsDashboardRoute, ClaimsDetailsRoute, ContactListRoute, ProjectDashboardRoute, ProjectDetailsRoute } from ".";

const projectId = "a0C1X000000CxrFUAS";
const partnerId = "a0B1X000000DIxmUAG";
const periodId = 1;
const costCategoryId = "a071X000000HES6QAO";

class Component extends ContainerBase<{}, {}, {}> {
  render() {
    return (
      <div>
        <Title title="Home page" />
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-third">
            <h2><Link route={ProjectDashboardRoute.getLink({})}>Projects</Link></h2>
            <p>Projects dashboard</p>
          </div>
          <div className="govuk-grid-column-one-third">
            <h2><Link route={ProjectDetailsRoute.getLink({ id: projectId })}>Example Project</Link></h2>
            <p>Project with data</p>
          </div>
          <div className="govuk-grid-column-one-third">
            <h2><Link route={ContactListRoute.getLink({})}>Contacts</Link></h2>
            <p>Some contacts from salesforce</p>
          </div>
        </div>
      </div>
    );
  }
}

const containerDefinition = ReduxContainer.for(Component);

export const Home = containerDefinition.connect({
  withData: () => ({}),
  withCallbacks: () => ({})
});

export const HomeRoute = containerDefinition.route({
  routeName: "home",
  routePath: "/",
  getParams: () => ({}),
  getLoadDataActions: () => [],
  container: Home
});
