import React from "react";
import { routeConfig as routes } from "../routing";
import { Link, Title } from "../components";

const ids = [
  "a051w000000GE7RAAW"
];

export const Home: React.StatelessComponent = () => (
  <div>
    <Title title="Home Page" />
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-third">
        <h2><Link route={routes.error} className="govuk-link">Accounts</Link></h2>
        <p>Some accounts from salesforce</p>
      </div>
      <div className="govuk-grid-column-one-third">
        <h2><Link route={routes.contacts} className="govuk-link">Contacts</Link></h2>
        <p>Some contacts from salesforce</p>
      </div>
    </div>
    <div className="govuk-grid-row">
      {ids.map((id, key) =>
        <div className="govuk-grid-column-one-third" key={key}>
          <h2><Link route={routes.projectDetails} routeParams={{ id }} className="govuk-link">Details for Project {id}</Link></h2>
          <p>Project {id}</p>
        </div>
      )}
    </div>
  </div>
);
