import { ContentBase, ContentResult } from "./contentBase";

// General
import { HeaderContent } from "./general-content/HeaderContent";
import { FooterContent } from "./general-content/FooterContent";

// Pages
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
import { FinancialVirementSummaryContent } from "./pages/pcrs/financialVirements/financialVirementSummaryContent";
import { FinancialVirementEditContent } from "./pages/pcrs/financialVirements/financialVirementEditContent";
import { FinancialVirementEditPartnerLevelContent } from "./pages/pcrs/financialVirements/financialVirementEditPartnerLevelContent";
import { FinancialVirementDetailsContent } from "./pages/pcrs/financialVirements/financialVirementDetailsContent";
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
import { ClaimDetailDocumentsContent } from "./pages/claims/claimDetailDocumentsContent";
import { EditClaimLineItemsContent } from "./pages/claims/editClaimLineItemsContent";
import { ForecastsComponentsContent } from "./pages/forecasts/forecastComponents";
import { ForecastsDashboardContent } from "./pages/forecasts/dashboardContent";
import { ForecastsDetailsContent } from "./pages/forecasts/detailsContent";
import { ForecastsUpdateContent } from "./pages/forecasts/updateContent";
import { PCRAddPartnerProjectLocationContent } from "./pages/pcrs/addPartner/projectLocationStepContent";
import { PCRAddPartnerAgreementToPCRContent } from "./pages/pcrs/addPartner/agreementToPcrStepContent";
import { PCRAddPartnerAcademicOrganisationContent } from "./pages/pcrs/addPartner/academicOrganisationStepContent";
import { PCRAddPartnerCompanyHouseContent } from "./pages/pcrs/addPartner/companyHouseStepContent";
import { PCRAddPartnerProjectContactsContent } from "./pages/pcrs/addPartner/projectContactsStepContent";
import { PCRAddPartnerFinanceDetailsContent } from "./pages/pcrs/addPartner/financeDetailsStepContent";
import { PCRAddPartnerOrganisationDetailsContent } from "./pages/pcrs/addPartner/organisationDetailsStepContent";
import { PCRAddPartnerSpendProfileContent } from "./pages/pcrs/addPartner/spendProfileStepContent";
import { PCRAddPartnerJeSContent } from "./pages/pcrs/addPartner/jeSStepContent";
import { PCRNameChangeContent } from "./pages/pcrs/nameChange/nameChangeStepContent";
import { PCRNameChangePrepareItemFilesContent } from "./pages/pcrs/nameChange/prepareItemFilesStepContent";
import { PCRNameChangeSummaryContent } from "./pages/pcrs/nameChange/summaryContent";
import { PCRReasoningPrepareFilesContent } from "./pages/pcrs/reasoning/prepareFilesStepContent";
import { PCRReasoningPrepareReasoningContent } from "./pages/pcrs/reasoning/prepareReasonStepContent";
import { PCRReasoningSummaryContent } from "./pages/pcrs/reasoning/summaryContent";
import { PCRReasoningWorkflowContent } from "./pages/pcrs/reasoning/workflowContent";
import { PCRPrepareItemFilesForPartnerWithrawelContent } from "./pages/pcrs/removePartner/prepareItemFilesForPartnerWithdrawelStepContent";
import { PCRRemovePartnerContent } from "./pages/pcrs/removePartner/removePartnerStepContent";
import { PCRRemovePartnerSummaryContent } from "./pages/pcrs/removePartner/removePartnerSummaryContent";
import { PCRScopeChangeProjectSummaryChangeContent } from "./pages/pcrs/scopeChange/scopeChangeProjectSummaryChangeStepContent";
import { PCRScopeChangePublicDescriptionChangeContent } from "./pages/pcrs/scopeChange/scopeChangePublicDescriptionChangeStepContent";
import { PCRScopeChangeSummaryContent } from "./pages/pcrs/scopeChange/scopeChangeSummaryContent";

