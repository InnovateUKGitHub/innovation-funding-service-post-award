import React from "react";
import { IStores, ModalConsumer, ModalRegister, StoresConsumer } from "@ui/redux";
import { udpatePageTitle } from "@ui/redux/actions";
import { IRoutes, MatchedRoute, matchRoute } from "@ui/routing";
import { Footer, Header, PhaseBanner, PrivateModal } from "@ui/components";
import { StandardErrorPage } from "@ui/components/standardErrorPage";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
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
  modalRegister: ModalRegister;
  isClient: boolean;
  stores: IStores;
  route: RouteState;
  routes: IRoutes;
  content: Content;
}

class AppComponent extends React.Component<IAppProps, {}> {

  constructor(props: IAppProps) {
    super(props);
    props.modalRegister.subscribe("app", () => this.setState({}));
  }

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
        <div className="govuk-width-container" data-page-qa={route.routeName}>
          <PhaseBanner />
          {pageContent}
        </div>
        <Footer />
        { this.props.modalRegister.getModals().map(x => <PrivateModal key={`modal-${x.id}`} id={x.id}>{x.children}</PrivateModal>) }
      </div>
    );
  }
}

export class App extends React.Component<{ store: Store, routes: IRoutes }, { marker: {} }> {

  render() {
    return (
      <StoresConsumer>
        {stores => (
          <ContentConsumer>
            {content => (
              <ModalConsumer>
                {modalRegister => (
                  <AppComponent
                    content={content}
                    stores={stores}
                    loadStatus={stores.navigation.getLoadStatus()}
                    config={stores.config.getConfig()}
                    isClient={stores.config.isClient()}
                    messages={stores.messages.messages()}
                    modalRegister={modalRegister}
                    dispatch={this.props.store.dispatch}
                    route={stores.navigation.getRoute()}
                    routes={this.props.routes}
                  />
                )}
              </ModalConsumer>
            )}
          </ContentConsumer>
        )}
      </StoresConsumer>
    );
  }
}
