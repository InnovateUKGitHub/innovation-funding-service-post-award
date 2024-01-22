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
  // Claim Details page
  ClaimDetailLevelUpload = "claimDetailLevelUpload",
  ClaimDetailLevelDelete = "claimDetailLevelDelete",

  // Project Change Requests
  ProjectChangeRequestCreate = "projectChangeRequestCreate",
  ProjectChangeRequestUpdateTypes = "projectChangeRequestUpdateTypes",

  PcrLevelDelete = "pcrLevelDelete",
  PcrLevelUpload = "pcrLevelUpload",

  PcrFinancialVirementsSummary = "pcrFinancialVirementsSummary",
  PcrApproveNewSubcontractorStep = "pcrApproveNewSubcontractorDetails",
  PcrApproveNewSubcontractorSummary = "pcrApproveNewSubcontractorSummary",
}

export { FormTypes };
