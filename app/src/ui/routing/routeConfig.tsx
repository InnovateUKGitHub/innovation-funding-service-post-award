import * as Containers from "@ui/containers";

export type RouteKeys = keyof typeof routeConfig;

export const routeConfig: IRoutes = {
  allClaimsDashboard: Containers.AllClaimsDashboardRoute,
  claimsDashboard: Containers.ClaimsDashboardRoute,
  claimDetails: Containers.ClaimsDetailsRoute,
  claimDetailDocuments: Containers.ClaimDetailDocumentsRoute,
  claimDocuments: Containers.ClaimDocumentsRoute,
  claimForecast: Containers.ClaimForecastRoute,
  claimLineItems: Containers.ClaimLineItemsRoute,
  claimSummary: Containers.ClaimSummaryRoute,
  error: Containers.ErrorRoute,
  financeSummary: Containers.FinanceSummaryRoute,
  home: Containers.HomeRoute,
  monitoringReportCreate: Containers.MonitoringReportCreateRoute,
  monitoringReportDashboard: Containers.MonitoringReportDashboardRoute,
  monitoringReportDelete: Containers.MonitoringReportDeleteRoute,
  monitoringReportWorkflow: Containers.MonitoringReportWorkflowRoute,
  monitoringReportPreparePeriod: Containers.MonitoringReportPreparePeriodRoute,
  prepareClaim: Containers.PrepareClaimRoute,
  prepareClaimLineItems: Containers.EditClaimLineItemsRoute,
  projectChangeRequests: Containers.ProjectChangeRequestsRoute,
  ProjectChangeRequestAddType: Containers.ProjectChangeRequestAddTypeRoute,
  pcrCreate: Containers.PCRCreateRoute,
  pcrDetails: Containers.PCRDetailsRoute,
  pcrDelete: Containers.PCRDeleteRoute,
  pcrFinancialVirementEdit: Containers.FinancialVirementEditRoute,
  pcrFinancialVirementDetails: Containers.FinancialVirementDetailsRoute,
  pcrPrepare: Containers.ProjectChangeRequestPrepareRoute,
  pcrPrepareItem: Containers.PCRPrepareItemRoute,
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
  claimDocuments: typeof Containers.ClaimDocumentsRoute;
  claimForecast: typeof Containers.ClaimForecastRoute;
  claimLineItems: typeof Containers.ClaimLineItemsRoute;
  claimSummary: typeof Containers.ClaimSummaryRoute;
  error: typeof Containers.ErrorRoute;
  financeSummary: typeof Containers.FinanceSummaryRoute;
  home: typeof Containers.HomeRoute;
  monitoringReportCreate: typeof Containers.MonitoringReportCreateRoute;
  monitoringReportDashboard: typeof Containers.MonitoringReportDashboardRoute;
  monitoringReportDelete: typeof Containers.MonitoringReportDeleteRoute;
  monitoringReportWorkflow: typeof Containers.MonitoringReportWorkflowRoute;
  monitoringReportPreparePeriod: typeof Containers.MonitoringReportPreparePeriodRoute;
  prepareClaim: typeof Containers.PrepareClaimRoute;
  prepareClaimLineItems: typeof Containers.EditClaimLineItemsRoute;
  projectChangeRequests: typeof Containers.ProjectChangeRequestsRoute;
  ProjectChangeRequestAddType: typeof Containers.ProjectChangeRequestAddTypeRoute;
  pcrCreate: typeof Containers.PCRCreateRoute;
  pcrDetails: typeof Containers.PCRDetailsRoute;
  pcrDelete: typeof Containers.PCRDeleteRoute;
  pcrFinancialVirementEdit: typeof Containers.FinancialVirementEditRoute;
  pcrFinancialVirementDetails: typeof Containers.FinancialVirementDetailsRoute;
  pcrPrepare: typeof Containers.ProjectChangeRequestPrepareRoute;
  pcrPrepareItem: typeof Containers.PCRPrepareItemRoute;
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
