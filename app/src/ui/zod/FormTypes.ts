enum FormTypes {
  // MSP Document Share page
  ProjectLevelDelete = "projectLevelDelete",
  PartnerLevelDelete = "partnerLevelDelete",
  ProjectLevelUpload = "projectLevelUpload",

  // Claim page
  ClaimLevelDelete = "claimLevelDelete",
  ClaimLevelUpload = "claimLevelUpload",
  ClaimForecastSaveAndContinue = "claimForecastSaveAndContinue",
  ClaimForecastSaveAndQuit = "claimForecastSaveAndQuit",
  ClaimLineItemSaveAndDocuments = "claimLineItemSaveAndDocuments",
  ClaimLineItemSaveAndQuit = "claimLineItemSaveAndQuit",
  ClaimSummary = "claimSummary",

  // Project Setup
  ProjectSetup = "projectSetup",
  ProjectSetupBankDetails = "projectSetupBankDetails",
  ProjectSetupBankDetailsVerify = "projectSetupBankDetailsVerify",
  ProjectSetupContactAssociate = "projectSetupContactAssociate",
  ProjectSetupForecast = "projectSetupForecast",
  ProjectSetupPostcode = "projectSetupPostcode",
  ProjectSetupBankStatementUpload = "projectSetupBankStatementUpload",
  ProjectSetupBankStatementDelete = "projectSetupBankStatementDelete",
  ProjectSetupBankStatement = "projectSetupBankStatement",

  // Partner details

  PartnerDetailsEdit = "partnerDetailsEdit",

  // Project Replace a Team Member
  ProjectManageTeamMembersCreate = "projectManageTeamMembersCreate",
  ProjectManageTeamMembersUpdate = "projectManageTeamMembersUpdate",
  ProjectManageTeamMembersReplace = "projectManageTeamMembersReplace",
  ProjectManageTeamMembersDelete = "projectManageTeamMembersDelete",

  // Forecast Tile
  ForecastTileForecast = "forecastTileForecast",

  // Claim Details page
  ClaimDetailLevelUpload = "claimDetailLevelUpload",
  ClaimDetailLevelDelete = "claimDetailLevelDelete",

  // Claim review page
  ClaimReviewLevelSaveAndContinue = "claimReviewSaveAndContinue",
  ClaimReviewLevelUpload = "claimReviewLevelUpload",
  ClaimReviewLevelDelete = "claimReviewLevelDelete",

  // Monitoring reports
  MonitoringReportCreate = "monitoringReportCreate",
  MonitoringReportPreparePeriod = "monitoringReportPreparePeriod",
  MonitoringReportQuestion = "monitoringReportQuestion",
  MonitoringReportSummary = "monitoringReportSummary",
  MonitoringReportDelete = "monitoringReportDelete",

  // Project Change Requests
  ProjectChangeRequestCreate = "projectChangeRequestCreate",
  ProjectChangeRequestUpdateTypes = "projectChangeRequestUpdateTypes",
  ProjectChangeRequestDelete = "projectChangeRequestDelete",

  PcrPrepare = "pcrPrepare",

  PcrLevelDelete = "pcrLevelDelete",
  PcrLevelUpload = "pcrLevelUpload",

  PcrReallocateCostsSummary = "pcrReallocateCostsSummary",
  PcrReallocateCostsCostCategorySaveAndContinue = "pcrReallocateCostsCostCategorySaveAndContinue",
  PcrReallocateCostsChangeRemainingGrant = "pcrReallocateCostsChangeRemainingGrant",

  PcrApproveNewSubcontractorStep = "pcrApproveNewSubcontractorDetails",
  PcrApproveNewSubcontractorSummary = "pcrApproveNewSubcontractorSummary",

  PcrChangeProjectScopeProposedPublicDescriptionStepSaveAndContinue = "pcrChangeProjectScopeProposedPublicDescriptionStepSaveAndContinue",
  PcrChangeProjectScopeProposedProjectSummaryStepSaveAndContinue = "pcrChangeProjectScopeProposedProjectSummaryStepSaveAndContinue",
  PcrChangeProjectScopeSummary = "pcrChangeProjectScopeSummary",

  PcrRenamePartnerStep = "pcrRenamePartnerStep",
  PcrRenamePartnerFilesStep = "pcrRenamePartnerFilesStep",
  PcrRenamePartnerSummary = "pcrRenamePartnerSummary",

  PcrRemovePartnerStep = "pcrRemovePartnerStep",
  PcrRemovePartnerFilesStep = "pcrRemovePartnerFilesStep",
  PcrRemovePartnerSummary = "pcrRemovePartnerSummary",

  PcrPrepareReasoningStep = "pcrPrepareReasoningStep",
  PcrPrepareReasoningFilesStep = "pcrPrepareReasoningFilesStep",
  PcrPrepareReasoningSummary = "pcrPrepareReasoningSummary",

  PcrAddPartnerCompaniesHouseStepSaveAndContinue = "pcrAddPartnerCompaniesHouseStepSaveAndContinue",
  PcrAddPartnerCompaniesHouseStepSaveAndQuit = "pcrAddPartnerCompaniesHouseStepSaveAndQuit",
  PcrAddPartnerRoleAndOrganisationStep = "pcrAddPartnerRoleAndOrganisationStep",
  PcrAddPartnerOrganisationDetailsStep = "pcrAddPartnerOrganisationDetailsStep",
  PcrAddPartnerFinancialDetailsStep = "pcrAddPartnerFinancialDetailsStep",
  PcrAddPartnerProjectLocationStep = "pcrAddPartnerProjectLocationStep",
  PcrAddPartnerFinanceContactStep = "pcrAddPartnerFinanceContactStep",
  PcrAddPartnerProjectManagerStep = "pcrAddPartnerProjectManagerStep",
  PcrAddPartnerOtherFundingStep = "pcrAddPartnerOtherFundingStep",
  PcrAddPartnerOtherSourcesOfFundingStep = "pcrAddPartnerOtherSourcesOfFundingStep",
  PcrAddPartnerAcademicOrganisationStep = "pcrAddPartnerAcademicOrganisationStep",
  PcrAddPartnerAcademicOrganisationSearchStep = "pcrAddPartnerAcademicOrganisationSearchStep",
  PcrAddPartnerAwardRateStep = "pcrAddPartnerAwardRateStep",
  PcrAddPartnerAgreementFilesStep = "pcrAddPartnerAgreementFilesStep",
  PcrAddPartnerJesFormStep = "pcrAddPartnerJesFormFilesStep",
  PcrAddPartnerAcademicCostsStep = "pcrAddPartnerAcademicCostsStep",
  PcrAddPartnerDeMinimisFilesStep = "pcrAddPartnerDeMinimisFilesStep",
  PcrAddPartnerSummary = "pcrAddPartnerSummary",

  PcrAddPartnerSpendProfileLabourCost = "pcrAddPartnerSpendProfileLabourCost",
  PcrAddPartnerSpendProfileOverheadCost = "pcrAddPartnerSpendProfileOverheadCost",
  PcrAddPartnerSpendProfileMaterialsCost = "pcrAddPartnerSpendProfileMaterialsCost",
  PcrAddPartnerSpendProfileCapitalUsageCost = "pcrAddPartnerSpendProfileCapitalUsageCost",
  PcrAddPartnerSpendProfileSubcontractingCost = "pcrAddPartnerSpendProfileSubcontractingCost",
  PcrAddPartnerSpendProfileTravelAndSubsistenceCost = "pcrAddPartnerSpendProfileTravelAndSubsistenceCost",
  PcrAddPartnerSpendProfileOtherCost = "pcrAddPartnerSpendProfileOtherCost",

  PcrAddPartnerSPendProfileDeleteItem = "pcrAddPartnerSpendProfileDeleteItem",

  PcrProjectSuspensionStep = "pcrProjectSuspensionStep",
  PcrProjectSuspensionSummary = "pcrProjectSuspensionSummary",

  PcrChangeDurationStep = "pcrChangeDurationStep",
  PcrChangeDurationSummary = "pcrChangeDurationSummary",

  LoanLevelUpload = "loanLevelUpload",
  LoanLevelDelete = "loanLevelDelete",
  LoanRequest = "loanRequest",
}

export { FormTypes };
