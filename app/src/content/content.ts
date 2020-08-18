import { ContentBase, ContentResult } from "./contentBase";
import { HomePageContent } from "./pages/homePageContent";
import { ProjectDashboardContent } from "./pages/project/projectDashboardContent";
import { ProjectOverviewContent } from "./pages/project/projectOverviewContent";
import { ProjectDetailsContent } from "./pages/project/projectDetailsContent";
import { ProjectSetupContent } from "@content/pages/project/projectSetupContent";
import { ProjectSetupSpendProfileContent } from "./pages/project/projectSetupSpendProfileContent";
import { FinanceSummaryContent } from "./pages/financeSummaryContent";
import { ProjectDocumentsContent } from "./pages/project/projectDocumentsContent";
import { NotFoundContent, UnexpectedErrorContent } from "./pages/errorsContent";
import { AllClaimsDashboardContent } from "@content/pages/claims/allClaimsDashboardContent";
import { ClaimsDashboardContent } from "@content/pages/claims/claimsDashboardContent";
import { ClaimDocumentsContent } from "@content/pages/claims/claimDocumentsContent";
import { ClaimDetailsContent } from "@content/pages/claims/claimDetailsContent";
import { ClaimPrepareContent } from "@content/pages/claims/claimPrepareContent";
import { ClaimPrepareSummaryContent } from "@content/pages/claims/claimPrepareSummaryContent";
import { ClaimReviewContent } from "@content/pages/claims/claimReviewContent";
import { FinancialVirementSummaryContent } from "./pages/financialVirementSummaryContent";
import { FinancialVirementEditContent } from "./pages/financialVirementEditContent";
import { FinancialVirementEditPartnerLevelContent } from "./pages/financialVirementEditPartnerLevelContent";
import { FinancialVirementDetailsContent } from "./pages/financialVirementDetailsContent";
import { MonitoringReportsDashboardContent } from "./pages/monitoringReports/monitoringReportsDashboardContent";
import { MonitoringReportsCreateContent } from "./pages/monitoringReports/monitoringReportsCreateContent";
import { MonitoringReportsDeleteContent } from "./pages/monitoringReports/monitoringReportsDeleteContent";
import { MonitoringReportsSummaryContent } from "./pages/monitoringReports/monitoringReportsSummaryContent";
import { MonitoringReportsWorkflowContent } from "./pages/monitoringReports/monitoringReportsWorkflowContent";
import { MonitoringReportsPeriodStepContent } from "./pages/monitoringReports/monitoringReportsPeriodStepContent";
import { MonitoringReportsQuestionStepContent } from "./pages/monitoringReports/monitoringReportsQuestionStep";
import { PartnerDetailsContent } from "./pages/partners/partnerDetailsContent";
import { PartnerDetailsEditContent } from "./pages/partners/partnerDetailsEditContent";
import { PCRCreateContent } from "./pages/pcrs/pcrCreateContent";
import { PCRAddPartnerRoleAndOrganisationContent } from "./pages/pcrs/addPartner/roleAndOrganisationStepContent";
import { DocumentsContent } from "@content/components/documentsContent";
import { PcrSpendProfileCostsSummaryContent } from "@content/pages/pcrSpendProfiles/spendProfileCostsSummaryContent";
import { PcrSpendProfilePrepareCostContent } from "@content/pages/pcrSpendProfiles/spendProfilePrepareCostContent";
import { PcrSpendProfileDeleteCostContent } from "./pages/pcrSpendProfiles/spendProfileDeleteCostContent";
import { PCRPeriodLengthChangeContent } from "@content/pages/pcrs/periodLengthChangeContent";
import { TaskListContent } from "@content/components/taskListContent";
import { PCRAddPartnerAwardRateContent } from "@content/pages/pcrs/addPartner/awardRateStepContent";
import { PCRAddPartnerOtherFundingContent } from "@content/pages/pcrs/addPartner/otherFundingStepContent";
import { PcrSpendProfileOverheadDocumentContent } from "./pages/pcrSpendProfiles/overheadDocumentContainerContent";
import { ClaimForecastContent } from "./pages/claims/claimForecastContent";
import { PCRAddPartnerAcademicCostsContent } from "@content/pages/pcrs/addPartner/academicCostsStepContent";
import { PCRAddPartnerStateAidEligibilityContent } from "@content/pages/pcrs/addPartner/stateAidEligibilityStepContent";
import { PCRAddPartnerSummaryContent } from "./pages/pcrs/addPartner/addPartnerSummaryContent";
import { PCRAddPartnerOtherFundingSourcesContent } from "@content/pages/pcrs/addPartner/otherFundingSourcesContent";
import { ProjectSetupBankDetailsContent } from "@content/pages/project/projectSetupBankDetailsContent";
import { FailedBankCheckConfirmationContent } from "./pages/project/failedBankCheckConfirmationContent";
import { ProjectSetupBankDetailsVerifyContent } from "@content/pages/project/projectSetupBankDetailsVerifyContent";
import { ProjectSetupBankStatementContent } from "@content/pages/project/projectSetupBankStatementContent";
import { PCRAddPartnerProjectLocationContent } from "./pages/pcrs/addPartner/projectLocationStepContent";
import { PCRAddPartnerAgreementToPCRContent } from "./pages/pcrs/addPartner/agreementToPcrStepContent";
import { ClaimDetailDocumentsContent } from "./pages/claims/claimDetailDocumentsContent";
import { EditClaimLineItemsContent } from "./pages/claims/editClaimLineItemsContent";
import { ForecastsDashboardContent } from "./pages/forecasts/dashboardContent";
import { ForecastsDetailsContent } from "./pages/forecasts/detailsContent";
import { ForecastsUpdateContent } from "./pages/forecasts/updateContent";
import { ProjectDto } from "@framework/dtos";

