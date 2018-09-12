import React from "react";
import { routeConfig as routes } from "../routing";
import { Link, Title } from "../components";

const exampleProjectId = "a051w000000GE7RAAW";
const examplePartnerId = "a071w000000LOXWAA4";

export const Home: React.StatelessComponent = () => (
  <div>
    <Title title="Home Page" />
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-third">
        <h2><Link route={routes.projectDashboard} className="govuk-link">Projects</Link></h2>
        <p>Projects Dashboard</p>
      </div>
      <div className="govuk-grid-column-one-third">
          <h2><Link route={routes.projectDetails} routeParams={{ id: "a051w000000GE7RAAW" }} className="govuk-link">Example Project</Link></h2>
          <p>Project with data</p>
        </div>
      <div className="govuk-grid-column-one-third">
        <h2><Link route={routes.contacts} className="govuk-link">Contacts</Link></h2>
        <p>Some contacts from salesforce</p>
      </div>
    </div>
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-third">
        <h2><Link route={routes.projectDetails} routeParams={{ id: exampleProjectId }} className="govuk-link">Project Details</Link></h2>
        <p>Project {exampleProjectId}</p>
      </div>
      <div className="govuk-grid-column-one-third">
        <h2><Link route={routes.projectClaims} routeParams={{ projectId: exampleProjectId, partnerId: examplePartnerId }} className="govuk-link">Claims for Partner</Link></h2>
        <p>Partner {exampleProjectId}</p>
      </div>
    </div>
  </div>
);
