import React from "react";
import { connect } from "react-redux";
import { createRouteNodeSelector, RouterState } from "redux-router5";
import { MatchedRoute, matchRoute } from "../routing";
import { Footer, Header, PhaseBanner } from "../components";
import { RootState } from "../redux";
import { IUser } from "../../types/IUser";
import { StandardErrorPage } from "../components/standardErrorPage";
import { Authorisation } from "../../types";

interface IAppProps extends RouterState {
  dispatch: any;
  loadStatus: number;
  user: IUser;
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
    return route.accessControl(new Authorisation((this.props.user.roleInfo)), params);
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
    const hasAccess = this.accessControl(route);
    const pageContent = hasAccess ? <route.container {...this.props} /> : <StandardErrorPage />;

    return (
      <div>
        <Header />
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
    ...routeInfo(state)
  });
};

export const App = connect(connectState())(AppComponent);
