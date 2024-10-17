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
  manageTeamMemberRequestHeader = "Acc_Request_Header_Manage_Team_Members",
  loanDrawdownChange = "Loan_LoanDrawdownChange",
  changeLoansDuration = "Loan_ChangeLoansDuration",
  changeAPartnersName = "Acc_ChangeAPartnersName",
  addAPartner = "Acc_AddAPartner",
  putProjectOnHold = "Acc_PutProjectOnHold",
  changeProjectDuration = "Acc_ChangeProjectDuration",
  changeProjectScope = "Acc_ChangeProjectScope",
  endProjectEarly = "Acc_EndTheProjectEarly",
  reallocateOnePartnersProjectCosts = "Acc_ReallocateOnePartnersProjectCosts",
  reallocateSeveralPartnersProjectCost = "Acc_ReallocateSeveralPartnersProjectCost",
  removeAPartner = "Acc_RemoveAPartner",
  approveNewSubcontractor = "Approve_a_new_subcontractor",
  manageTeamMembers = "Manage_Team_Members",
  uplift = "Acc_Uplift",

  INACTIVE_accountNameChange = "Acc_AccountNameChange",
  INACTIVE_partnerAddition = "Acc_PartnerAddition",
  INACTIVE_projectSuspension = "Acc_ProjectSuspension",
  INACTIVE_timeExtension = "Acc_TimeExtension",
  INACTIVE_projectTermination = "Acc_ProjectTermination",
  INACTIVE_financialVirement = "Acc_FinancialVirement",
  INACTIVE_multiplePartnerFinancialVirement = "Acc_MultiplePartnerFinancialVirement",
  INACTIVE_singlePartnerFinancialVirement = "Acc_SinglePartnerFinancialVirement",
  INACTIVE_betweenPartnerFinancialVirement = "Acc_BetweenPartnerFinancialVirement",
  INACTIVE_partnerWithdrawal = "Acc_PartnerWithdrawal",
  INACTIVE_changePeriodLength = "Acc_ChangePeriodLength",

  REMOVED_participantVirementForLoanDrawdown = "Loan_ParticipantVirementForLoanDrawdown",
  REMOVED_periodVirementForLoanDrawdown = "Loan_PeriodVirementForLoanDrawdown",
  REMOVED_projectChangeRequests = "Acc_ProjectChangeRequests",
}
