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
        <Title title="Home Page" />
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-third">
            <h2><Link route={ProjectDashboardRoute.getLink({})}>Projects</Link></h2>
            <p>Projects Dashboard</p>
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
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-third">
            <h2><Link route={ProjectDetailsRoute.getLink({ id: projectId })}>Project Details</Link></h2>
            <p>Project {projectId}</p>
          </div>
            <div className="govuk-grid-column-one-third">
                <h2><Link route={ClaimsDashboardRoute.getLink({ projectId, partnerId })}>Claims for Partner</Link></h2>
                <p>Partner {partnerId} (Project {projectId})</p>
            </div>
          <div className="govuk-grid-column-one-third">
            <h2><Link route={ClaimsDetailsRoute.getLink({ projectId, partnerId, periodId })}>Claims Details</Link></h2>
            <p>Project {projectId} Partner {partnerId} Period {periodId}</p>
          </div>
        </div>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-third">
            <h2><Link route={ClaimLineItemsRoute.getLink({ projectId, partnerId, costCategoryId, periodId })}>Claim line items</Link></h2>
            <p>Project {projectId} Partner {partnerId} Period {periodId} Category {costCategoryId}</p>
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
