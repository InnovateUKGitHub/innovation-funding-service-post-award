import React from "react";
import { Link } from "react-router5";
import { Title } from "../components";

const ids = [
  "a051w000000GE7PAAW",
  "a051w000000GE7YAAW",
  "a051w000000GE7UAAW"
];

export const Home: React.StatelessComponent = () => (
  <div>
    <Title title="Home Page" />
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-third">
        <h2><Link routeName="accounts" className="govuk-link">Accounts</Link></h2>
        <p>Some accounts from salesforce</p>
      </div>
      <div className="govuk-grid-column-one-third">
        <h2><Link routeName="contacts" className="govuk-link">Contacts</Link></h2>
        <p>Some contacts from salesforce</p>
      </div>
    </div>
    <div className="govuk-grid-row">
      {ids.map(id =>
        <div className="govuk-grid-column-one-third">
          <h2><Link routeName="projectDetails" routeParams={{ id }} className="govuk-link">Details for Project {id}</Link></h2>
          <p>Project {id}</p>
        </div>
      )}
    </div>
  </div>
);
