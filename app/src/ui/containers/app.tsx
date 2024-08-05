import { useMemo } from "react";
import { Helmet } from "react-helmet";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes, useLocation } from "react-router-dom";
import { RelayEnvironmentProvider } from "react-relay";
import { AnyRouteDefinition } from "@ui/containers/containerBase";
import { ContentProvider } from "@ui/context/contentProvider";
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
import { RoutesProvider } from "@ui/context/routesProvider";
import { routeConfig, getRoutes } from "@ui/routing/routeConfig";
import { Footer } from "@ui/components/atomicDesign/molecules/Footer/Footer";
import { useClientConfig } from "@ui/context/ClientConfigProvider";
import { useScrollToTopSmoothly } from "@framework/util/windowHelpers";
import { useMessageContext } from "@ui/context/messages";
import { BasePropsContext } from "@framework/api-helpers/useBaseProps";
import { useServerErrorContext } from "@ui/context/server-error";

interface IAppProps {
  currentRoute: AnyRouteDefinition;
}

/**
 * `<AppView />`
 * Handles providers, helmet and layout
 */
function AppView({ currentRoute }: IAppProps) {
  const location = useLocation();

  const { params } = useMemo(
    () => getParamsFromUrl(currentRoute.routePath, location.pathname, location.search),
    [currentRoute.routePath, location.pathname, location.search],
  );

  const pathname = typeof window !== "undefined" ? window?.location?.pathname : "";
  useScrollToTopSmoothly([pathname]);

  const content = useInitContent(params);

  const config = useClientConfig();
  const { messages } = useMessageContext();

  const titlePayload = currentRoute.getTitle?.({ params, content });

  const baseProps: BaseProps = {
    messages,
    config,
    routes: routeConfig,
    currentRoute,
    ...params,
  };

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
                <BasePropsContext.Provider value={baseProps}>
                  <PageContainer {...baseProps} />
                </BasePropsContext.Provider>
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
  relayEnvironment: RelayModernEnvironment;
}

/**
 * `<App />`
 * Handles routes and error boundary
 */
export function App({ relayEnvironment }: AppRoute) {
  const routesList = getRoutes();
  const error = useServerErrorContext();
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
                <Route path="*" element={<AppView currentRoute={ErrorRoute} />} />
              ) : (
                <>
                  {routesList.map(([routeKey, route]) => (
                    <Route key={routeKey} path={route.routePath} element={<AppView currentRoute={route} />} />
                  ))}

                  <Route path="*" element={<AppView currentRoute={ErrorNotFoundRoute} />} />
                </>
              )}
            </Routes>
          </MountedProvider>
        </RoutesProvider>
      </ErrorBoundary>
    </RelayEnvironmentProvider>
  );
}
