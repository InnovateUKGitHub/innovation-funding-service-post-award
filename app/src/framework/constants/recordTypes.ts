export const enum Claims {
  claimsDetail = "Claims_Detail",
  totalProjectPeriod = "Total_Project_Period",
  claimsLineItem = "Claims_Line_Item",
}

export const enum Profile {
  profileDetails = "Profile_Detail",
  totalCostCategory = "Total_Cost_Category",
  totalProjectPeriod = "Total_Project_Period",
}

export const enum ProjectChangeRequest {
  requestHeader = "Acc_RequestHeader",
  loanDrawdownChange = "Loan_LoanDrawdownChange",
  participantVirementForLoanDrawdown = "Loan_ParticipantVirementForLoanDrawdown",
  periodVirementForLoanDrawdown = "Loan_PeriodVirementForLoanDrawdown",
  changeLoansDuration = "Loan_ChangeLoansDuration",
  accountNameChange = "Acc_AccountNameChange",
  changeAPartnersName = "Acc_ChangeAPartnersName",
  partnerAddition = "Acc_PartnerAddition",
  addAPartner = "Acc_AddAPartner",
  projectSuspension = "Acc_ProjectSuspension",
  putProjectOnHold = "Acc_PutProjectOnHold",
  timeExtension = "Acc_TimeExtension",
  changeProjectDuration = "Acc_ChangeProjectDuration",
  changeProjectScope = "Acc_ChangeProjectScope",
  projectTermination = "Acc_ProjectTermination",
  endProjectEarly = "Acc_EndTheProjectEarly",
  financialVirement = "Acc_FinancialVirement",
  multiplePartnerFinancialVirement = "Acc_MultiplePartnerFinancialVirement",
  reallocateOnePartnersProjectCosts = "Acc_ReallocateOnePartnersProjectCosts",
  reallocateSeveralPartnersProjectCost = "Acc_ReallocateSeveralPartnersProjectCost",
  singlePartnerFinancialVirement = "Acc_SinglePartnerFinancialVirement",
  betweenPartnerFinancialVirement = "Acc_BetweenPartnerFinancialVirement",
  removeAPartner = "Acc_RemoveAPartner",
  partnerWithdrawal = "Acc_PartnerWithdrawal",
  changePeriodLength = "Acc_ChangePeriodLength",
  projectChangeRequests = "Acc_ProjectChangeRequests",
  approveNewSubcontractor = "Approve_a_new_subcontractor",
}
