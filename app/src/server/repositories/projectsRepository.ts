import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceProject {
  Id: string;
  Acc_ClaimFrequency__c: string;
  Acc_EndDate__c: string;
  Acc_GOLTotalCostAwarded__c: number;
  Acc_CompetitionType__c: string;
  Acc_IFSApplicationId__c: number;
  Acc_ProjectNumber__c: string;
  Acc_ProjectSource__c: string;
  Acc_ProjectSummary__c: string;
  Acc_ProjectTitle__c: string;
  Acc_PublicDescription__c: string;
  Acc_StartDate__c: string;
  Acc_TotalProjectCosts__c: number;
  Acc_ProjectStatus__c: string;
  Acc_PCRsForReview__c: number;
  Acc_PCRsUnderQuery__c: number;
  ProjectStatusName: string;
  Acc_ClaimsForReview__c: number;
  Acc_ClaimsOverdue__c: number;
  Acc_ClaimsUnderQuery__c: number;
  Acc_TrackingClaimStatus__c: string;
  ClaimStatusName: string;
  Acc_NumberOfOpenClaims__c: number;
  Acc_LeadParticipantName__c: string;
  Acc_Duration__c: number;
  Acc_NumberofPeriods__c: number | null;
  Acc_CurrentPeriodNumber__c: number;
  Acc_CurrentPeriodStartDate__c: string;
  Acc_CurrentPeriodEndDate__c: string;
  Acc_NonFEC__c: boolean;
  Loan_LoanEndDate__c: string | null;
  Loan_LoanAvailabilityPeriodLength__c: number | null;
  Loan_LoanExtensionPeriodLength__c: number | null;
  Loan_LoanRepaymentPeriodLength__c: number | null;
}

export interface IProjectRepository {
  getById(id: string): Promise<ISalesforceProject>;
  getAll(): Promise<ISalesforceProject[]>;
}

export class ProjectRepository extends SalesforceRepositoryBase<ISalesforceProject> implements IProjectRepository {
  protected readonly salesforceObjectName = "Acc_Project__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_ClaimFrequency__c",
    "Acc_EndDate__c",
    "Acc_GOLTotalCostAwarded__c",
    "Acc_CompetitionType__c",
    "Acc_IFSApplicationId__c",
    "Acc_ProjectNumber__c",
    "Acc_ProjectSource__c",
    "Acc_ProjectSummary__c",
    "Acc_ProjectTitle__c",
    "Acc_PublicDescription__c",
    "Acc_StartDate__c",
    "Acc_TotalProjectCosts__c",
    "Acc_ProjectStatus__c",
    "toLabel(Acc_ProjectStatus__c) ProjectStatusName",
    "Acc_PCRsForReview__c",
    "Acc_PCRsUnderQuery__c",
    "Acc_ClaimsForReview__c",
    "Acc_ClaimsOverdue__c",
    "Acc_ClaimsUnderQuery__c",
    "Acc_TrackingClaimStatus__c",
    "toLabel(Acc_TrackingClaimStatus__c) ClaimStatusName",
    "Acc_NumberOfOpenClaims__c",
    "Acc_LeadParticipantName__c",
    "Acc_Duration__c",
    "Acc_NumberofPeriods__c",
    "Acc_CurrentPeriodNumber__c",
    "Acc_CurrentPeriodStartDate__c",
    "Acc_CurrentPeriodEndDate__c",
    "Acc_NonFEC__c",
    "Loan_LoanEndDate__c",
    "Loan_LoanAvailabilityPeriodLength__c",
    "Loan_LoanExtensionPeriodLength__c",
    "Loan_LoanRepaymentPeriodLength__c",
  ];

  getById(id: string) {
    return super.loadItem({ Id: id });
  }

  getAll() {
    return super.where("Acc_ProjectStatus__c != 'Not set' AND Acc_ProjectStatus__c != 'PCL Creation Complete'");
  }
}
