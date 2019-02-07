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
    "Acc_TotalProjectCosts__c"
  ];

  getById(id: string) {
    return super.loadItem({ Id: id });
  }

  getAll() {
    return super.all();
  }
}
