import { BroadcastPageRoute } from "@ui/containers/broadcasts/broadcast.page";
import { AllClaimsDashboardRoute } from "@ui/containers/claims/allClaimsDashboard/allClaimsDashboard.page";
import { ClaimDetailDocumentsRoute } from "@ui/containers/claims/claimDetailDocuments.page";
import { ClaimsDetailsRoute } from "@ui/containers/claims/claimDetails.page";
import { ClaimDocumentsRoute } from "@ui/containers/claims/claimDocuments.page";
import { ClaimForecastRoute } from "@ui/containers/claims/claimForecast.page";
import { ClaimLineItemsRoute, ReviewClaimLineItemsRoute } from "@ui/containers/claims/claimLineItems.page";
import { PrepareClaimRoute } from "@ui/containers/claims/claimPrepare.page";
import { ReviewClaimRoute } from "@ui/containers/claims/claimReview.page";
import { ClaimsDashboardRoute } from "@ui/containers/claims/dashboard.page";
import { EditClaimLineItemsRoute } from "@ui/containers/claims/editClaimLineItems.page";
import { ClaimSummaryRoute } from "@ui/containers/claims/summary.page";
import { DeveloperHomePage } from "@ui/containers/developer/home.page";
import { DeveloperPageCrasherPage } from "@ui/containers/developer/PageCrasher.page";
import { DeveloperPageCrasherForbiddenPage } from "@ui/containers/developer/PageCrasherForbidden.page";
import { DeveloperProjectCreatorPage } from "@ui/containers/developer/ProjectCreator.page";
import { DeveloperUserSwitcherPage } from "@ui/containers/developer/UserSwitcher.page";
import { ErrorNotFoundRoute, ErrorRoute } from "@ui/containers/errors.page";
import { ForecastDashboardRoute } from "@ui/containers/forecasts/forecastDashboard.page";
import { UpdateForecastRoute } from "@ui/containers/forecasts/updateForecast.page";
import { ViewForecastRoute } from "@ui/containers/forecasts/viewForecast.page";
import { LoansSummaryRoute } from "@ui/containers/loans/overview.page";
import { LoansRequestRoute } from "@ui/containers/loans/request.page";
import { MonitoringReportCreateRoute } from "@ui/containers/monitoringReports/create/monitoringReportCreate.page";
import { MonitoringReportDeleteRoute } from "@ui/containers/monitoringReports/delete.page";
import { MonitoringReportDashboardRoute } from "@ui/containers/monitoringReports/monitoringReportDashboard/monitoringReportDashboard.page";
import { MonitoringReportPreparePeriodRoute } from "@ui/containers/monitoringReports/periodStep.page";
import { MonitoringReportWorkflowRoute } from "@ui/containers/monitoringReports/workflow/monitoringReportWorkflow.page";
import { PCRSpendProfileOverheadDocumentRoute } from "@ui/containers/pcrs/addPartner/spendProfile/overheadDocumentContainer.page";
import { PCRSpendProfileCostsSummaryRoute } from "@ui/containers/pcrs/addPartner/spendProfile/spendProfileCostsSummary.page";
import { PCRSpendProfileReviewCostsSummaryRoute } from "@ui/containers/pcrs/addPartner/spendProfile/spendProfileCostsSummaryReview.page";
import { PCRSpendProfileDeleteCostRoute } from "@ui/containers/pcrs/addPartner/spendProfile/spendProfileDeleteCost.page";
import {
  PCRSpendProfileAddCostRoute,
  PCRSpendProfileEditCostRoute,
} from "@ui/containers/pcrs/addPartner/spendProfile/spendProfilePrepareCost.page";
import { ProjectChangeRequestAddTypeRoute } from "@ui/containers/pcrs/addType";
import { PCRCreateRoute } from "@ui/containers/pcrs/create";
import { PCRsDashboardRoute } from "@ui/containers/pcrs/dashboard/PCRDashboard.page";
import { PCRDeleteRoute } from "@ui/containers/pcrs/pcrDelete.page";
import { FinancialVirementDetailsRoute } from "@ui/containers/pcrs/financialVirements/detailsPage";
import { FinancialVirementEditRoute } from "@ui/containers/pcrs/financialVirements/editPage";
import { FinancialVirementEditPartnerLevelRoute } from "@ui/containers/pcrs/financialVirements/editPartnerLevel.page";
import { PCRDetailsRoute } from "@ui/containers/pcrs/overview/projectChangeRequestDetails.page";
import { ProjectChangeRequestPrepareRoute } from "@ui/containers/pcrs/overview/projectChangeRequestPrepare.page";
import { PCRPrepareItemRoute, PCRReviewItemRoute, PCRViewItemRoute } from "@ui/containers/pcrs/pcrItemWorkflow";
import {
  PCRPrepareReasoningRoute,
  PCRReviewReasoningRoute,
  PCRViewReasoningRoute,
} from "@ui/containers/pcrs/reasoning/workflow.page";
import { PCRReviewRoute } from "@ui/containers/pcrs/review";
import { ProjectDashboardRoute } from "@ui/containers/projects/dashboard/Dashboard.page";
import { ProjectDetailsRoute } from "@ui/containers/projects/details/ProjectDetails.page";
import { ProjectDocumentsRoute } from "@ui/containers/projects/documents/projectDocuments.page";
import { FailedBankCheckConfirmationRoute } from "@ui/containers/projects/failedBankCheckConfirmation.page";
import { FinanceSummaryRoute } from "@ui/containers/projects/finance-summary/financeSummary.page";
import { PartnerDetailsRoute } from "@ui/containers/projects/partnerDetails/partnerDetails.page";
import { PartnerDetailsEditRoute } from "@ui/containers/projects/partnerDetails/partnerDetailsEdit.page";
import { ProjectOverviewRoute } from "@ui/containers/projects/projectOverview/projectOverview.page";
import { ProjectSetupRoute } from "@ui/containers/projects/setup/projectSetup.page";
import { ProjectSetupBankDetailsRoute } from "@ui/containers/projects/setup/projectSetupBankDetails.page";
import { ProjectSetupBankDetailsVerifyRoute } from "@ui/containers/projects/setup/projectSetupBankDetailsVerify.page";
import { ProjectSetupBankStatementRoute } from "@ui/containers/projects/setup/projectSetupBankStatement.page";
import { ProjectSetupPartnerPostcodeRoute } from "@ui/containers/projects/setup/projectSetupPartnerPostcode.page";
import { ProjectSetupSpendProfileRoute } from "@ui/containers/projects/setup/projectSetupSpendProfile.page";

