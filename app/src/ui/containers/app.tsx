import { udpatePageTitle } from "@ui/redux/actions";
import React from "react";
import { MatchedRoute, matchRoute } from "@ui/routing";
import { Footer, Header, PhaseBanner } from "@ui/components";
import { StandardErrorPage } from "@ui/components/standardErrorPage";
import { IStores, StoresConsumer } from "@ui/redux";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { Authorisation, IClientUser } from "@framework/types";
import { BaseProps } from "./containerBase";
import { Store } from "redux";
import { State as RouteState } from "router5";

interface IAppProps {
  // @todo see if we can remove dispatch once load data removed from route
  dispatch: any;
  loadStatus: number;
  user: IClientUser;
  config: IClientConfig;
  messages: string[];
  // @todo see if we can remove and replace with a callback to set page title
  stores: IStores;
  // @todo see if we can remove once load data removed
  route: RouteState;
}

class AppComponent extends React.Component<IAppProps, {}> {
  public componentDidMount() {
    this.loadData();
  }

  public componentDidUpdate(prevProps: Readonly<IAppProps>) {
    if (prevProps.route !== this.props.route || (this.props.loadStatus === 0 && prevProps.loadStatus !== 0)) {
      this.loadData();
    }
  }

  private accessControl(route: MatchedRoute) {
    if (!route.accessControl) return true;
    const params = route.getParams(this.props.route);
    const auth = new Authorisation(this.props.user.roleInfo);
    return route.accessControl(auth, params, this.props.config);
  }

  private loadData() {
    const route = matchRoute(this.props.route);
    const params = route.getParams(this.props.route);
    const auth = new Authorisation(this.props.user.roleInfo);

    this.props.dispatch(udpatePageTitle(route, params, this.props.stores));

    if (route.getLoadDataActions) {
      const actions = route.getLoadDataActions(params, auth) || [];
      actions.forEach(a => this.props.dispatch(a));
    }
  }

  public render() {
    const route = matchRoute(this.props.route);
    const hasAccess = this.accessControl(route);
    const params = route.getParams(this.props.route);
    const propsToPass: BaseProps = {
      messages: this.props.messages,
      route: this.props.route,
      config: this.props.config,
    };
    const pageContent = hasAccess ? <route.container {...propsToPass} {...params} /> : <StandardErrorPage />;
    return (
      <div>
        <Header ifsRoot={this.props.config.ifsRoot} />
        <div className="govuk-width-container" data-page-qa={route.name}>
          <PhaseBanner />
          {pageContent}
        </div>
        <Footer />
      </div>
    );
  }
}

export class App extends React.Component<{ store: Store }, { marker: {}}> {
  constructor(props: any) {
    super(props);
    // whenever the store changes force a rerender this will flow down to container level
    // where if no props have changed rendering stops
    this.props.store.subscribe(() => this.setState({ marker: {} }));
  }

  render() {
    return (
      <StoresConsumer>
        {stores => (
          <AppComponent
            stores={stores}
            loadStatus={stores.navigation.getLoadStatus()}
            user={stores.users.getCurrentUser()}
            config={stores.config.getConfig()}
            messages={stores.messages.messages()}
            dispatch={this.props.store.dispatch}
            route={stores.navigation.getRoute()}
          />
        )}
      </StoresConsumer>
    );
  }
}
