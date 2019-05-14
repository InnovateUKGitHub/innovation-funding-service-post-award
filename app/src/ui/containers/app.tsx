import React from "react";
import { connect } from "react-redux";
import { createRouteNodeSelector, RouterState } from "redux-router5";
import { MatchedRoute, matchRoute } from "@ui/routing";
import { Footer, Header, PhaseBanner } from "@ui/components";
import { StandardErrorPage } from "@ui/components/standardErrorPage";
import { RootState } from "@ui/redux";
import { udpatePageTitle } from "@ui/redux/actions";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { Authorisation, IClientUser } from "@framework/types";

interface IAppProps extends RouterState {
  dispatch: any;
  loadStatus: number;
  user: IClientUser;
  config: IClientConfig;
}

class AppComponent extends React.Component<IAppProps, {}> {
  public componentDidMount() {
    this.loadData();
  }

  public componentDidUpdate(prevProps: Readonly<IAppProps>) {
    if(prevProps.route !== this.props.route || (this.props.loadStatus === 0 && prevProps.loadStatus !== 0)) {
      this.loadData();
    }
  }

  private accessControl(route: MatchedRoute) {
    if (!route.accessControl) return true;
    const params = route.getParams(this.props.route!);
    const auth = new Authorisation(this.props.user.roleInfo);
    return route.accessControl(auth, params, this.props.config.features);
  }

  private loadData() {
    const route = matchRoute(this.props.route);
    const params = route.getParams(this.props.route!);
    const auth = new Authorisation(this.props.user.roleInfo);

    this.props.dispatch(udpatePageTitle(route, params));

    if(route.getLoadDataActions) {
      const actions = route.getLoadDataActions(params, auth) || [];
      actions.forEach(a => this.props.dispatch(a));
    }
  }

  public render() {
    const route = matchRoute(this.props.route);
    const hasAccess = this.accessControl(route);
    const pageContent = hasAccess ? <route.container {...this.props} /> : <StandardErrorPage />;
    return (
      <div>
        <Header ifsRoot={this.props.config.ifsRoot} />
        <div className="govuk-width-container">
          <PhaseBanner />
          <main className="govuk-main-wrapper" id="main-content" role="main" data-qa={route.name}>
            { pageContent }
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}

const connectState = () => {
  const routeInfo = createRouteNodeSelector("");
  return (state: RootState) => ({
    loadStatus: state.loadStatus,
    user: state.user,
    config: state.config,
    ...routeInfo(state)
  });
};

export const App = connect(connectState())(AppComponent);
