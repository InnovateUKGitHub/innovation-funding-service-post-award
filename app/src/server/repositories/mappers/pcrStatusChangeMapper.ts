import { SalesforceBaseMapper } from "./saleforceMapperBase";
import { ISalesforcePCR, ISalesforceProjectChangeRequestStatusChange } from "..";
import { ProjectChangeRequestStatusChangeEntity } from "@framework/entities";
import { PCRStatus } from "@framework/types";
import { mapToPCRStatus } from "./projectChangeRequestMapper";

export class PCRStatusChangeMapper extends SalesforceBaseMapper<ISalesforceProjectChangeRequestStatusChange, ProjectChangeRequestStatusChangeEntity> {
  public map(item: ISalesforceProjectChangeRequestStatusChange): ProjectChangeRequestStatusChangeEntity {
    return {
      id: item.Id,
      pcrId: item.Acc_ProjectChangeRequest__c,
      createdDate: this.clock.parseRequiredSalesforceDateTime(item.CreatedDate),
      previousStatus: this.mapStatus(item.Acc_PreviousProjectChangeRequestStatus__c),
      newStatus: this.mapStatus(item.Acc_NewProjectChangeRequestStatus__c),
      externalComments: item.Acc_ExternalComment__c,
      participantVisibility: item.Acc_ParticipantVisibility__c
    };
  }

  private mapStatus(status: string): PCRStatus {
    return mapToPCRStatus(status);
  }
}
