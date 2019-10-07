import * as Containers from "@ui/containers";

export type RouteKeys = keyof typeof routeConfig;

export const routeConfig = {
  allClaimsDashboard: Containers.AllClaimsDashboardRoute,
  claimsDashboard: Containers.ClaimsDashboardRoute,
  claimDetails: Containers.ClaimsDetailsRoute,
  claimDetailDocuments: Containers.ClaimDetailDocumentsRoute,
  claimForecast: Containers.ClaimForecastRoute,
  claimLineItems: Containers.ClaimLineItemsRoute,
  error: Containers.ErrorRoute,
  financeSummary: Containers.FinanceSummaryRoute,
  home: Containers.HomeRoute,
  monitoringReportCreate: Containers.MonitoringReportCreateRoute,
  monitoringReportDashboard: Containers.MonitoringReportDashboardRoute,
  monitoringReportDelete: Containers.MonitoringReportDeleteRoute,
  monitoringReportPrepare: Containers.MonitoringReportPrepareRoute,
  monitoringReportView: Containers.MonitoringReportViewRoute,
  prepareClaim: Containers.PrepareClaimRoute,
  prepareClaimLineItems: Containers.EditClaimLineItemsRoute,
  projectChangeRequests: Containers.ProjectChangeRequestsRoute,
  ProjectChangeRequestAddType: Containers.ProjectChangeRequestAddTypeRoute,
  pcrCreate: Containers.PCRCreateRoute,
  pcrDetails: Containers.PCRDetailsRoute,
  pcrDelete: Containers.PCRDeleteRoute,
  pcrPrepare: Containers.ProjectChangeRequestPrepareRoute,
  pcrPrepareItem: Containers.ProjectChangeRequestPrepareItemRoute,
  pcrPrepareReasoning: Containers.ProjectChangeRequestPrepareReasoningRoute,
  pcrReview: Containers.PCRReviewRoute,
  pcrReviewItem: Containers.PCRReviewItemRoute,
  pcrReviewReasoning: Containers.PCRReviewReasoningRoute,
  pcrViewItem: Containers.PCRViewItemRoute,
  pcrViewReasoning: Containers.PCRViewReasoningRoute,
  pcrsDashboard: Containers.PCRsDashboardRoute,
  projectDashboard: Containers.ProjectDashboardRoute,
  projectDetails: Containers.ProjectDetailsRoute,
  projectDocuments: Containers.ProjectDocumentsRoute,
  projectForecast: Containers.ProjectForecastRoute,
  projectOverview: Containers.ProjectOverviewRoute,
  reviewClaim: Containers.ReviewClaimRoute,
  reviewClaimLineItems: Containers.ReviewClaimLineItemsRoute,
  updateForecast: Containers.UpdateForecastRoute,
  viewForecast: Containers.ViewForecastRoute,
};
