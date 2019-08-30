import { SalesforceBaseMapper } from "./saleforceMapperBase";
import { PCR, PCRItemStatus, PCRStatus, PCRSummary } from "@framework/entities";
import { ISalesforcePCR, ISalesforcePCRSummary } from "../pcrRepository";
import { NotFoundError } from "@server/features/common";

export class SalesforcePCRDetailedMapper extends SalesforceBaseMapper<ISalesforcePCR[], PCR> {
  constructor(private readonly headerRecordTypeId: string) {
    super();
    this.summaryMapper = new SalesforcePCRSummaryMapper(headerRecordTypeId);
  }

  private summaryMapper: SalesforcePCRSummaryMapper;

  public map(items: ISalesforcePCR[]): PCR {
    const header = items.find(x => x.RecordTypeId === this.headerRecordTypeId);

    if (!header) {
      throw new NotFoundError();
    }

    console.log("heder", header);

    const summary = this.summaryMapper.map([header])[0];

    return {
      id: summary.id,
      projectId: summary.projectId,
      number: summary.number,
      started: summary.started,
      updated: summary.updated,
      status: summary.status,
      statusName: summary.statusName,

      reasoning: header.Acc_Reasoning__c,
      reasoningStatus: this.mapStatus(header.Acc_MarkedasComplete__c),
      reasoningStatusName: header.MarkedAsCompleteName,
      comments: header.Acc_Comments__c,

      items: items.filter(x => x.RecordTypeId !== this.headerRecordTypeId).map(x => ({
        id: x.Id,
        pcrId: header.Id,
        recordTypeId: x.RecordTypeId,
        status: this.mapStatus(x.Acc_MarkedasComplete__c),
        statusName: x.MarkedAsCompleteName
      }))
    };
  }

  private mapStatus(status: string): PCRItemStatus {
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

export class SalesforcePCRSummaryMapper extends SalesforceBaseMapper<ISalesforcePCRSummary[], PCRSummary[]> {
  constructor(private readonly headerRecordTypeId: string) {
    super();
  }

  public map(items: ISalesforcePCRSummary[]): PCRSummary[] {

    const headers = items.filter(x => x.RecordTypeId === this.headerRecordTypeId);

    return headers.map(header => ({
      id: header.Id,
      number: header.Acc_RequestNumber__c,
      projectId: header.Acc_Project_Participant__r.Acc_ProjectId__c,
      started: this.clock.parseRequiredSalesforceDateTime(header.CreatedDate),
      updated: this.clock.parseRequiredSalesforceDateTime(header.LastModifiedDate),
      status: this.mapStatus(header.Acc_Status__c),
      statusName: header.StatusName,
      items: items.filter(x => x.Acc_RequestHeader__c === header.Id).map(x => ({ recordTypeId: x.RecordTypeId }))
    }));
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
