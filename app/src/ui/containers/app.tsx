import { useEffect, useMemo, useRef } from "react";
import { Helmet } from "react-helmet";
import { Store, Dispatch } from "redux";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes, useLocation, useNavigationType } from "react-router-dom";

import { IRouteDefinition } from "@ui/containers/containerBase";
import { RoutesProvider, useModal, useStores } from "@ui/redux";
import { routeTransition } from "@ui/redux/actions";
import { ContentProvider } from "@ui/redux/contentProvider";
import { getRoutes, routeConfig } from "@ui/routing";

import { BaseProps } from "@ui/containers/containerBase";

import { PageTitleProvider } from "@ui/features/page-title";
import { ProjectParticipantProvider } from "@ui/features/project-participants";
import { useInitContent } from "@ui/features/use-initial-content";

import { Footer, FullHeight, GovWidthContainer, Header, PhaseBanner, PrivateModal } from "@ui/components";
import { ErrorBoundaryFallback, ErrorContainer } from "@ui/components/errors";
import { MountedProvider } from "@ui/features";
import { getParamsFromUrl } from "@ui/helpers/make-url";
import { noop } from "@ui/helpers/noop";
import { ProjectStatusCheck } from "./app/project-active";
import { ErrorNotFoundRoute, ErrorRoute } from "./errors.page";
import { useAppMount } from "./app/app-mount.hook";
import { ErrorPayload } from "@shared/create-error-payload";
import { DeveloperSection } from "@ui/components/layout/DeveloperSection";

interface IAppProps {
  dispatch: Dispatch;
  currentRoute: IRouteDefinition<any>;
}

/**
 * `<AppView />`
 * Handles providers, helmet and layout
 */
function AppView({ currentRoute, dispatch }: IAppProps) {
  const stores = useStores();
  const location = useLocation();

  const { params, routePathParams } = useMemo(
    () => getParamsFromUrl(currentRoute.routePath, location.pathname, location.search),
    [currentRoute.routePath, location.pathname, location.search],
  );

  // Note: Don't call me in a lifecycle - needs to be SSR compatible!
  useAppMount(routePathParams);

  const content = useInitContent(params);
  const modalRegister = useModal();
  const auth = stores.users.getCurrentUserAuthorisation();
  const config = stores.config.getConfig();
  const messages = stores.messages.messages();

  // Note: We treat no invocation as valid
  const hasAccess = currentRoute.accessControl ? currentRoute.accessControl(auth, params, config) : true;
  const titlePayload = currentRoute.getTitle({ params, stores, content });

  const navigationType = useNavigationType();

  // Note: Modals are rarely used, but leaving support currently
  useEffect(() => {
    modalRegister.subscribe("app", noop);
  }, [modalRegister]);

  // TODO: Deprecating 'config' and pulling from redux store via 'useSelector' prop drilling :(
  // TODO: Deprecating 'messages' and pulling from redux store via 'useSelector' prop drilling :(
  // TODO: Deprecating 'routes' and create a typed solution to fetch route with required url params
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
      <Helmet>
        <title>{titlePayload.htmlTitle} - Innovation Funding Service</title>
      </Helmet>

      <ContentProvider value={content}>
        <PageTitleProvider title={titlePayload.displayTitle}>
          <FullHeight.Container data-page-qa={currentRoute.routeName}>
            <a href="#main-content" className="govuk-skip-link">
              Skip to main content
            </a>

            <Header headingLink={`${config.ifsRoot}/competition/search`} />

            <FullHeight.Content>
              <GovWidthContainer>
                <PhaseBanner />
                {hasAccess ? (
                  <ProjectParticipantProvider projectId={routePathParams.projectId as string}>
                    <ProjectStatusCheck
                      projectId={routePathParams.projectId as string}
                      overrideAccess={!!currentRoute.allowRouteInActiveAccess}
                    >
                      <PageContainer {...baseProps} />
                    </ProjectStatusCheck>
                  </ProjectParticipantProvider>
                ) : (
                  <ErrorContainer from="app" {...(params as ErrorPayload["params"])} />
                )}
              </GovWidthContainer>
            </FullHeight.Content>

            {!config.ssoEnabled && <DeveloperSection />}
            <Footer />

            {modalRegister.getModals().map(modal => (
              <PrivateModal key={modal.id} {...modal} />
            ))}
          </FullHeight.Container>
        </PageTitleProvider>
      </ContentProvider>
    </>
  );
}

interface AppRoute {
  store: Store;
}

/**
 * `<App />`
 * Handles routes and error boundary
 */
export function App(props: AppRoute) {
  const routesList = getRoutes();
  const error = props.store.getState().globalError;

  return (
    <ErrorBoundary fallbackRender={errorProps => <ErrorBoundaryFallback {...errorProps} />}>
      <RoutesProvider value={routeConfig}>
        <MountedProvider>
          <Routes>
            {error ? (
              <Route path="*" element={<AppView currentRoute={ErrorRoute} dispatch={props.store.dispatch} />} />
            ) : (
              <>
                {routesList.map(([routeKey, route]) => (
                  <Route
                    key={routeKey}
                    path={route.routePath}
                    element={<AppView currentRoute={route} dispatch={props.store.dispatch} />}
                  />
                ))}

                <Route
                  path="*"
                  element={<AppView currentRoute={ErrorNotFoundRoute} dispatch={props.store.dispatch} />}
                />
              </>
            )}
          </Routes>
        </MountedProvider>
      </RoutesProvider>
    </ErrorBoundary>
  );
}
