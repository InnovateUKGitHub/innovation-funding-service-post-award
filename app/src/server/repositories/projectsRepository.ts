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
  ProjectStatusName: string;
  Acc_Claims_For_Review__c: number;
  Acc_Claims_Overdue__c: number;
  Acc_Claims_Under_Query__c: number;
  Acc_TrackingClaimStatus__c: string;
  ClaimStatusName: string;
  Acc_Number_of_Open_Claims__c: number;
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
    "Acc_Claims_For_Review__c",
    "Acc_Claims_Overdue__c",
    "Acc_Claims_Under_Query__c",
    "Acc_TrackingClaimStatus__c",
    "toLabel(Acc_TrackingClaimStatus__c) ClaimStatusName",
    "Acc_Number_of_Open_Claims__c"
  ];

  getById(id: string) {
    return super.loadItem({ Id: id });
  }

  getAll() {
    return super.all();
  }
}