export type IRoutes = typeof routeConfig;
export type RouteKeys = keyof IRoutes;

export const routeConfig = {
  allClaimsDashboard: AllClaimsDashboardRoute,
  BroadcastPage: BroadcastPageRoute,
  claimsDashboard: ClaimsDashboardRoute,
  claimDetails: ClaimsDetailsRoute,
  claimDetailDocuments: ClaimDetailDocumentsRoute,
  claimDocuments: ClaimDocumentsRoute,
  claimForecast: ClaimForecastRoute,
  claimLineItems: ClaimLineItemsRoute,
  claimSummary: ClaimSummaryRoute,
  error: ErrorRoute,
  errorNotFound: ErrorNotFoundRoute,
  financeSummary: FinanceSummaryRoute,
  failedBankCheckConfirmation: FailedBankCheckConfirmationRoute,
  home: DeveloperHomePage,
  developerUserSwitcherPage: DeveloperUserSwitcherPage,
  developerProjectCreatorPage: DeveloperProjectCreatorPage,
  developerPageCrasherPage: DeveloperPageCrasherPage,
  developerPageCrasherForbiddenPage: DeveloperPageCrasherForbiddenPage,
  monitoringReportCreate: MonitoringReportCreateRoute,
  monitoringReportDashboard: MonitoringReportDashboardRoute,
  monitoringReportDelete: MonitoringReportDeleteRoute,
  monitoringReportWorkflow: MonitoringReportWorkflowRoute,
  monitoringReportPreparePeriod: MonitoringReportPreparePeriodRoute,
  partnerDetails: PartnerDetailsRoute,
  partnerDetailsEdit: PartnerDetailsEditRoute,
  prepareClaim: PrepareClaimRoute,
  prepareClaimLineItems: EditClaimLineItemsRoute,
  loansSummary: LoansSummaryRoute,
  loansRequest: LoansRequestRoute,
  projectChangeRequestAddType: ProjectChangeRequestAddTypeRoute,
  pcrCreate: PCRCreateRoute,
  pcrDetails: PCRDetailsRoute,
  pcrDelete: PCRDeleteRoute,
  pcrFinancialVirementEditPartnerLevel: FinancialVirementEditPartnerLevelRoute,
  pcrFinancialVirementEditCostCategoryLevel: FinancialVirementEditRoute,
  pcrFinancialVirementDetails: FinancialVirementDetailsRoute,
  pcrPrepare: ProjectChangeRequestPrepareRoute,
  pcrPrepareItem: PCRPrepareItemRoute,
  pcrSpendProfileCostsSummary: PCRSpendProfileCostsSummaryRoute,
  pcrSpendProfileReviewCostsSummary: PCRSpendProfileReviewCostsSummaryRoute,
  pcrPrepareSpendProfileAddCost: PCRSpendProfileAddCostRoute,
  pcrPrepareSpendProfileDeleteCost: PCRSpendProfileDeleteCostRoute,
  pcrPrepareSpendProfileEditCost: PCRSpendProfileEditCostRoute,
  pcrSpendProfileOverheadDocument: PCRSpendProfileOverheadDocumentRoute,
  pcrPrepareReasoning: PCRPrepareReasoningRoute,
  pcrReview: PCRReviewRoute,
  pcrReviewItem: PCRReviewItemRoute,
  pcrReviewReasoning: PCRReviewReasoningRoute,
  pcrViewItem: PCRViewItemRoute,
  pcrViewReasoning: PCRViewReasoningRoute,
  pcrsDashboard: PCRsDashboardRoute,
  projectDashboard: ProjectDashboardRoute,
  projectDetails: ProjectDetailsRoute,
  projectDocuments: ProjectDocumentsRoute,
  projectOverview: ProjectOverviewRoute,
  projectSetup: ProjectSetupRoute,
  projectSetupSpendProfile: ProjectSetupSpendProfileRoute,
  projectSetupBankDetails: ProjectSetupBankDetailsRoute,
  projectSetupPostcode: ProjectSetupPartnerPostcodeRoute,
  projectSetupBankStatement: ProjectSetupBankStatementRoute,
  projectSetupBankDetailsVerify: ProjectSetupBankDetailsVerifyRoute,
  reviewClaim: ReviewClaimRoute,
  reviewClaimLineItems: ReviewClaimLineItemsRoute,
  forecastDashboard: ForecastDashboardRoute,
  viewForecast: ViewForecastRoute,
  forecastUpdate: UpdateForecastRoute,
} as const;

export const getRoutes = () => Object.entries(routeConfig);
