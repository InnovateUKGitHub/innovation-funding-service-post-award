// tslint:disable: object-literal-key-quotes
import React from "react";
import { Store } from "redux";
import { Params, State as RouteState } from "router5";

import { Content } from "@content/content";
import { useCompetitionType } from "@ui/hooks";
import { IRoutes, MatchedRoute, matchRoute } from "@ui/routing";
import { IStores, ModalRegister, useModal, useStores } from "@ui/redux";
import { updatePageTitle } from "@ui/redux/actions";
import { ContentProvider } from "@ui/redux/contentProvider";
import { IClientConfig } from "@ui/redux/reducers/configReducer";

import { Footer, GovWidthContainer, Header, PhaseBanner, PrivateModal, useHeader } from "@ui/components";
import { StandardErrorPage } from "@ui/components/standardErrorPage";
import { FooterLinks } from "@ui/components/layout/footer.config";

import { BaseProps } from "./containerBase";

// TODO: This needs to be an external file, preferably near a config directory. The href values domain name need to be generated from config
// prettier-ignore
const footerLinks: FooterLinks = [
  {"data-qa": "innovate-uk", text: "Innovate UK", href: "https://www.gov.uk/government/organisations/innovate-uk"},
  {"data-qa": "innovation-funding-advice", text: "Innovation funding advice", href: "https://www.gov.uk/guidance/innovation-apply-for-a-funding-award"},
  {"data-qa": "connect-to-innovation-experts", text: "Connect to innovation experts", href: "https://www.gov.uk/guidance/innovation-get-support-and-advice"},
  {"data-qa": "events", text: "Events", href: "https://connect.innovateuk.org/events"},
  {"data-qa": "innovate-uk-blog", text: "Innovate UK blog", href: "https://innovateuk.blog.gov.uk/"},
  {"data-qa": "gov.uk-accessibility", text: "GOV.UK accessibility", href: "https://www.gov.uk/help/accessibility"},
  {"data-qa": "terms-and-conditions", text: "Terms and conditions", href: "https://apply-for-innovation-funding.service.gov.uk/info/terms-and-conditions"},
  {"data-qa": "contact-us", text: "Contact us", href: "https://apply-for-innovation-funding.service.gov.uk/info/contact"},
  {"data-qa": "sign-up-for-competition-updates", text: "Sign up for competition updates", href: "http://info.innovateuk.org/emailpref"},
  {"data-qa": "latest-funding-opportunities", text: "Latest funding opportunities", href: "https://apply-for-innovation-funding.service.gov.uk/competition/search"}
];
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
  params: Params;
  currentRoute: MatchedRoute;
}

class AppView extends React.Component<IAppProps> {
  constructor(props: IAppProps) {
    super(props);
    props.modalRegister.subscribe("app", () => this.setState({}));
  }

  public componentDidUpdate(prevProps: Readonly<IAppProps>) {
    const { route, loadStatus, stores, content, dispatch, currentRoute, params } = this.props;

    const newRoute = prevProps.route !== route;
    const hashLoaded = prevProps.loadStatus !== 0;

    if (newRoute || (loadStatus === 0 && hashLoaded)) {
      dispatch(updatePageTitle(currentRoute, params, stores, content));
    }
  }

  private accessControl(route: MatchedRoute, params: {}): boolean {
    if (!route.accessControl) return true;
    const auth = this.props.stores.users.getCurrentUserAuthorisation();
    return route.accessControl(auth, params, this.props.config);
  }

  public render() {
    const { modalRegister, messages, route, config, routes, isClient, content, currentRoute, params } = this.props;

    const hasAccess = this.accessControl(currentRoute, params);

    const requiredRouteProps: BaseProps = {
      messages,
      route,
      config,
      routes,
      isClient,
    };

    const headerProps = useHeader(config.ifsRoot, content.header);
    const RouteContainer = currentRoute.container;

    return (
      <ContentProvider value={content}>
        <div className="app-container">
          <Header {...headerProps} />

          <GovWidthContainer className="app-content" data-page-qa={currentRoute.routeName}>
            <PhaseBanner />

            {hasAccess ? <RouteContainer {...requiredRouteProps} {...params} /> : <StandardErrorPage />}
          </GovWidthContainer>

          <Footer links={footerLinks} />

          {modalRegister.getModals().map(modal => (
            <PrivateModal key={`modal-${modal.id}`} {...modal} />
          ))}
        </div>
      </ContentProvider>
    );
  }
}

interface AppRoute {
  store: Store;
  routes: IRoutes;
}

export function App(props: AppRoute) {
  const stores = useStores();
  const modalRegister = useModal();

  const getRoute = stores.navigation.getRoute();
  const currentRoute = matchRoute(getRoute);
  const params: Params = currentRoute.getParams(getRoute);

  const competitionType = useCompetitionType(params);

  return (
    <AppView
      content={new Content(competitionType)}
      stores={stores}
      modalRegister={modalRegister}
      loadStatus={stores.navigation.getLoadStatus()}
      config={stores.config.getConfig()}
      isClient={stores.config.isClient()}
      messages={stores.messages.messages()}
      route={getRoute}
      params={params}
      currentRoute={currentRoute}
      dispatch={props.store.dispatch}
      routes={props.routes}
    />
  );
}
