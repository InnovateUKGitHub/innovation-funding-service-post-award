import { BroadcastPageRoute } from "@ui/containers/pages/broadcasts/broadcast.page";
import { AllClaimsDashboardRoute } from "@ui/containers/pages/claims/allClaimsDashboard/allClaimsDashboard.page";
import { ClaimDetailDocumentsRoute } from "@ui/containers/pages/claims/claimDetailDocuments.page";
import { ClaimDocumentsRoute } from "@ui/containers/pages/claims/documents/ClaimDocuments.page";
import { ClaimForecastRoute } from "@ui/containers/pages/claims/forecast/ClaimForecast.page";
import {
  ClaimLineItemsRoute,
  ReviewClaimLineItemsRoute,
} from "@ui/containers/pages/claims/claimLineItems/ViewClaimLineItems.page";
import { EditClaimLineItemsRoute } from "@ui/containers/pages/claims/claimLineItems/EditClaimLineItems.page";
import { ClaimsDashboardRoute } from "@ui/containers/pages/claims/claimDashboard.page";
import { ClaimSummaryRoute } from "@ui/containers/pages/claims/claimSummary.page";
import { DeveloperHomePage } from "@ui/containers/pages/developer/home.page";
import { DeveloperPageCrasherPage } from "@ui/containers/pages/developer/PageCrasher.page";
import { DeveloperPageCrasherForbiddenPage } from "@ui/containers/pages/developer/PageCrasherForbidden.page";
import { DeveloperUserSwitcherPage } from "@ui/containers/pages/developer/UserSwitcher.page";
import { ErrorNotFoundRoute, ErrorRoute } from "@ui/containers/errors.page";
import { ForecastDashboardRoute } from "@ui/containers/pages/forecasts/forecastDashboard.page";
import { UpdateForecastRoute } from "@ui/containers/pages/forecasts/updateForecast.page";
import { ViewForecastRoute } from "@ui/containers/pages/forecasts/viewForecast.page";
import { LoansSummaryRoute } from "@ui/containers/pages/loans/overview.page";
import { LoansRequestRoute } from "@ui/containers/pages/loans/request.page";
import { MonitoringReportCreateRoute } from "@ui/containers/pages/monitoringReports/create/monitoringReportCreate.page";
import { MonitoringReportDeleteRoute } from "@ui/containers/pages/monitoringReports/monitoringReportDelete.page";
import { MonitoringReportDashboardRoute } from "@ui/containers/pages/monitoringReports/monitoringReportDashboard/monitoringReportDashboard.page";
import { MonitoringReportPreparePeriodRoute } from "@ui/containers/pages/monitoringReports/monitoringReportPeriodStep.page";
import { MonitoringReportWorkflowRoute } from "@ui/containers/pages/monitoringReports/workflow/monitoringReportWorkflow.page";
import { PCRSpendProfileOverheadDocumentRoute } from "@ui/containers/pages/pcrs/addPartner/spendProfile/overheadDocumentContainer.page";
import { PCRSpendProfileCostsSummaryRoute } from "@ui/containers/pages/pcrs/addPartner/spendProfile/spendProfileCostsSummary.page";
import { PCRSpendProfileReviewCostsSummaryRoute } from "@ui/containers/pages/pcrs/addPartner/spendProfile/spendProfileCostsSummaryReview.page";
import { PCRSpendProfileDeleteCostRoute } from "@ui/containers/pages/pcrs/addPartner/spendProfile/spendProfileDeleteCost.page";
import {
  PCRSpendProfileAddCostRoute,
  PCRSpendProfileEditCostRoute,
} from "@ui/containers/pages/pcrs/addPartner/spendProfile/spendProfilePrepareCost.page";
import { ProjectChangeRequestAddTypeRoute } from "@ui/containers/pages/pcrs/addType";
import { PCRCreateRoute } from "@ui/containers/pages/pcrs/create";
import { PCRsDashboardRoute } from "@ui/containers/pages/pcrs/dashboard/PCRDashboard.page";
import { PartnerLevelFinancialVirementDetailsRoute } from "@ui/containers/pages/pcrs/financialVirements/CostCategoryLevelFinancialVirementDetails.page";
import { PartnerLevelFinancialVirementRoute } from "@ui/containers/pages/pcrs/financialVirements/edit/costCategory/CostCategoryLevelFinancialVirementEdit.page";
import { FinancialVirementEditPartnerLevelRoute } from "@ui/containers/pages/pcrs/financialVirements/edit/partner/editPartnerLevel.page";
import { PCRDetailsRoute } from "@ui/containers/pages/pcrs/overview/projectChangeRequestDetails.page";
import { ProjectChangeRequestPrepareRoute } from "@ui/containers/pages/pcrs/overview/projectChangeRequestPrepare.page";
import {
  PCRPrepareItemRoute,
  PCRReviewItemRoute,
  PCRViewItemRoute,
} from "@ui/containers/pages/pcrs/pcrItemWorkflowContainer";
import {
  PCRPrepareReasoningRoute,
  PCRReviewReasoningRoute,
  PCRViewReasoningRoute,
} from "@ui/containers/pages/pcrs/reasoning/pcrReasoningWorkflow.page";
import { PCRReviewRoute } from "@ui/containers/pages/pcrs/review";
import { ProjectDashboardRoute } from "@ui/containers/pages/projects/dashboard/Dashboard.page";
import { ProjectDetailsRoute } from "@ui/containers/pages/projects/details/ProjectDetails.page";
import { ProjectDocumentsRoute } from "@ui/containers/pages/projects/documents/projectDocuments.page";
import { FailedBankCheckConfirmationRoute } from "@ui/containers/pages/projects/failedBankCheckConfirmation.page";
import { FinanceSummaryRoute } from "@ui/containers/pages/projects/finance-summary/financeSummary.page";
import { PartnerDetailsRoute } from "@ui/containers/pages/projects/partnerDetails/partnerDetails.page";
import { PartnerDetailsEditRoute } from "@ui/containers/pages/projects/partnerDetails/partnerDetailsEdit.page";
import { ProjectOverviewRoute } from "@ui/containers/pages/projects/projectOverview/projectOverview.page";
import { ProjectSetupRoute } from "@ui/containers/pages/projects/setup/projectSetup.page";
import { ProjectSetupBankDetailsRoute } from "@ui/containers/pages/projects/setup/projectSetupBankDetails.page";
import { ProjectSetupBankDetailsVerifyRoute } from "@ui/containers/pages/projects/setup/projectSetupBankDetailsVerify.page";
import { ProjectSetupBankStatementRoute } from "@ui/containers/pages/projects/setup/projectSetupBankStatement.page";
import { ProjectSetupPartnerPostcodeRoute } from "@ui/containers/pages/projects/setup/projectSetupPartnerPostcode.page";
import { ProjectSetupSpendProfileRoute } from "@ui/containers/pages/projects/setup/projectSetupSpendProfile.page";
import { ClaimsDetailsRoute } from "@ui/containers/pages/claims/claimDetails.page";
import { PrepareClaimRoute } from "@ui/containers/pages/claims/claimPrepare.page";
import { ReviewClaimRoute } from "@ui/containers/pages/claims/review/claimReview.page";
import { PCRDeleteRoute } from "@ui/containers/pages/pcrs/pcrDelete.page";
import { ProjectChangeRequestSubmittedForReviewRoute } from "@ui/containers/pages/pcrs/submitSuccess/ProjectChangeRequestSubmittedForReview.page";
import { ContactSetupAssociateRoute } from "@ui/containers/pages/contact/associate/setup/ContactSetupAssociate.page";

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
  projectChangeRequestSubmittedForReview: ProjectChangeRequestSubmittedForReviewRoute,
  pcrCreate: PCRCreateRoute,
  pcrDetails: PCRDetailsRoute,
  pcrDelete: PCRDeleteRoute,
  pcrFinancialVirementEditPartnerLevel: FinancialVirementEditPartnerLevelRoute,
  pcrFinancialVirementEditCostCategoryLevel: PartnerLevelFinancialVirementRoute,
  pcrFinancialVirementDetails: PartnerLevelFinancialVirementDetailsRoute,
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
  contactSetupAssociate: ContactSetupAssociateRoute,
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
