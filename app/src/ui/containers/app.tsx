import React from "react";
import { IStores, StoresConsumer } from "@ui/redux";
import { udpatePageTitle } from "@ui/redux/actions";
import { IRoutes, MatchedRoute, matchRoute } from "@ui/routing";
import { Footer, Header, PhaseBanner } from "@ui/components";
import { StandardErrorPage } from "@ui/components/standardErrorPage";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { Authorisation, IClientUser } from "@framework/types";
import { BaseProps } from "./containerBase";
import { Store } from "redux";
import { State as RouteState } from "router5";
import { Content } from "@content/content";
import { ContentConsumer } from "@ui/redux/contentProvider";

interface IAppProps {
  // @todo see if we can remove and replace with a callback to set page title
  dispatch: any;
  loadStatus: number;
  config: IClientConfig;
  messages: string[];
  isClient: boolean;
  stores: IStores;
  route: RouteState;
  routes: IRoutes;
  content: Content;
}

class AppComponent extends React.Component<IAppProps, {}> {
  public componentDidUpdate(prevProps: Readonly<IAppProps>) {
    if (prevProps.route !== this.props.route || (this.props.loadStatus === 0 && prevProps.loadStatus !== 0)) {
      this.updateTitle();
    }
  }

  private accessControl(route: MatchedRoute, params: {}) {
    if (!route.accessControl) return true;
    const auth = this.props.stores.users.getCurrentUserAuthorisation();
    return route.accessControl(auth, params, this.props.config);
  }

  private updateTitle() {
    const route = matchRoute(this.props.route);
    const params = route.getParams(this.props.route);
    this.props.dispatch(udpatePageTitle(route, params, this.props.stores, this.props.content));
  }

  public render() {
    const route = matchRoute(this.props.route);
    const params = route.getParams(this.props.route);
    const hasAccess = this.accessControl(route, params);
    const propsToPass: BaseProps = {
      messages: this.props.messages,
      route: this.props.route,
      routes: this.props.routes,
      config: this.props.config,
      isClient: this.props.isClient
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

export class App extends React.Component<{ store: Store, routes: IRoutes }, { marker: {} }> {
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
          <ContentConsumer>
            {
              content => (
                <AppComponent
                  content={content}
                  stores={stores}
                  loadStatus={stores.navigation.getLoadStatus()}
                  config={stores.config.getConfig()}
                  isClient={stores.config.isClient()}
                  messages={stores.messages.messages()}
                  dispatch={this.props.store.dispatch}
                  route={stores.navigation.getRoute()}
                  routes={this.props.routes}
                />
              )
            }
          </ContentConsumer>
        )}
      </StoresConsumer>
    );
  }
}
