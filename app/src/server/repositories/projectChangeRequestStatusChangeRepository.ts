import { ProjectChangeRequestStatusChangeEntity } from "@framework/entities";
import { SalesforceRepositoryBaseWithMapping } from "@server/repositories/salesforceRepositoryBase";
import { sss } from "@server/util/salesforce-string-helpers";
import { PCRStatusChangeMapper } from "./mappers/pcrStatusChangeMapper";

export interface ICreateProjectChangeRequestStatusChange {
  Acc_ProjectChangeRequest__c: string;
  Acc_ExternalComment__c: string;
  Acc_ParticipantVisibility__c: boolean;
}

export interface ISalesforceProjectChangeRequestStatusChange extends ICreateProjectChangeRequestStatusChange {
  Id: string;
  CreatedDate: string;
  Acc_CreatedByAlias__c: string;
  Acc_NewProjectChangeRequestStatus__c: string;
  Acc_PreviousProjectChangeRequestStatus__c: string;
}

export interface IProjectChangeRequestStatusChangeRepository {
  createStatusChange(statusChange: ICreateProjectChangeRequestStatusChange): Promise<string>;
  getStatusChanges(
    projectId: string,
    projectChangeRequestId: string,
  ): Promise<ProjectChangeRequestStatusChangeEntity[]>;
}

/**
 * ProjectChangeRequestStatusChanges are stored in the Acc_StatusChange__c
 *
 * Holds all status changes for Project Change Request records ("Acc_ProjectChangeRequest__c" of type "Request Header)
 *
 */
export class ProjectChangeRequestStatusChangeRepository
  extends SalesforceRepositoryBaseWithMapping<
    ISalesforceProjectChangeRequestStatusChange,
    ProjectChangeRequestStatusChangeEntity
  >
  implements IProjectChangeRequestStatusChangeRepository
{
  protected readonly salesforceObjectName = "Acc_StatusChange__c";
  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_ProjectChangeRequest__c",
    "Acc_PreviousProjectChangeRequestStatus__c",
    "Acc_NewProjectChangeRequestStatus__c",
    "CreatedDate",
    "Acc_ExternalComment__c",
    "Acc_CreatedByAlias__c",
    "Acc_ParticipantVisibility__c",
  ];

  protected mapper = new PCRStatusChangeMapper();

  public createStatusChange(statusChange: ICreateProjectChangeRequestStatusChange) {
    return super.insertItem({
      Acc_ProjectChangeRequest__c: statusChange.Acc_ProjectChangeRequest__c,
      Acc_ExternalComment__c: statusChange.Acc_ExternalComment__c,
      Acc_ParticipantVisibility__c: statusChange.Acc_ParticipantVisibility__c,
    });
  }

  public getStatusChanges(
    projectId: string,
    projectChangeRequestId: string,
  ): Promise<ProjectChangeRequestStatusChangeEntity[]> {
    return super.where(
      `Acc_ProjectChangeRequest__c = '${sss(
        projectChangeRequestId,
      )}' AND Acc_ProjectChangeRequest__r.Acc_Project__c = '${sss(projectId)}'`,
    );
  }
}
