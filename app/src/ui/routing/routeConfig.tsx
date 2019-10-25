import * as Containers from "@ui/containers";

export type RouteKeys = keyof typeof routeConfig;

export const routeConfig: IRoutes = {
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
  pcrPrepareItem: Containers.PCRPrepareItemRoute,
  pcrPrepareFiles: Containers.ProjectChangeRequestPrepareItemFilesRoute,
  pcrPrepareReasoning: Containers.PCRPrepareReasoningRoute,
  pcrReview: Containers.PCRReviewRoute,
  pcrReviewItem: Containers.PCRReviewItemRoute,
  pcrReviewReasoning: Containers.PCRReviewReasoningRoute,
  pcrViewItem: Containers.PCRViewItemRoute,
  pcrViewReasoning: Containers.PCRViewReasoningRoute,
  pcrsDashboard: Containers.PCRsDashboardRoute,
  projectDashboard: Containers.ProjectDashboardRoute,
  projectDetails: Containers.ProjectDetailsRoute,
  projectDocuments: Containers.ProjectDocumentsRoute,
  projectOverview: Containers.ProjectOverviewRoute,
  reviewClaim: Containers.ReviewClaimRoute,
  reviewClaimLineItems: Containers.ReviewClaimLineItemsRoute,
  forecastDashboard: Containers.ForecastDashboardRoute,
  forecastDetails: Containers.ForecastDetailsRoute,
  forecastUpdate: Containers.UpdateForecastRoute,
};

// export type IRoutes = typeof routeConfig;
export interface IRoutes {
  allClaimsDashboard: typeof Containers.AllClaimsDashboardRoute;
  claimsDashboard: typeof Containers.ClaimsDashboardRoute;
  claimDetails: typeof Containers.ClaimsDetailsRoute;
  claimDetailDocuments: typeof Containers.ClaimDetailDocumentsRoute;
  claimForecast: typeof Containers.ClaimForecastRoute;
  claimLineItems: typeof Containers.ClaimLineItemsRoute;
  error: typeof Containers.ErrorRoute;
  financeSummary: typeof Containers.FinanceSummaryRoute;
  home: typeof Containers.HomeRoute;
  monitoringReportCreate: typeof Containers.MonitoringReportCreateRoute;
  monitoringReportDashboard: typeof Containers.MonitoringReportDashboardRoute;
  monitoringReportDelete: typeof Containers.MonitoringReportDeleteRoute;
  monitoringReportPrepare: typeof Containers.MonitoringReportPrepareRoute;
  monitoringReportView: typeof Containers.MonitoringReportViewRoute;
  prepareClaim: typeof Containers.PrepareClaimRoute;
  prepareClaimLineItems: typeof Containers.EditClaimLineItemsRoute;
  projectChangeRequests: typeof Containers.ProjectChangeRequestsRoute;
  ProjectChangeRequestAddType: typeof Containers.ProjectChangeRequestAddTypeRoute;
  pcrCreate: typeof Containers.PCRCreateRoute;
  pcrDetails: typeof Containers.PCRDetailsRoute;
  pcrDelete: typeof Containers.PCRDeleteRoute;
  pcrPrepare: typeof Containers.ProjectChangeRequestPrepareRoute;
  pcrPrepareItem: typeof Containers.PCRPrepareItemRoute;
  pcrPrepareFiles: typeof Containers.ProjectChangeRequestPrepareItemFilesRoute;
  pcrPrepareReasoning: typeof Containers.PCRPrepareReasoningRoute;
  pcrReview: typeof Containers.PCRReviewRoute;
  pcrReviewItem: typeof Containers.PCRReviewItemRoute;
  pcrReviewReasoning: typeof Containers.PCRReviewReasoningRoute;
  pcrViewItem: typeof Containers.PCRViewItemRoute;
  pcrViewReasoning: typeof Containers.PCRViewReasoningRoute;
  pcrsDashboard: typeof Containers.PCRsDashboardRoute;
  projectDashboard: typeof Containers.ProjectDashboardRoute;
  projectDetails: typeof Containers.ProjectDetailsRoute;
  projectDocuments: typeof Containers.ProjectDocumentsRoute;
  projectOverview: typeof Containers.ProjectOverviewRoute;
  reviewClaim: typeof Containers.ReviewClaimRoute;
  reviewClaimLineItems: typeof  Containers.ReviewClaimLineItemsRoute;
  forecastDashboard: typeof Containers.ForecastDashboardRoute;
  forecastDetails: typeof Containers.ForecastDetailsRoute;
  forecastUpdate: typeof Containers.UpdateForecastRoute;
}
