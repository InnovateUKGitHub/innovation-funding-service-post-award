import SalesforceRepositoryBase from "@server/repositories/salesforceRepositoryBase";
import { DateTime } from "luxon";

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
    super.where(`Acc_ProjectChangeRequest__c = '${projectChangeRequestId}' AND Acc_ProjectChangeRequest__c.Acc_Project__c = '${projectId}'`);

    const fakeStatusChanges: ISalesforceProjectChangeRequestStatusChange[] = [
      {
        Id: "StatusChange 1",
        Acc_ProjectChangeRequest__c: "projectChangeRequest1",
        Acc_NewProjectChangeRequestStatus__c: "Submitted to Monitoring Officer",
        Acc_PreviousProjectChangeRequestStatus__c: "Draft",
        CreatedDate: DateTime.local().toISO(),
        Acc_ExternalComment__c: "This is a comment",
        Acc_ParticipantVisibility__c: true,
      },
      {
        Id: "StatusChange 2",
        Acc_ProjectChangeRequest__c: "projectChangeRequest2",
        Acc_NewProjectChangeRequestStatus__c: "Queried by Monitoring Officer",
        Acc_PreviousProjectChangeRequestStatus__c: "Withdrawn",
        CreatedDate: DateTime.local().minus({ days: 150 }).toISO(),
        Acc_ExternalComment__c: "This is a comment",
        Acc_ParticipantVisibility__c: false,
      }
    ];

    return Promise.resolve(fakeStatusChanges);
  }
}
