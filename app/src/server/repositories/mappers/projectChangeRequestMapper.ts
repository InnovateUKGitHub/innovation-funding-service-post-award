import { SalesforceBaseMapper } from "./saleforceMapperBase";
import {
  ProjectChangeRequestEntity,
  ProjectChangeRequestItemEntity
} from "@framework/entities";
import { ISalesforcePCR } from "../projectChangeRequestRepository";
import { PCRContactRole, PCRItemStatus, PCRParticipantSize, PCRPartnerType, PCRProjectRole, PCRStatus } from "@framework/constants";

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

  public mapFromSalesforcePCRProjectRole = ((role: string | null): PCRProjectRole => {
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

export class PcrContactRoleMapper {
  private roles = {
    projectManager: "Project Manager",
    financeContact: "Finance Contact",
  };

  public mapFromSalesforcePCRProjectRole = ((role: string | null): PCRContactRole => {
    switch (role) {
      case this.roles.projectManager: return PCRContactRole.ProjectManager;
      case this.roles.financeContact: return PCRContactRole.FinanceContact;
      default: return PCRContactRole.Unknown;
    }
  });

  public mapToSalesforcePCRProjectRole = ((role: PCRContactRole | undefined) => {
    switch (role) {
      case PCRContactRole.ProjectManager: return this.roles.projectManager;
      case PCRContactRole.FinanceContact: return this.roles.financeContact;
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

export class PcrParticipantSizeMapper {
  private participantSizes = {
    academic: "Academic",
    small: "Small",
    medium: "Medium",
    large: "Large",
  };

  public mapFromSalesforcePCRParticipantSize = ((participantSize: string | null): PCRParticipantSize => {
    switch (participantSize) {
      case this.participantSizes.academic: return PCRParticipantSize.Academic;
      case this.participantSizes.small: return PCRParticipantSize.Small;
      case this.participantSizes.medium: return PCRParticipantSize.Medium;
      case this.participantSizes.large: return PCRParticipantSize.Large;
      default: return PCRParticipantSize.Unknown;
    }
  });

  public mapToSalesforcePCRParticipantSize = ((participantSize: PCRParticipantSize | undefined): string | null => {
    switch (participantSize) {
      case PCRParticipantSize.Academic: return this.participantSizes.academic;
      case PCRParticipantSize.Small: return this.participantSizes.small;
      case PCRParticipantSize.Medium: return this.participantSizes.medium;
      case PCRParticipantSize.Large: return this.participantSizes.large;
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
      contact1ProjectRole: new PcrContactRoleMapper().mapFromSalesforcePCRProjectRole(pcrItem.Acc_Contact1ProjectRole__c),
      contact1ProjectRoleLabel: pcrItem.Contact1ProjectRoleLabel,
      contact1Forename: pcrItem.Acc_Contact1Forename__c,
      contact1Surname: pcrItem.Acc_Contact1Surname__c,
      contact1Phone: pcrItem.Acc_Contact1Phone__c,
      contact1Email: pcrItem.Acc_Contact1EmailAddress__c,
      turnoverYearEnd: this.clock.parseOptionalSalesforceDate(pcrItem.Acc_TurnoverYearEnd__c),
      turnover: pcrItem.Acc_Turnover__c,
      organisationName: pcrItem.Acc_OrganisationName__c,
      projectRole: new PcrProjectRoleMapper().mapFromSalesforcePCRProjectRole(pcrItem.Acc_ProjectRole__c),
      projectRoleLabel: pcrItem.ProjectRoleLabel,
      partnerType: new PcrPartnerTypeMapper().mapFromSalesforcePCRPartnerType(pcrItem.Acc_ParticipantType__c),
      partnerTypeLabel: pcrItem.ParticipantTypeLabel,
      grantMovingOverFinancialYear: pcrItem.Acc_GrantMovingOverFinancialYear__c,
      projectCity: pcrItem.Acc_ProjectCity__c,
      projectPostcode: pcrItem.Acc_ProjectPostcode__c,
      participantSize: new PcrParticipantSizeMapper().mapFromSalesforcePCRParticipantSize(pcrItem.Acc_ParticipantSize__c),
      numberOfEmployees: pcrItem.Acc_Employees__c,
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
