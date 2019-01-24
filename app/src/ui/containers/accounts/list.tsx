import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router5";
import { Breadcrumbs, Title } from "../../components";

class List extends React.Component {
  render() {
    return (
      <div>
        <Breadcrumbs links={[{routeName:"home", text: "Home"}]}>Accounts</Breadcrumbs>
        <Title title="Accounts" />
        <Link className="govuk-back-link" routeName="home">Home</Link>
      </div>
    );
  }
}
