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

  // Project Setup
  ProjectSetupBankDetails = "projectSetupBankDetails",
  ProjectSetupContactAssociate = "projectSetupContactAssociate",
  ProjectSetupForecast = "projectSetupForecast",

  // Forecast Tile
  ForecastTileForecast = "forecastTileForecast",

  // Claim Details page
  ClaimDetailLevelUpload = "claimDetailLevelUpload",
  ClaimDetailLevelDelete = "claimDetailLevelDelete",

  // Claim review page
  ClaimReviewLevelSaveAndContinue = "claimReviewSaveAndContinue",
  ClaimReviewLevelUpload = "claimReviewLevelUpload",
  ClaimReviewLevelDelete = "claimReviewLevelDelete",

  // Project Change Requests
  ProjectChangeRequestCreate = "projectChangeRequestCreate",
  ProjectChangeRequestUpdateTypes = "projectChangeRequestUpdateTypes",

  PcrLevelDelete = "pcrLevelDelete",
  PcrLevelUpload = "pcrLevelUpload",

  PcrFinancialVirementsSummary = "pcrFinancialVirementsSummary",
  PcrFinancialVirementsCostCategorySaveAndContinue = "pcrFinancialVirementsCostCategorySaveAndContinue",
  PcrReallocateCostsChangeRemainingGrant = "pcrReallocateCostsChangeRemainingGrant",

  PcrApproveNewSubcontractorStep = "pcrApproveNewSubcontractorDetails",
  PcrApproveNewSubcontractorSummary = "pcrApproveNewSubcontractorSummary",

  PcrAddPartnerCompaniesHouseStepSaveAndContinue = "pcrAddPartnerCompaniesHouseStepSaveAndContinue",
  PcrAddPartnerCompaniesHouseStepSaveAndQuit = "pcrAddPartnerCompaniesHouseStepSaveAndQuit",

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

  PcrProjectSuspensionStep = "pcrProjectSuspensionStep",
  PcrProjectSuspensionSummary = "pcrProjectSuspensionSummary",

  PcrChangeDurationStep = "pcrChangeDurationStep",
  PcrChangeDurationSummary = "pcrChangeDurationSummary",

  LoanLevelUpload = "loanLevelUpload",
  LoanLevelDelete = "loanLevelDelete",
  LoanRequest = "loanRequest",
}

export { FormTypes };
