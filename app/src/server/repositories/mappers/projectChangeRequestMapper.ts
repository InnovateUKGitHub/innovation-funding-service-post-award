import { SalesforceBaseMapper } from "./saleforceMapperBase";
import {
  ProjectChangeRequestEntity,
  ProjectChangeRequestItemEntity
} from "@framework/entities";
import { ISalesforcePCR } from "../projectChangeRequestRepository";
import { PCRItemStatus, PCRStatus } from "@framework/constants";

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
      partnerId: pcrItem.Acc_Project_Participant__c,
      recordTypeId: pcrItem.RecordTypeId,
      status: this.mapItemStatus(pcrItem.Acc_MarkedasComplete__c),
      guidance: pcrItem.Acc_Guidance__c,
      statusName: pcrItem.MarkedAsCompleteName,
      publicDescription: pcrItem.Acc_NewPublicDescription__c,
      accountName: pcrItem.Acc_NewOrganisationName__c,
      projectEndDate: this.clock.parseOptionalSalesforceDate(pcrItem.Acc_NewProjectEndDate__c),
      projectSummary: pcrItem.Acc_NewProjectSummary__c,
      suspensionStartDate: this.clock.parseOptionalSalesforceDate(pcrItem.Acc_SuspensionStarts__c),
      suspensionEndDate: this.clock.parseOptionalSalesforceDate(pcrItem.Acc_SuspensionEnds__c),
      publicDescriptionSnapshot: pcrItem.Acc_PublicDescriptionSnapshot__c,
      projectSummarySnapshot: pcrItem.Acc_ProjectSummarySnapshot__c,
      partnerNameSnapshot: pcrItem.Acc_ExistingPartnerName__c,
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
