import * as Containers from "../containers";

export type RouteKeys = keyof typeof routeConfig;

export const routeConfig = {
  allClaimsDashboard: Containers.AllClaimsDashboardRoute,
  claimsDashboard: Containers.ClaimsDashboardRoute,
  claimDetails: Containers.ClaimsDetailsRoute,
  claimDetailDocuments: Containers.ClaimDetailDocumentsRoute,
  claimForecast: Containers.ClaimForecastRoute,
  claimLineItems: Containers.ClaimLineItemsRoute,
  error: Containers.ErrorRoute,
  home: Containers.HomeRoute,
  prepareClaim: Containers.PrepareClaimRoute,
  prepareClaimLineItems: Containers.EditClaimLineItemsRoute,
  projectChangeRequests: Containers.ProjectChangeRequestsRoute,
  projectDashboard: Containers.ProjectDashboardRoute,
  projectDetails: Containers.ProjectDetailsRoute,
  projectForecast: Containers.ProjectForecastRoute,
  prepareMonitoringReport: Containers.PrepareMonitoringReportRoute,
  reviewClaim: Containers.ReviewClaimRoute,
  reviewClaimLineItems: Containers.ReviewClaimLineItemsRoute,
  updateForecast: Containers.UpdateForecastRoute,
  viewForecast: Containers.ViewForecastRoute,
};
