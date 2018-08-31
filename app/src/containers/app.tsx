import React from "react";
import { connect } from "react-redux";
import { createRouteNodeSelector } from "redux-router5";
import { matchRoute } from "../routing";
import { Footer, Header, PhaseBanner } from "../components";

interface IAppProps {
  route: any;
  dispatch: any;
  serverSide?: boolean;
}

class AppComponent extends React.Component<IAppProps, {}> {
  public componentDidMount() {
    this.loadData();
  }

  public componentDidUpdate(prevProps: Readonly<IAppProps>) {
    if(prevProps.route !== this.props.route) {
      this.loadData();
    }
  }

  private loadData() {
    const route = matchRoute(this.props.route);
    if(route.component.loadData) {
      const actions = route.component.loadData(this.props.route) || [];
      actions.forEach(a => this.props.dispatch(a));
    }
  }

  public render() {
    const route = matchRoute(this.props.route);

    return (
      <div>
        <Header />
        <div className="govuk-width-container">
          <PhaseBanner />
          <main className="govuk-main-wrapper" id="main-content" role="main">
            <route.component {...this.props} />
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}

export const App = connect(createRouteNodeSelector(""))(AppComponent);
