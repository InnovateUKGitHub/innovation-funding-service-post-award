import { SalesforceBaseMapper } from "./saleforceMapperBase";
import { ISalesforcePCR, ISalesforceProjectChangeRequestStatusChange } from "..";
import { ProjectChangeRequestStatusChangeEntity } from "@framework/entities";
import { PCRStatus } from "@framework/types";

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
        switch (status) {
          case "Draft":
            return PCRStatus.Draft;
          case "Submitted to Monitoring Officer":
            return PCRStatus.SubmittedToMonitoringOfficer;
          case "Queried by Monitoring Officer":
            return PCRStatus.QueriedByMonitoringOfficer;
          case "Submitted to Innovation Lead":
            return PCRStatus.SubmittedToInnovationLead;
          case "Queried by Innovate UK":
            return PCRStatus.QueriedByInnovateUK;
          case "In External Review":
            return PCRStatus.InExternalReview;
          case "In Review with Innovate UK":
            return PCRStatus.InReviewWithInnovateUK;
          case "Rejected":
            return PCRStatus.Rejected;
          case "Withdrawn":
            return PCRStatus.Withdrawn;
          case "Approved":
            return PCRStatus.Approved;
          case "Actioned":
            return PCRStatus.Actioned;
          default:
            return PCRStatus.Unknown;
        }
      }
}
