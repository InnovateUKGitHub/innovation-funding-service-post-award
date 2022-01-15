import React from "react";
import { Store } from "redux";
import { Params, State as RouteState } from "router5";
import { ErrorBoundary } from "react-error-boundary";

import { Content } from "@content/content";
import { getContentFromResult, useCompetitionType } from "@ui/hooks";
import { IRoutes, MatchedRoute, matchRoute } from "@ui/routing";
import { IStores, ModalRegister, useModal, useRoutes, useStores } from "@ui/redux";
import { updatePageTitle } from "@ui/redux/actions";
import { ContentProvider } from "@ui/redux/contentProvider";
import { IClientConfig } from "@ui/redux/reducers/configReducer";

import { FooterExternalContent, footerLinks } from "@ui/containers/app/footer.config";
import { BaseProps } from "@ui/containers/containerBase";

import { ProjectParticipantProvider } from "@ui/features/project-participants";
import { Footer, FullHeight, GovWidthContainer, Header, PhaseBanner, PrivateModal } from "@ui/components";
import { ErrorContainer, ErrorContainerProps, ErrorBoundaryFallback } from "@ui/components/errors";

import { useAppMount } from "./app/app-mount.hook";
import { ProjectStatusCheck } from "./app/project-active";

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
  params: { projectId?: string } & Params;
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

    const baseProps: BaseProps = {
      messages,
      route,
      config,
      routes,
      isClient,
    };

    const RouteContainer = currentRoute.container;

    const appMenuItems = [
      {
        qa: "nav-dashboard",
        href: `${config.ifsRoot}/dashboard-selection`,
        text: getContentFromResult(content.header.dashboard),
      },
      {
        qa: "nav-profile",
        href: `${config.ifsRoot}/profile/view`,
        text: getContentFromResult(content.header.profile),
      },
      {
        qa: "nav-sign-out",
        href: "/logout",
        text: getContentFromResult(content.header.signOut),
      },
    ];

    return (
      <ContentProvider value={content}>
        <FullHeight.Container>
          <Header headingLink={`${config.ifsRoot}/competition/search`} menuItems={appMenuItems} />

          <FullHeight.Content>
            <GovWidthContainer data-page-qa={currentRoute.routeName}>
              <PhaseBanner />

              {hasAccess ? (
                <ErrorBoundary fallbackRender={errorProps => <ErrorBoundaryFallback {...(errorProps as any)} />}>
                  <ProjectParticipantProvider projectId={params.projectId}>
                    <ProjectStatusCheck
                      projectId={params.projectId}
                      overrideAccess={!!currentRoute.allowRouteInActiveAccess}
                    >
                      <RouteContainer {...baseProps} {...params} />
                    </ProjectStatusCheck>
                  </ProjectParticipantProvider>
                </ErrorBoundary>
              ) : (
                <ErrorContainer {...(route.params as ErrorContainerProps)} />
              )}
            </GovWidthContainer>
          </FullHeight.Content>

          <FooterExternalContent>
            {payload => <Footer supportingLinks={footerLinks} footerContent={payload} />}
          </FooterExternalContent>

          {modalRegister.getModals().map(modal => (
            <PrivateModal key={`modal-${modal.id}`} {...modal} />
          ))}
        </FullHeight.Container>
      </ContentProvider>
    );
  }
}

interface AppRoute {
  store: Store;
}

export function App(props: AppRoute) {
  const stores = useStores();
  const modalRegister = useModal();
  const routes = useRoutes();

  const getRoute = stores.navigation.getRoute();
  const currentRoute = matchRoute(getRoute);

  const params: Params & { projectId?: string } = currentRoute.getParams(getRoute);

  useAppMount(params.projectId);

  const competitionType = useCompetitionType(params.projectId);

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
      routes={routes}
    />
  );
}
