import { SalesforceBaseMapper } from "./saleforceMapperBase";
import { PCR, PCRItem, PCRItemStatus, PCRStatus } from "@framework/entities";
import { ISalesforcePCR, ISalesforcePCRSummary } from "../pcrRepository";
import { NotFoundError } from "@server/features/common";

export class SalesforcePCRMapper extends SalesforceBaseMapper<ISalesforcePCR[], PCR[]> {
  constructor(private readonly headerRecordTypeId: string) {
    super();
  }

  public map(items: ISalesforcePCR[]): PCR[] {
    const headers = items.filter(x => x.RecordTypeId === this.headerRecordTypeId);

    return headers.map(header => ({
      id: header.Id,
      number: header.Acc_RequestNumber__c,
      projectId: header.Acc_Project_Participant__r.Acc_ProjectId__c,
      started: this.clock.parseRequiredSalesforceDateTime(header.CreatedDate),
      updated: this.clock.parseRequiredSalesforceDateTime(header.LastModifiedDate),
      status: this.mapStatus(header.Acc_Status__c),
      statusName: header.StatusName,
      reasoning: header.Acc_Reasoning__c,
      reasoningStatus: this.mapItemStatus(header.Acc_MarkedasComplete__c),
      reasoningStatusName: header.MarkedAsCompleteName,
      comments: header.Acc_Comments__c,
      items: items.filter(x => x.Acc_RequestHeader__c === header.Id).map(x => this.mapItem(header, x))
    }));
  }

  private mapItem(header: ISalesforcePCR, pcrItem: ISalesforcePCR): PCRItem {
    return {
      id: pcrItem.Id,
      pcrId: header.Id,
      recordTypeId: pcrItem.RecordTypeId,
      status: this.mapItemStatus(pcrItem.Acc_MarkedasComplete__c),
      statusName: pcrItem.MarkedAsCompleteName
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

  private mapItemStatus(status: string): PCRItemStatus {
    switch (status) {
      case "To Do":
        return PCRItemStatus.ToDo;
      case "Incomplete":
        return PCRItemStatus.Incomplete;
      case "Complete":
        return PCRItemStatus.Complete;
      default:
        return PCRItemStatus.Unknown;
    }
  }
}