import { ValidationSummaryContent } from "@content/components/validationSummaryContent";
import { ErrorSummaryContent } from "@content/components/errorSummaryContent";
import { StandardErrorPageContent } from "./components/standardErrorPageContent";
import { NotFoundErrorPageContent } from "./components/notFoundErrorPageContent";
import { LogsContent } from "./components/logsContent";
import { LoadingContent } from "./components/loadingContent";
import { DocumentSingleContent } from "./components/documentSingleContent";
import { DocumentGuidanceContent } from "./components/documentGuidanceContent";
import { ClaimLastModifiedContent } from "./components/claimLastModifiedContent";
import { ClaimWindowContent } from "./components/claimWindowContent";
import { ForecastTableContent } from "./components/forecastTableContent";
import { ReportFormContent } from "./components/reportFormContent";
import { ForecastDetailsContent } from "./components/forecastDetailsContent";
import { WarningContent } from "./components/warningContent";
import { OnHoldContent } from "./components/onHoldContent";
import { ClaimDetailsLinkContent } from "./components/claimDetailsLinkContent";
import { PhaseBannerContent } from "./components/phaseBannerContent";
import { PCRTimeExtensionStepContent } from "./pages/pcrs/pcrTimeExtensionStepContent";
import { ClaimLineItemsContent } from "./pages/claims/claimLineItemsContent";
import { ClaimsComponentsContent } from "./pages/claims/components/claimsComponentsContent";

export type ContentSelector = (content: Content) => ContentResult;

export class Content extends ContentBase {
  public readonly header: HeaderContent;
  public readonly footer: FooterContent;
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

  public readonly claimsComponents: ClaimsComponentsContent;
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
  public readonly claimLineItems: ClaimLineItemsContent;

  public readonly financialVirementSummary: FinancialVirementSummaryContent;
  public readonly financialVirementEdit: FinancialVirementEditContent;
  public readonly financialVirementEditPartnerLevel: FinancialVirementEditPartnerLevelContent;
  public readonly financialVirementDetails: FinancialVirementDetailsContent;

  public readonly forecastsComponents: ForecastsComponentsContent;
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
  public readonly pcrTimeExtensionStepContent: PCRTimeExtensionStepContent;

  public readonly pcrPeriodLengthChangeContent: PCRPeriodLengthChangeContent;
  public readonly pcrAddPartnerRoleAndOrganisation: PCRAddPartnerRoleAndOrganisationContent;
  public readonly pcrAddPartnerStateAidEligibilityContent: PCRAddPartnerStateAidEligibilityContent;
  public readonly pcrAddPartnerOtherFunding: PCRAddPartnerOtherFundingContent;
  public readonly pcrAddPartnerAwardRate: PCRAddPartnerAwardRateContent;
  public readonly pcrAddPartnerOtherFundingSources: PCRAddPartnerOtherFundingSourcesContent;
  public readonly pcrAddPartnerAcademicCosts: PCRAddPartnerAcademicCostsContent;
  public readonly pcrAddPartnerAcademicOrganisation: PCRAddPartnerAcademicOrganisationContent;
  public readonly pcrAddPartnerCompanyHouse: PCRAddPartnerCompanyHouseContent;
  public readonly pcrAddPartnerProjectContacts: PCRAddPartnerProjectContactsContent;
  public readonly pcrAddPartnerFinanceDetails: PCRAddPartnerFinanceDetailsContent;
  public readonly pcrAddPartnerJeS: PCRAddPartnerJeSContent;
  public readonly pcrAddPartnerOrganisationDetails: PCRAddPartnerOrganisationDetailsContent;
  public readonly pcrAddPartnerSpendProfile: PCRAddPartnerSpendProfileContent;
  public readonly pcrAddPartnerProjectLocationContent: PCRAddPartnerProjectLocationContent;
  public readonly pcrAddPartnerAgreementToPcr: PCRAddPartnerAgreementToPCRContent;
  public readonly pcrAddPartnerSummary: PCRAddPartnerSummaryContent;
  public readonly pcrSpendProfileCostsSummaryContent: PcrSpendProfileCostsSummaryContent;
  public readonly pcrSpendProfilePrepareCostContent: PcrSpendProfilePrepareCostContent;
  public readonly pcrSpendProfileDeleteCostContent: PcrSpendProfileDeleteCostContent;
  public readonly pcrSpendProfileOverheadDocumentContent: PcrSpendProfileOverheadDocumentContent;

