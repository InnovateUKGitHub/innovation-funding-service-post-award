import * as Containers from "@ui/containers";

export type RouteKeys = keyof typeof routeConfig;

export const routeConfig = {
  allClaimsDashboard: Containers.AllClaimsDashboardRoute,
  claimsDashboard: Containers.ClaimsDashboardRoute,
  claimDetails: Containers.ClaimsDetailsRoute,
  claimDetailDocuments: Containers.ClaimDetailDocumentsRoute,
  claimForecast: Containers.ClaimForecastRoute,
  claimLineItems: Containers.ClaimLineItemsRoute,
  claimStatusChanges: Containers.ClaimLogRoute,
  error: Containers.ErrorRoute,
  home: Containers.HomeRoute,
  monitoringReportCreate: Containers.MonitoringReportCreateRoute,
  monitoringReportDashboard: Containers.MonitoringReportDashboardRoute,
  monitoringReportLog: Containers.MonitoringReportLogRoute,
  monitoringReportPrepare: Containers.MonitoringReportPrepareRoute,
  monitoringReportView: Containers.MonitoringReportViewRoute,
  prepareClaim: Containers.PrepareClaimRoute,
  prepareClaimLineItems: Containers.EditClaimLineItemsRoute,
  projectChangeRequests: Containers.ProjectChangeRequestsRoute,
  projectDashboard: Containers.ProjectDashboardRoute,
  projectDetails: Containers.ProjectDetailsRoute,
  projectDocuments: Containers.ProjectDocumentsRoute,
  projectForecast: Containers.ProjectForecastRoute,
  reviewClaim: Containers.ReviewClaimRoute,
  reviewClaimLineItems: Containers.ReviewClaimLineItemsRoute,
  updateForecast: Containers.UpdateForecastRoute,
  viewForecast: Containers.ViewForecastRoute,
};