export type ContentSelector = (content: Content) => ContentResult;

export class Content extends ContentBase {
  public readonly projectsDashboard: ProjectDashboardContent;
  public readonly home: HomePageContent;

  public readonly projectSetup: ProjectSetupContent;
  public readonly projectOverview: ProjectOverviewContent;
  public readonly projectDetails: ProjectDetailsContent;
  public readonly projectDocuments: ProjectDocumentsContent;
  public readonly projectSetupSpendProfile: ProjectSetupSpendProfileContent;
  public readonly failedBankCheckConfirmation: FailedBankCheckConfirmationContent;
  public readonly projectSetupBankDetails: ProjectSetupBankDetailsContent;
  public readonly projectSetupBankStatement: ProjectSetupBankStatementContent;
  public readonly projectSetupBankDetailsVerify: ProjectSetupBankDetailsVerifyContent;

  public readonly financeSummary: FinanceSummaryContent;

  public readonly allClaimsDashboard: AllClaimsDashboardContent;
  public readonly claimsDashboard: ClaimsDashboardContent;
  public readonly claimDocuments: ClaimDocumentsContent;
  public readonly claimDetails: ClaimDetailsContent;
  public readonly claimDetailDocuments: ClaimDetailDocumentsContent;
  public readonly claimForecast: ClaimForecastContent;
  public readonly editClaimLineItems: EditClaimLineItemsContent;
  public readonly claimPrepare: ClaimPrepareContent;
  public readonly claimPrepareSummary: ClaimPrepareSummaryContent;
  public readonly claimReview: ClaimReviewContent;

  public readonly financialVirementSummary: FinancialVirementSummaryContent;
  public readonly financialVirementEdit: FinancialVirementEditContent;
  public readonly financialVirementEditPartnerLevel: FinancialVirementEditPartnerLevelContent;
  public readonly financialVirementDetails: FinancialVirementDetailsContent;

  public readonly forecastsDashboard: ForecastsDashboardContent;
  public readonly forecastsDetails: ForecastsDetailsContent;
  public readonly forecastsUpdate: ForecastsUpdateContent;

  public readonly monitoringReportsDashboard: MonitoringReportsDashboardContent;
  public readonly monitoringReportsCreate: MonitoringReportsCreateContent;
  public readonly monitoringReportsDelete: MonitoringReportsDeleteContent;
  public readonly monitoringReportsSummary: MonitoringReportsSummaryContent;
  public readonly monitoringReportsWorkflow: MonitoringReportsWorkflowContent;
  public readonly monitoringReportsPeriodStep: MonitoringReportsPeriodStepContent;
  public readonly monitoringReportsQuestionStep: MonitoringReportsQuestionStepContent;

  public readonly partnerDetails: PartnerDetailsContent;
  public readonly partnerDetailsEdit: PartnerDetailsEditContent;

  public readonly pcrCreate: PCRCreateContent;

  public readonly pcrPeriodLengthChangeContent: PCRPeriodLengthChangeContent;
  public readonly pcrAddPartnerRoleAndOrganisation: PCRAddPartnerRoleAndOrganisationContent;
  public readonly pcrAddPartnerStateAidEligibilityContent: PCRAddPartnerStateAidEligibilityContent;
  public readonly pcrAddPartnerOtherFunding: PCRAddPartnerOtherFundingContent;
  public readonly pcrAddPartnerAwardRate: PCRAddPartnerAwardRateContent;
  public readonly pcrAddPartnerOtherFundingSources: PCRAddPartnerOtherFundingSourcesContent;
  public readonly pcrAddPartnerAcademicCosts: PCRAddPartnerAcademicCostsContent;
  public readonly pcrAddPartnerProjectLocationContent: PCRAddPartnerProjectLocationContent;
  public readonly pcrAddPartnerAgreementToPcr: PCRAddPartnerAgreementToPCRContent;
  public readonly pcrAddPartnerSummary: PCRAddPartnerSummaryContent;
  public readonly pcrSpendProfileCostsSummaryContent: PcrSpendProfileCostsSummaryContent;
  public readonly pcrSpendProfilePrepareCostContent: PcrSpendProfilePrepareCostContent;
  public readonly pcrSpendProfileDeleteCostContent: PcrSpendProfileDeleteCostContent;
  public readonly pcrSpendProfileOverheadDocumentContent: PcrSpendProfileOverheadDocumentContent;

  public readonly errors: {
    notfound: NotFoundContent,
    unexpected: UnexpectedErrorContent
  };