  public readonly pcrNameChange: PCRNameChangeContent;
  public readonly pcrNameChangePrepareItemFiles: PCRNameChangePrepareItemFilesContent;
  public readonly pcrNameChangeSummary: PCRNameChangeSummaryContent;

  public readonly pcrReasoningPrepareFiles: PCRReasoningPrepareFilesContent;
  public readonly pcrPrepareReasoning: PCRReasoningPrepareReasoningContent;
  public readonly pcrReasoningSummary: PCRReasoningSummaryContent;
  public readonly pcrReasoningWorkflow: PCRReasoningWorkflowContent;

  public readonly pcrRemovePartnerPrepareItemFiles: PCRPrepareItemFilesForPartnerWithrawelContent;
  public readonly pcrRemovePartner: PCRRemovePartnerContent;
  public readonly pcrRemovePartnerSummary: PCRRemovePartnerSummaryContent;

  public readonly pcrScopeChangeProjectSummaryChange: PCRScopeChangeProjectSummaryChangeContent;
  public readonly pcrScopeChangePublicDescriptionChange: PCRScopeChangePublicDescriptionChangeContent;
  public readonly pcrScopeChangeSummary: PCRScopeChangeSummaryContent;

  public readonly errors: {
    notfound: NotFoundContent;
    unexpected: UnexpectedErrorContent;
  };

  public readonly components: {
    documents: DocumentsContent;
    taskList: TaskListContent;
    validationSummary: ValidationSummaryContent;
    errorSummary: ErrorSummaryContent;
    standardErrorPage: StandardErrorPageContent;
    notFoundErrorPage: NotFoundErrorPageContent;
    logs: LogsContent;
    loading: LoadingContent;
    documentSingle: DocumentSingleContent;
    documentGuidance: DocumentGuidanceContent;
    claimLastModified: ClaimLastModifiedContent;
    claimWindow: ClaimWindowContent;
    forecastTable: ForecastTableContent;
    reportForm: ReportFormContent;
    forecastDetails: ForecastDetailsContent;
    warningContent: WarningContent;
    onHoldContent: OnHoldContent;
    claimDetailsLinkContent: ClaimDetailsLinkContent;
    phaseBannerContent: PhaseBannerContent;
  };

