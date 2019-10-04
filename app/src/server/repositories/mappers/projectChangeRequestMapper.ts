import { SalesforceBaseMapper } from "./saleforceMapperBase";
import { ProjectChangeRequestEntity, ProjectChangeRequestItemEntity, ProjectChangeRequestItemStatus, ProjectChangeRequestStatus } from "@framework/entities";
import { ISalesforcePCR } from "../projectChangeRequestRepository";

export class SalesforcePCRMapper extends SalesforceBaseMapper<ISalesforcePCR[], ProjectChangeRequestEntity[]> {
  constructor(private readonly headerRecordTypeId: string) {
    super();
  }

  public map(items: ISalesforcePCR[]): ProjectChangeRequestEntity[] {
    const headers = items.filter(x => x.RecordTypeId === this.headerRecordTypeId);

    return headers.map(header => ({
      id: header.Id,
      number: header.Acc_RequestNumber__c,
      projectId: header.Acc_Project__c,
      partnerId: header.Acc_Project_Participant__c,
      started: this.clock.parseRequiredSalesforceDateTime(header.CreatedDate),
      updated: this.clock.parseRequiredSalesforceDateTime(header.LastModifiedDate),
      status: this.mapStatus(header.Acc_Status__c),
      statusName: header.StatusName,
      reasoning: header.Acc_Reasoning__c,
      guidance: header.Acc_Guidance__c,
      reasoningStatus: this.mapItemStatus(header.Acc_MarkedasComplete__c),
      reasoningStatusName: header.MarkedAsCompleteName,
      comments: header.Acc_Comments__c,
      items: items.filter(x => x.Acc_RequestHeader__c === header.Id).map(x => this.mapItem(header, x))
    }));
  }

  private mapItem(header: ISalesforcePCR, pcrItem: ISalesforcePCR): ProjectChangeRequestItemEntity {
    return {
      id: pcrItem.Id,
      pcrId: header.Id,
      projectId: header.Acc_Project__c,
      partnerId: header.Acc_Project__c,
      recordTypeId: pcrItem.RecordTypeId,
      status: this.mapItemStatus(pcrItem.Acc_MarkedasComplete__c),
      guidance: pcrItem.Acc_Guidance__c,
      statusName: pcrItem.MarkedAsCompleteName,
      publicDescription: pcrItem.Acc_NewPublicDescription__c,
      projectEndDate: this.clock.parseOptionalSalesforceDate(pcrItem.Acc_NewProjectEndDate__c),
      projectSummary: pcrItem.Acc_NewProjectSummary__c,
      suspensionStartDate: this.clock.parseOptionalSalesforceDate(pcrItem.Acc_SuspensionStarts__c),
      suspensionEndDate: this.clock.parseOptionalSalesforceDate(pcrItem.Acc_SuspensionEnds__c),
    };
  }

  private mapStatus(status: string): ProjectChangeRequestStatus {
    switch (status) {
      case "Draft":
        return ProjectChangeRequestStatus.Draft;
      case "Submitted to Monitoring Officer":
        return ProjectChangeRequestStatus.SubmittedToMonitoringOfficer;
      case "Queried by Monitoring Officer":
        return ProjectChangeRequestStatus.QueriedByMonitoringOfficer;
      case "Submitted to Innovation Lead":
        return ProjectChangeRequestStatus.SubmittedToInnovationLead;
      case "Queried by Innovate UK":
        return ProjectChangeRequestStatus.QueriedByInnovateUK;
      case "In External Review":
        return ProjectChangeRequestStatus.InExternalReview;
      case "In Review with Innovate UK":
        return ProjectChangeRequestStatus.InReviewWithInnovateUK;
      case "Rejected":
        return ProjectChangeRequestStatus.Rejected;
      case "Withdrawn":
        return ProjectChangeRequestStatus.Withdrawn;
      case "Approved":
        return ProjectChangeRequestStatus.Approved;
      case "Actioned":
        return ProjectChangeRequestStatus.Actioned;
      default:
        return ProjectChangeRequestStatus.Unknown;
    }
  }

  private mapItemStatus(status: string): ProjectChangeRequestItemStatus {
    switch (status) {
      case "To Do":
        return ProjectChangeRequestItemStatus.ToDo;
      case "Incomplete":
        return ProjectChangeRequestItemStatus.Incomplete;
      case "Complete":
        return ProjectChangeRequestItemStatus.Complete;
      default:
        return ProjectChangeRequestItemStatus.Unknown;
    }
  }
}
