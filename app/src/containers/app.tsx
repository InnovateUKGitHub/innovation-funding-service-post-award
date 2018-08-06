import React from 'react';
import { connect } from 'react-redux';
import { createRouteNodeSelector } from 'redux-router5';

import { matchRoute } from '../routing';
import { Header, Footer, PhaseBanner } from "../components";
// import * as Examples from './containers/examples';

interface AppProps {
  route: any;
  serverSide: boolean;
}

const AppComponent = (props: AppProps) => {
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