  constructor(protected competitionType?: string) {
    super(null, null);

    this.header = new HeaderContent(this);
    this.footer = new FooterContent(this);

    this.projectsDashboard = new ProjectDashboardContent(this, competitionType);
    this.home = new HomePageContent(this, competitionType);

    this.projectSetup = new ProjectSetupContent(this, competitionType);
    this.projectOverview = new ProjectOverviewContent(this, competitionType);
    this.projectDetails = new ProjectDetailsContent(this, competitionType);
    this.projectDocuments = new ProjectDocumentsContent(this, competitionType);
    this.projectSetupSpendProfile = new ProjectSetupSpendProfileContent(this, competitionType);
    this.failedBankCheckConfirmation = new FailedBankCheckConfirmationContent(this, competitionType);
    this.projectSetupBankDetails = new ProjectSetupBankDetailsContent(this, competitionType);
    this.projectSetupBankStatement = new ProjectSetupBankStatementContent(this, competitionType);
    this.projectSetupBankDetailsVerify = new ProjectSetupBankDetailsVerifyContent(this, competitionType);

    this.financeSummary = new FinanceSummaryContent(this, competitionType);

    this.claimsComponents = new ClaimsComponentsContent(this, competitionType);
    this.allClaimsDashboard = new AllClaimsDashboardContent(this, competitionType);
    this.claimsDashboard = new ClaimsDashboardContent(this, competitionType);
    this.claimDocuments = new ClaimDocumentsContent(this, competitionType);
    this.claimDetails = new ClaimDetailsContent(this, competitionType);
    this.claimDetailDocuments = new ClaimDetailDocumentsContent(this, competitionType);
    this.claimForecast = new ClaimForecastContent(this, competitionType);
    this.editClaimLineItems = new EditClaimLineItemsContent(this, competitionType);
    this.claimPrepare = new ClaimPrepareContent(this, competitionType);
    this.claimPrepareSummary = new ClaimPrepareSummaryContent(this, competitionType);
    this.claimReview = new ClaimReviewContent(this, competitionType);
    this.claimLineItems = new ClaimLineItemsContent(this, competitionType);

    this.financialVirementSummary = new FinancialVirementSummaryContent(this, competitionType);
    this.financialVirementEdit = new FinancialVirementEditContent(this, competitionType);
    this.financialVirementEditPartnerLevel = new FinancialVirementEditPartnerLevelContent(this, competitionType);
    this.financialVirementDetails = new FinancialVirementDetailsContent(this, competitionType);

    this.forecastsComponents = new ForecastsComponentsContent(this);
    this.forecastsDashboard = new ForecastsDashboardContent(this, competitionType);
    this.forecastsDetails = new ForecastsDetailsContent(this, competitionType);
    this.forecastsUpdate = new ForecastsUpdateContent(this, competitionType);

    this.monitoringReportsDashboard = new MonitoringReportsDashboardContent(this, competitionType);
    this.monitoringReportsCreate = new MonitoringReportsCreateContent(this, competitionType);
    this.monitoringReportsDelete = new MonitoringReportsDeleteContent(this, competitionType);
    this.monitoringReportsSummary = new MonitoringReportsSummaryContent(this, competitionType);
    this.monitoringReportsWorkflow = new MonitoringReportsWorkflowContent(this, competitionType);
    this.monitoringReportsPeriodStep = new MonitoringReportsPeriodStepContent(this, competitionType);
    this.monitoringReportsQuestionStep = new MonitoringReportsQuestionStepContent(this, competitionType);

    this.partnerDetails = new PartnerDetailsContent(this, competitionType);
    this.partnerDetailsEdit = new PartnerDetailsEditContent(this, competitionType);

    this.pcrCreate = new PCRCreateContent(this, competitionType);

    this.pcrTimeExtensionStepContent = new PCRTimeExtensionStepContent(this, competitionType);

    this.pcrPeriodLengthChangeContent = new PCRPeriodLengthChangeContent(this, competitionType);
    this.pcrAddPartnerRoleAndOrganisation = new PCRAddPartnerRoleAndOrganisationContent(this, competitionType);
    this.pcrAddPartnerStateAidEligibilityContent = new PCRAddPartnerStateAidEligibilityContent(this, competitionType);
    this.pcrAddPartnerOtherFunding = new PCRAddPartnerOtherFundingContent(this, competitionType);
    this.pcrAddPartnerAwardRate = new PCRAddPartnerAwardRateContent(this, competitionType);
    this.pcrAddPartnerOtherFundingSources = new PCRAddPartnerOtherFundingSourcesContent(this, competitionType);
    this.pcrAddPartnerAcademicCosts = new PCRAddPartnerAcademicCostsContent(this, competitionType);
    this.pcrAddPartnerAcademicOrganisation = new PCRAddPartnerAcademicOrganisationContent(this, competitionType);
    this.pcrAddPartnerCompanyHouse = new PCRAddPartnerCompanyHouseContent(this, competitionType);
    this.pcrAddPartnerProjectContacts = new PCRAddPartnerProjectContactsContent(this, competitionType);
    this.pcrAddPartnerFinanceDetails = new PCRAddPartnerFinanceDetailsContent(this, competitionType);
    this.pcrAddPartnerJeS = new PCRAddPartnerJeSContent(this, competitionType);
    this.pcrAddPartnerOrganisationDetails = new PCRAddPartnerOrganisationDetailsContent(this, competitionType);
    this.pcrAddPartnerSpendProfile = new PCRAddPartnerSpendProfileContent(this, competitionType);
    this.pcrAddPartnerProjectLocationContent = new PCRAddPartnerProjectLocationContent(this, competitionType);
    this.pcrAddPartnerAgreementToPcr = new PCRAddPartnerAgreementToPCRContent(this, competitionType);
    this.pcrAddPartnerSummary = new PCRAddPartnerSummaryContent(this, competitionType);
    this.pcrSpendProfileCostsSummaryContent = new PcrSpendProfileCostsSummaryContent(this, competitionType);
    this.pcrSpendProfilePrepareCostContent = new PcrSpendProfilePrepareCostContent(this, competitionType);
    this.pcrSpendProfileDeleteCostContent = new PcrSpendProfileDeleteCostContent(this, competitionType);
    this.pcrSpendProfileOverheadDocumentContent = new PcrSpendProfileOverheadDocumentContent(this, competitionType);

    this.pcrNameChange = new PCRNameChangeContent(this, competitionType);
    this.pcrNameChangePrepareItemFiles = new PCRNameChangePrepareItemFilesContent(this, competitionType);
    this.pcrNameChangeSummary = new PCRNameChangeSummaryContent(this, competitionType);

    this.pcrReasoningPrepareFiles = new PCRReasoningPrepareFilesContent(this, competitionType);
    this.pcrPrepareReasoning = new PCRReasoningPrepareReasoningContent(this, competitionType);
    this.pcrReasoningSummary = new PCRReasoningSummaryContent(this, competitionType);
    this.pcrReasoningWorkflow = new PCRReasoningWorkflowContent(this, competitionType);

    this.pcrRemovePartnerPrepareItemFiles = new PCRPrepareItemFilesForPartnerWithrawelContent(this, competitionType);
    this.pcrRemovePartner = new PCRRemovePartnerContent(this, competitionType);
    this.pcrRemovePartnerSummary = new PCRRemovePartnerSummaryContent(this, competitionType);

    this.pcrScopeChangeProjectSummaryChange = new PCRScopeChangeProjectSummaryChangeContent(this, competitionType);
    this.pcrScopeChangePublicDescriptionChange = new PCRScopeChangePublicDescriptionChangeContent(
      this,
      competitionType,
    );
    this.pcrScopeChangeSummary = new PCRScopeChangeSummaryContent(this, competitionType);

    this.errors = {
      notfound: new NotFoundContent(this, competitionType),
      unexpected: new UnexpectedErrorContent(this, competitionType),
    };
    this.components = {
      documents: new DocumentsContent(this, competitionType),
      taskList: new TaskListContent(this, competitionType),
      validationSummary: new ValidationSummaryContent(this, competitionType),
      errorSummary: new ErrorSummaryContent(this, competitionType),
      standardErrorPage: new StandardErrorPageContent(this, competitionType),
      notFoundErrorPage: new NotFoundErrorPageContent(this, competitionType),
      logs: new LogsContent(this, competitionType),
      loading: new LoadingContent(this, competitionType),
      documentSingle: new DocumentSingleContent(this, competitionType),
      documentGuidance: new DocumentGuidanceContent(this, competitionType),
      claimLastModified: new ClaimLastModifiedContent(this, competitionType),
      claimWindow: new ClaimWindowContent(this, competitionType),
      forecastTable: new ForecastTableContent(this, competitionType),
      reportForm: new ReportFormContent(this, competitionType),
      forecastDetails: new ForecastDetailsContent(this, competitionType),
      warningContent: new WarningContent(this, competitionType),
      onHoldContent: new OnHoldContent(this, competitionType),
      claimDetailsLinkContent: new ClaimDetailsLinkContent(this, competitionType),
      phaseBannerContent: new PhaseBannerContent(this, competitionType),
    };
  }
}
