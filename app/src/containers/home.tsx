import React from "react";
import { Link } from "react-router5";
import { Title } from "../components";

export const Home: React.StatelessComponent = () => (
  <div>
    <Title>Home Page</Title>
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
  </div>
);
