import { SalesforceBaseMapper } from "./saleforceMapperBase";
import {
  ProjectChangeRequestEntity,
  ProjectChangeRequestItemEntity
} from "@framework/entities";
import { ISalesforcePCR } from "../projectChangeRequestRepository";
import { PCRItemStatus, PCRPartnerType, PCRProjectRole, PCRStatus } from "@framework/constants";

export const mapToPCRStatus = ((status: string) => {
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
    case "Queried by Innovation Lead":
      // This PCR Status is currently not intended for ACC, as it is meant only for Innovate internal use;
      return PCRStatus.InExternalReview;
    default:
      return PCRStatus.Unknown;
  }
});

export class PcrProjectRoleMapper {
  private roles = {
    collaborator: "Collaborator",
    projectLead: "Project Lead",
  };

  public mapFromSalesforcePCRProjectRole = ((role: string | null) => {
    switch (role) {
      case this.roles.collaborator: return PCRProjectRole.Collaborator;
      case this.roles.projectLead: return PCRProjectRole.ProjectLead;
      default: return PCRProjectRole.Unknown;
    }
  });

  public mapToSalesforcePCRProjectRole = ((role: PCRProjectRole | undefined) => {
    switch (role) {
      case PCRProjectRole.Collaborator: return this.roles.collaborator;
      case PCRProjectRole.ProjectLead: return this.roles.projectLead;
      default: return null;
    }
  });
}

export class PcrPartnerTypeMapper {
  private partnerTypes = {
    business: "Business",
    research: "Research",
    researchAndTechnology: "Research and Technology Organisation (RTO)",
    other: "Public Sector, charity or non Je-S registered research organisation"
  };

  public mapFromSalesforcePCRPartnerType = ((partnerType: string | null) => {
    switch (partnerType) {
      case this.partnerTypes.business: return PCRPartnerType.Business;
      case this.partnerTypes.research: return PCRPartnerType.Research;
      case this.partnerTypes.researchAndTechnology: return PCRPartnerType.ResearchAndTechnology;
      case this.partnerTypes.other: return PCRPartnerType.Other;
      default: return PCRPartnerType.Unknown;
    }
  });

  public mapToSalesforcePCRPartnerType = ((partnerType: PCRPartnerType | undefined) => {
    switch (partnerType) {
      case PCRPartnerType.Business: return this.partnerTypes.business;
      case PCRPartnerType.Research: return this.partnerTypes.research;
      case PCRPartnerType.ResearchAndTechnology: return this.partnerTypes.researchAndTechnology;
      case PCRPartnerType.Other: return this.partnerTypes.other;
      default: return null;
    }
  });
}

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
      statusName: pcrItem.MarkedAsCompleteName,
      publicDescription: pcrItem.Acc_NewPublicDescription__c,
      accountName: pcrItem.Acc_NewOrganisationName__c,
      projectDuration: pcrItem.Acc_NewProjectDuration__c,
      additionalMonths: pcrItem.Acc_AdditionalNumberofMonths__c,
      projectDurationSnapshot: pcrItem.Acc_ExistingProjectDuration__c,
      projectSummary: pcrItem.Acc_NewProjectSummary__c,
      withdrawalDate: this.clock.parseOptionalSalesforceDateTime(pcrItem.Acc_RemovalDate__c),
      removalPeriod: pcrItem.Acc_RemovalPeriod__c,
      suspensionStartDate: this.clock.parseOptionalSalesforceDate(pcrItem.Acc_SuspensionStarts__c),
      suspensionEndDate: this.clock.parseOptionalSalesforceDate(pcrItem.Acc_SuspensionEnds__c),
      publicDescriptionSnapshot: pcrItem.Acc_PublicDescriptionSnapshot__c,
      projectSummarySnapshot: pcrItem.Acc_ProjectSummarySnapshot__c,
      partnerNameSnapshot: pcrItem.Acc_ExistingPartnerName__c,
      shortName: pcrItem.Acc_Nickname__c || "",
      // add partner fields
      projectRole: new PcrProjectRoleMapper().mapFromSalesforcePCRProjectRole(pcrItem.Acc_ProjectRole__c),
      projectRoleLabel: pcrItem.ProjectRoleLabel,
      partnerType: new PcrPartnerTypeMapper().mapFromSalesforcePCRPartnerType(pcrItem.Acc_ParticipantType__c),
      partnerTypeLabel: pcrItem.ParticipantTypeLabel,
    };
  }

  private mapStatus(status: string): PCRStatus {
    return mapToPCRStatus(status);
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
