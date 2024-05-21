import { useEffect, useMemo, useRef } from "react";
import { Helmet } from "react-helmet";
import { Store, Dispatch } from "redux";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { RelayEnvironmentProvider } from "react-relay";
import { AnyRouteDefinition } from "@ui/containers/containerBase";
import { ContentProvider } from "@ui/redux/contentProvider";
import { BaseProps } from "@ui/containers/containerBase";
import { PageTitleProvider } from "@ui/features/page-title";
import { useInitContent } from "@ui/features/use-initial-content";
import { getParamsFromUrl } from "@ui/helpers/make-url";
import { ErrorNotFoundRoute, ErrorRoute } from "./errors.page";
import { DeveloperSection } from "@ui/components/atomicDesign/organisms/DeveloperSection/DeveloperSection";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { MountedProvider } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { ErrorBoundaryFallback } from "@ui/components/atomicDesign/organisms/ErrorContainer/ErrorContainer";
import { FullHeight } from "@ui/components/atomicDesign/atoms/FullHeight/FullHeight";
import { GovWidthContainer } from "@ui/components/atomicDesign/atoms/GovWidthContainer/GovWidthContainer";
import { Header } from "@ui/components/atomicDesign/organisms/Header/header";
import { PhaseBanner } from "@ui/components/atomicDesign/molecules/PhaseBanner/phaseBanner";
import { SuspensePageLoader } from "@ui/components/bjss/loading";
import { routeTransition } from "@ui/redux/actions/common/transitionActions";
import { RoutesProvider } from "@ui/redux/routesProvider";
import { useStores } from "@ui/redux/storesProvider";
import { routeConfig, getRoutes } from "@ui/routing/routeConfig";
import { Footer } from "@ui/components/atomicDesign/molecules/Footer/Footer";
import { useClientConfig } from "@ui/components/providers/ClientConfigProvider";
import { useScrollToTopSmoothly } from "@framework/util/windowHelpers";
import { OverrideAccessContext } from "./app/override-access";

interface IAppProps {
  dispatch: Dispatch;
  currentRoute: AnyRouteDefinition;
}

/**
 * `<AppView />`
 * Handles providers, helmet and layout
 */
function AppView({ currentRoute, dispatch }: IAppProps) {
  const stores = useStores();
  const location = useLocation();

  const { params } = useMemo(
    () => getParamsFromUrl(currentRoute.routePath, location.pathname, location.search),
    [currentRoute.routePath, location.pathname, location.search],
  );

  const pathname = typeof window !== "undefined" ? window?.location?.pathname : "";
  useScrollToTopSmoothly([pathname]);

  const content = useInitContent(params);

  const config = useClientConfig();
  const messages = stores.messages.messages();

  const titlePayload = currentRoute.getTitle?.({ params, stores, content });

  const navigationType = useNavigationType();

  const baseProps: BaseProps = {
    messages,
    config,
    routes: routeConfig,
    currentRoute,
    ...params,
  };

  const isAlreadyMounted = useRef(false);

  useEffect(() => {
    if (isAlreadyMounted.current) {
      dispatch(routeTransition(navigationType));
    } else {
      isAlreadyMounted.current = true;
    }
  }, [location.pathname, navigationType, dispatch]);

  const PageContainer = currentRoute.container;

  return (
    <>
      <Helmet
        defaultTitle={content.getCopyString(x => x.site.title.siteName)}
        titleTemplate={"%s - " + content.getCopyString(x => x.site.title.siteName)}
        title={titlePayload?.htmlTitle}
      />

      <ContentProvider value={content}>
        <PageTitleProvider title={titlePayload?.displayTitle}>
          <FullHeight.Container data-page-qa={currentRoute.routeName}>
            <a href="#main-content" className="govuk-skip-link">
              Skip to main content
            </a>

            <Header headingLink={`${config.ifsRoot}/competition/search`} />

            <FullHeight.Content>
              <GovWidthContainer>
                <PhaseBanner />
              </GovWidthContainer>

              <SuspensePageLoader>
                <OverrideAccessContext.Provider value={!!currentRoute.allowRouteInActiveAccess}>
                  <PageContainer {...baseProps} />
                </OverrideAccessContext.Provider>
              </SuspensePageLoader>
            </FullHeight.Content>

            {!config.ssoEnabled && <DeveloperSection currentRoute={currentRoute} />}
            <Footer />
          </FullHeight.Container>
        </PageTitleProvider>
      </ContentProvider>
    </>
  );
}

interface AppRoute {
  store: Store;
  relayEnvironment: RelayModernEnvironment;
}

/**
 * `<App />`
 * Handles routes and error boundary
 */
export function App({ store, relayEnvironment }: AppRoute) {
  const routesList = getRoutes();
  const error = store.getState().globalError;

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
            <Routes>
              {error ? (
                <Route path="*" element={<AppView currentRoute={ErrorRoute} dispatch={store.dispatch} />} />
              ) : (
                <>
                  {routesList.map(([routeKey, route]) => (
                    <Route
                      key={routeKey}
                      path={route.routePath}
                      element={<AppView currentRoute={route} dispatch={store.dispatch} />}
                    />
                  ))}

                  <Route path="*" element={<AppView currentRoute={ErrorNotFoundRoute} dispatch={store.dispatch} />} />
                </>
              )}
            </Routes>
          </MountedProvider>
        </RoutesProvider>
      </ErrorBoundary>
    </RelayEnvironmentProvider>
  );
}
