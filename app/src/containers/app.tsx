import React from "react";
import { connect } from "react-redux";
import { createRouteNodeSelector } from "redux-router5";

import { matchRoute } from "../routing";
import { Footer, Header, PhaseBanner } from "../components";

// import * as Examples from './containers/examples';

interface IAppProps {
  route: any;
  serverSide?: boolean;
}

const AppComponent = (props: IAppProps) => {
  const route = matchRoute(props.route);

  return (
    <div>
      <Header />
      <div className="govuk-width-container">
        <PhaseBanner />
        <main className="govuk-main-wrapper " id="main-content" role="main">
          <route.component {...props as any}  />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export const App = connect(createRouteNodeSelector(''))(AppComponent);
