import { StaticHandlerContext } from "@remix-run/router";
import { ErrorPayload } from "@shared/create-error-payload";
import { FullHeight } from "@ui/components/atomicDesign/atoms/FullHeight/FullHeight";
import { GovWidthContainer } from "@ui/components/atomicDesign/atoms/GovWidthContainer/GovWidthContainer";
import { MountedProvider } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { ProjectParticipantProvider } from "@ui/components/atomicDesign/atoms/providers/ProjectParticipants/project-participants";
import { Footer } from "@ui/components/atomicDesign/molecules/Footer/Footer";
import { PhaseBanner } from "@ui/components/atomicDesign/molecules/PhaseBanner/phaseBanner";
import { DeveloperSection } from "@ui/components/atomicDesign/organisms/DeveloperSection/DeveloperSection";
import {
  ErrorBoundaryFallback,
  ErrorContainer,
} from "@ui/components/atomicDesign/organisms/ErrorContainer/ErrorContainer";
import { Header } from "@ui/components/atomicDesign/organisms/Header/header";
import { SuspensePageLoader } from "@ui/components/bjss/loading";
import { useClientConfig } from "@ui/components/providers/ClientConfigProvider";
import { BaseProps, IRouteDefinition } from "@ui/containers/containerBase";
import { PageTitleProvider } from "@ui/features/page-title";
import { useInitContent } from "@ui/features/use-initial-content";
import { getParamsFromUrl } from "@ui/helpers/make-url";
import { routeTransition } from "@ui/redux/actions/common/transitionActions";
import { ContentProvider } from "@ui/redux/contentProvider";
import { RoutesProvider } from "@ui/redux/routesProvider";
import { useStores } from "@ui/redux/storesProvider";
import { ReactRouterRouter } from "@ui/routing/reactRouterRoutes";
import { routeConfig } from "@ui/routing/routeConfig";
import { useEffect, useMemo, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Helmet } from "react-helmet";
import { useStore } from "react-redux";
import { RelayEnvironmentProvider } from "react-relay";
import { RouterProvider, useLocation, useNavigationType } from "react-router-dom";
import { StaticRouterProvider } from "react-router-dom/server";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { useAppMount } from "./app/app-mount.hook";
import { ProjectStatusCheck } from "./app/project-active";
import { ErrorRoute } from "./errors.page";
import { RootState } from "@ui/redux/reducers/rootReducer";

interface IAppProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentRoute: IRouteDefinition<any>;
}

/**
 * `<AppView />`
 * Handles providers, helmet and layout
 */
function AppView({ currentRoute }: IAppProps) {
  const stores = useStores();
  const store = useStore<RootState>();
  const error = store.getState().globalError;

  const location = useLocation();

  const renderedRoute = useMemo(() => (error ? ErrorRoute : currentRoute), [error, currentRoute]);

  const { params, routePathParams } = useMemo(
    () => getParamsFromUrl(renderedRoute.routePath, location.pathname, location.search),
    [renderedRoute.routePath, location.pathname, location.search],
  );

  // Note: Don't call me in a lifecycle - needs to be SSR compatible!
  useAppMount(routePathParams);

  const content = useInitContent(params);
  const auth = stores.users.getCurrentUserAuthorisation();
  const config = useClientConfig();
  const messages = stores.messages.messages();

  // Note: We treat no invocation as valid
  const hasAccess = renderedRoute.accessControl ? renderedRoute.accessControl(auth, params, config) : true;
  const titlePayload = renderedRoute.getTitle({ params, stores, content });

  const navigationType = useNavigationType();

  // TODO: Deprecating 'config' and pulling from redux store via 'useSelector' prop drilling :(
  // TODO: Deprecating 'messages' and pulling from redux store via 'useSelector' prop drilling :(
  // TODO: Deprecating 'routes' and create a typed solution to fetch route with required url params
  const baseProps: BaseProps = {
    messages,
    config,
    routes: routeConfig,
    currentRoute: renderedRoute,
    ...params,
  };

  const isAlreadyMounted = useRef(false);

  useEffect(() => {
    if (isAlreadyMounted.current) {
      store.dispatch(routeTransition(navigationType));
    } else {
      isAlreadyMounted.current = true;
    }
  }, [location.pathname, navigationType, store]);

  const PageContainer = renderedRoute.container;

  return (
    <>
      <Helmet>
        <title>{titlePayload.htmlTitle} - Innovation Funding Service</title>
      </Helmet>

      <ContentProvider value={content}>
        <PageTitleProvider title={titlePayload.displayTitle}>
          <FullHeight.Container data-page-qa={renderedRoute.routeName}>
            <a href="#main-content" className="govuk-skip-link">
              Skip to main content
            </a>

            <Header headingLink={`${config.ifsRoot}/competition/search`} />

            <FullHeight.Content>
              <GovWidthContainer>
                <PhaseBanner />
              </GovWidthContainer>

              <SuspensePageLoader>
                {hasAccess ? (
                  <ProjectParticipantProvider projectId={routePathParams.projectId as ProjectId}>
                    <ProjectStatusCheck
                      projectId={routePathParams.projectId as ProjectId}
                      overrideAccess={!!renderedRoute.allowRouteInActiveAccess}
                    >
                      <PageContainer {...baseProps} />
                    </ProjectStatusCheck>
                  </ProjectParticipantProvider>
                ) : (
                  <ErrorContainer from="app" {...(params as ErrorPayload["params"])} />
                )}
              </SuspensePageLoader>
            </FullHeight.Content>

            {!config.ssoEnabled && <DeveloperSection />}
            <Footer />
          </FullHeight.Container>
        </PageTitleProvider>
      </ContentProvider>
    </>
  );
}

interface AppRoute {
  relayEnvironment: RelayModernEnvironment;
  router: ReactRouterRouter;
  context?: StaticHandlerContext;
}

/**
 * `<App />`
 * Handles routes and error boundary
 */
function App({ relayEnvironment, router, context }: AppRoute) {
  return (
    <RelayEnvironmentProvider environment={relayEnvironment}>
      <ErrorBoundary
        fallbackRender={errorProps => (
          <MountedProvider>
            <ErrorBoundaryFallback {...errorProps} />
          </MountedProvider>
        )}
      >
        <RoutesProvider value={routeConfig}>
          <MountedProvider>
            {context ? <StaticRouterProvider router={router} context={context} /> : <RouterProvider router={router} />}
          </MountedProvider>
        </RoutesProvider>
      </ErrorBoundary>
    </RelayEnvironmentProvider>
  );
}

export { App, AppView };
