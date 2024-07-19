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

  PcrPrepare = "pcrPrepare",

  PcrLevelDelete = "pcrLevelDelete",
  PcrLevelUpload = "pcrLevelUpload",

  PcrFinancialVirementsSummary = "pcrFinancialVirementsSummary",
  PcrFinancialVirementsCostCategorySaveAndContinue = "pcrFinancialVirementsCostCategorySaveAndContinue",
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

  PcrProjectSuspensionStep = "pcrProjectSuspensionStep",
  PcrProjectSuspensionSummary = "pcrProjectSuspensionSummary",

  PcrChangeDurationStep = "pcrChangeDurationStep",
  PcrChangeDurationSummary = "pcrChangeDurationSummary",

  LoanLevelUpload = "loanLevelUpload",
  LoanLevelDelete = "loanLevelDelete",
  LoanRequest = "loanRequest",
}

export { FormTypes };
