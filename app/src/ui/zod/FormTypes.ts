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

  // Developer Options
  DeveloperPageCrasher = "developerPageCrasher",

  // Project Setup
  ProjectSetupBankDetails = "projectSetupBankDetails",
  ProjectSetupContactAssociate = "projectSetupContactAssociate",
  ProjectSetupForecast = "projectSetupForecast",

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
  PcrFinancialVirementEditRemainingGrant = "pcrFinancialVirementEditRemainingGrant",

  PcrApproveNewSubcontractorStep = "pcrApproveNewSubcontractorDetails",
  PcrApproveNewSubcontractorSummary = "pcrApproveNewSubcontractorSummary",

  PcrAddPartnerCompaniesHouseStepSaveAndContinue = "pcrAddPartnerCompaniesHouseStepSaveAndContinue",
  PcrAddPartnerCompaniesHouseStepSaveAndQuit = "pcrAddPartnerCompaniesHouseStepSaveAndQuit",

  PcrPrepareReasoningStep = "pcrPrepareReasoningStep",
  PcrPrepareReasoningFilesStep = "pcrPrepareReasoningFilesStep",
  PcrPrepareReasoningSummary = "pcrPrepareReasoningSummary",
}

export { FormTypes };
