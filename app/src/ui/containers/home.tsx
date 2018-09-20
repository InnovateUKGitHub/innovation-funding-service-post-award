import React from "react";
import { routeConfig as routes } from "../routing";
import { Link, Title } from "../components";
import { ContainerBase, ReduxContainer } from "./containerBase";
const partnerId = "a071w000000LOXWAA4";
const projectId = "a051w000000GE7RAAW";
const claimId = "a051w000000GE7RAAW";
const costCategoryId = 1;

class Component extends ContainerBase<{}, {}, {}> {
  render() {
    return (
      <div>
        <Title title="Home Page" />
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-third">
            <h2><Link route={routes.projectDashboard.getLink({})}>Projects</Link></h2>
            <p>Projects Dashboard</p>
          </div>
          <div className="govuk-grid-column-one-third">
            <h2><Link route={routes.projectDetails.getLink({ id: projectId })}>Example Project</Link></h2>
            <p>Project with data</p>
          </div>
          <div className="govuk-grid-column-one-third">
            <h2><Link route={routes.contacts.getLink({})}>Contacts</Link></h2>
            <p>Some contacts from salesforce</p>
          </div>
        </div>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-third">
            <h2><Link route={routes.projectDetails.getLink({ id: projectId })}>Project Details</Link></h2>
            <p>Project {projectId}</p>
          </div>
            <div className="govuk-grid-column-one-third">
                <h2><Link route={routes.claimsDashboard.getLink({ projectId, partnerId })}>Claims for Partner</Link></h2>
                <p>Partner {partnerId} (Project {projectId})</p>
            </div>
          <div className="govuk-grid-column-one-third">
            <h2><Link route={routes.claimDetails.getLink({ projectId, claimId })}>Claims Details</Link></h2>
            <p>Project {projectId} Claim {claimId}</p>
          </div>
        </div>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-third">
            <h2><Link route={routes.claimForm.getLink({ projectId, claimId, costCategoryId })}>Claim Form</Link></h2>
            <p>Project {projectId} Claim {claimId}</p>
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