  public readonly components: {
    documents: DocumentsContent,
    taskList: TaskListContent,
  };

  constructor(protected project: ProjectDto | null | undefined) {
    super(null, null);
    this.projectsDashboard = new ProjectDashboardContent(this, project);
    this.home = new HomePageContent(this, project);

    this.projectSetup = new ProjectSetupContent(this, project);
    this.projectOverview = new ProjectOverviewContent(this, project);
    this.projectDetails = new ProjectDetailsContent(this, project);
    this.projectDocuments = new ProjectDocumentsContent(this, project);
    this.projectSetupSpendProfile = new ProjectSetupSpendProfileContent(this, project);
    this.failedBankCheckConfirmation = new FailedBankCheckConfirmationContent(this, project);
    this.projectSetupBankDetails = new ProjectSetupBankDetailsContent(this, project);
    this.projectSetupBankStatement = new ProjectSetupBankStatementContent(this, project);
    this.projectSetupBankDetailsVerify = new ProjectSetupBankDetailsVerifyContent(this, project);

    this.financeSummary = new FinanceSummaryContent(this, project);

    this.allClaimsDashboard = new AllClaimsDashboardContent(this, project);
    this.claimsDashboard = new ClaimsDashboardContent(this, project);
    this.claimDocuments = new ClaimDocumentsContent(this, project);
    this.claimDetails = new ClaimDetailsContent(this, project);
    this.claimDetailDocuments = new ClaimDetailDocumentsContent(this, project);
    this.claimForecast = new ClaimForecastContent(this, project);
    this.editClaimLineItems = new EditClaimLineItemsContent(this, project);
    this.claimPrepare = new ClaimPrepareContent(this, project);
    this.claimPrepareSummary = new ClaimPrepareSummaryContent(this, project);
    this.claimReview = new ClaimReviewContent(this, project);

    this.financialVirementSummary = new FinancialVirementSummaryContent(this, project);
    this.financialVirementEdit = new FinancialVirementEditContent(this, project);
    this.financialVirementEditPartnerLevel = new FinancialVirementEditPartnerLevelContent(this, project);
    this.financialVirementDetails = new FinancialVirementDetailsContent(this, project);

    this.forecastsDashboard = new ForecastsDashboardContent(this, project);
    this.forecastsDetails = new ForecastsDetailsContent(this, project);
    this.forecastsUpdate = new ForecastsUpdateContent(this, project);

    this.monitoringReportsDashboard = new MonitoringReportsDashboardContent(this, project);
    this.monitoringReportsCreate = new MonitoringReportsCreateContent(this, project);
    this.monitoringReportsDelete = new MonitoringReportsDeleteContent(this, project);
    this.monitoringReportsSummary = new MonitoringReportsSummaryContent(this, project);
    this.monitoringReportsWorkflow = new MonitoringReportsWorkflowContent(this, project);
    this.monitoringReportsPeriodStep = new MonitoringReportsPeriodStepContent(this, project);
    this.monitoringReportsQuestionStep = new MonitoringReportsQuestionStepContent(this, project);

    this.partnerDetails = new PartnerDetailsContent(this, project);
    this.partnerDetailsEdit = new PartnerDetailsEditContent(this, project);

    this.pcrCreate = new PCRCreateContent(this, project);

    this.pcrPeriodLengthChangeContent = new PCRPeriodLengthChangeContent(this, project);
    this.pcrAddPartnerRoleAndOrganisation = new PCRAddPartnerRoleAndOrganisationContent(this, project);
    this.pcrAddPartnerStateAidEligibilityContent = new PCRAddPartnerStateAidEligibilityContent(this, project);
    this.pcrAddPartnerOtherFunding = new PCRAddPartnerOtherFundingContent(this, project);
    this.pcrAddPartnerAwardRate = new PCRAddPartnerAwardRateContent(this, project);
    this.pcrAddPartnerOtherFundingSources = new PCRAddPartnerOtherFundingSourcesContent(this, project);
    this.pcrAddPartnerAcademicCosts = new PCRAddPartnerAcademicCostsContent(this, project);
    this.pcrAddPartnerProjectLocationContent = new PCRAddPartnerProjectLocationContent(this, project);
    this.pcrAddPartnerAgreementToPcr = new PCRAddPartnerAgreementToPCRContent(this, project);
    this.pcrAddPartnerSummary = new PCRAddPartnerSummaryContent(this, project);
    this.pcrSpendProfileCostsSummaryContent = new PcrSpendProfileCostsSummaryContent(this, project);
    this.pcrSpendProfilePrepareCostContent = new PcrSpendProfilePrepareCostContent(this, project);
    this.pcrSpendProfileDeleteCostContent = new PcrSpendProfileDeleteCostContent(this, project);
    this.pcrSpendProfileOverheadDocumentContent = new PcrSpendProfileOverheadDocumentContent(this, project);

    this.errors = {
      notfound: new NotFoundContent(this, project),
      unexpected: new UnexpectedErrorContent(this, project)
    };
    this.components = {
      documents: new DocumentsContent(this, project),
      taskList: new TaskListContent(this, project),
    };
  }
}
