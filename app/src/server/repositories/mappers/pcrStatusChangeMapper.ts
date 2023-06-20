import { SalesforceBaseMapper } from "./salesforceMapperBase";
import { mapToPCRStatus } from "./projectChangeRequestMapper";
import { PCRStatus } from "@framework/constants/pcrConstants";
import { ProjectChangeRequestStatusChangeEntity } from "@framework/entities/projectChangeRequest";
import { ISalesforceProjectChangeRequestStatusChange } from "../projectChangeRequestStatusChangeRepository";

export class PCRStatusChangeMapper extends SalesforceBaseMapper<
  ISalesforceProjectChangeRequestStatusChange,
  ProjectChangeRequestStatusChangeEntity
> {
  public map(item: ISalesforceProjectChangeRequestStatusChange): ProjectChangeRequestStatusChangeEntity {
    return {
      id: item.Id as PcrItemId,
      pcrId: item.Acc_ProjectChangeRequest__c as PcrId,
      createdBy: item.Acc_CreatedByAlias__c,
      createdDate: this.clock.parseRequiredSalesforceDateTime(item.CreatedDate),
      previousStatus: this.mapStatus(item.Acc_PreviousProjectChangeRequestStatus__c),
      newStatus: this.mapStatus(item.Acc_NewProjectChangeRequestStatus__c),
      externalComments: item.Acc_ExternalComment__c,
      participantVisibility: item.Acc_ParticipantVisibility__c,
    };
  }

  private mapStatus(status: string): PCRStatus {
    return mapToPCRStatus(status);
  }
}
