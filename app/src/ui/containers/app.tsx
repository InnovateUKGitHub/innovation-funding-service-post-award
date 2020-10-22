import React from "react";
import { IStores, ModalRegister, useModal, useStores } from "@ui/redux";
import { updatePageTitle } from "@ui/redux/actions";
import { IRoutes, MatchedRoute, matchRoute } from "@ui/routing";
import { Footer, Header, PhaseBanner, PrivateModal, useHeader } from "@ui/components";
import { StandardErrorPage } from "@ui/components/standardErrorPage";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { BaseProps } from "./containerBase";
import { Store } from "redux";
import { State as RouteState } from "router5";
import { Content } from "@content/content";
import { useContent } from "@ui/redux/contentProvider";

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

class AppView extends React.Component<IAppProps> {
  constructor(props: IAppProps) {
    super(props);
    props.modalRegister.subscribe("app", () => this.setState({}));
  }

  public componentDidUpdate(prevProps: Readonly<IAppProps>) {
    const { route, loadStatus, stores, content, dispatch } = this.props;

    const newRoute = prevProps.route !== route;
    const hashLoaded = prevProps.loadStatus !== 0;

    if (newRoute || (loadStatus === 0 && hashLoaded)) {
      const { filteredRoute, params } = this.createRouteProps();

      // Note: update page title
      dispatch(updatePageTitle(filteredRoute, params, stores, content));
    }
  }

  private accessControl(route: MatchedRoute, params: {}): boolean {
    if (!route.accessControl) return true;
    const auth = this.props.stores.users.getCurrentUserAuthorisation();
    return route.accessControl(auth, params, this.props.config);
  }

  private createRouteProps() {
    const { route } = this.props;

    const filteredRoute = matchRoute(route);
    const params = filteredRoute.getParams(route);

    return { filteredRoute, params };
  }

  public render() {
    const { modalRegister, messages, route, config, routes, isClient, content } = this.props;

    const { filteredRoute, params } = this.createRouteProps();
    const hasAccess = this.accessControl(filteredRoute, params);

    const requiredRouteProps: BaseProps = {
      messages,
      route,
      config,
      routes,
      isClient,
    };

    const headerProps = useHeader(config.ifsRoot, content.header);
    const RouteContainer = filteredRoute.container;

    return (
      <div>
        <Header {...headerProps} />

        <div
          className="govuk-width-container"
          data-page-qa={filteredRoute.routeName}
        >
          <PhaseBanner />

          {hasAccess ? (
            <RouteContainer {...requiredRouteProps} {...params} />
          ) : (
            <StandardErrorPage />
          )}
        </div>

        <Footer />

        {modalRegister.getModals().map((modal) => (
          <PrivateModal key={`modal-${modal.id}`} {...modal} />
        ))}
      </div>
    );
  }
}

interface AppRoute {
  store: Store;
  routes: IRoutes;
}

export const App: React.FunctionComponent<AppRoute> = (props) => {
  const stores = useStores();
  const content = useContent();
  const modalRegister = useModal();

  return (
    <AppView
      content={content}
      stores={stores}
      modalRegister={modalRegister}
      loadStatus={stores.navigation.getLoadStatus()}
      config={stores.config.getConfig()}
      isClient={stores.config.isClient()}
      messages={stores.messages.messages()}
      route={stores.navigation.getRoute()}
      dispatch={props.store.dispatch}
      routes={props.routes}
    />
  );
};
