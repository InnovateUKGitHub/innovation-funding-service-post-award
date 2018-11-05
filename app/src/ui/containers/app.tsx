import React from "react";
import { connect } from "react-redux";
import { createRouteNodeSelector, RouterState } from "redux-router5";
import { matchRoute } from "../routing";
import { Footer, Header, PhaseBanner } from "../components";

interface IAppProps extends RouterState {
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
    const params = route.getParams(this.props.route!);
    if(route.getLoadDataActions) {
      const actions = route.getLoadDataActions(params) || [];
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
          <main className="govuk-main-wrapper" id="main-content" role="main" data-qa={route.name}>
            <route.container {...this.props} />
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}

export const App = connect(createRouteNodeSelector(""))(AppComponent);
