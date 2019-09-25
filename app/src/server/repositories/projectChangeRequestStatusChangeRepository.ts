import SalesforceRepositoryBase from "@server/repositories/salesforceRepositoryBase";

export interface ISalesforceProjectChangeRequestStatusChange {
  Id: string;
  Acc_ProjectChangeRequest__c: string;
  Acc_PreviousProjectChangeRequestStatus__c: string;
  Acc_NewProjectChangeRequestStatus__c: string;
  CreatedDate: string;
  Acc_ExternalComment__c: string;
  Acc_ParticipantVisibility__c: boolean;
}

export interface IProjectChangeRequestStatusChangeRepository {
  createStatusChange(statusChange: Partial<ISalesforceProjectChangeRequestStatusChange>): Promise<string>;
  getStatusChanges(projectId: string, projectChangeRequestId: string): Promise<ISalesforceProjectChangeRequestStatusChange[]>;
}

export class ProjectChangeRequestStatusChangeRepository extends SalesforceRepositoryBase<ISalesforceProjectChangeRequestStatusChange> implements IProjectChangeRequestStatusChangeRepository {
  protected readonly salesforceObjectName = "Acc_StatusChange__c";
  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_ProjectChangeRequest__c",
    "Acc_PreviousProjectChangeRequestStatus__c",
    "Acc_NewProjectChangeRequestStatus__c",
    "CreatedDate",
    "Acc_ExternalComment__c",
    "Acc_ParticipantVisibility__c"
  ];

  public createStatusChange(statusChange: Partial<ISalesforceProjectChangeRequestStatusChange>) {
    return super.insertItem(statusChange);
  }

  public getStatusChanges(projectId: string, projectChangeRequestId: string): Promise<ISalesforceProjectChangeRequestStatusChange[]> {
    return super.where(`Acc_ProjectChangeRequest__c = '${projectChangeRequestId}' AND Acc_ProjectChangeRequest__r.Acc_Project__c = '${projectId}'`);
  }
}
