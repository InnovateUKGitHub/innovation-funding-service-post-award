import {
  PCRPartnerType,
  PCROrganisationType,
  PCRItemStatus,
  PCRStatus,
  PCRProjectRole,
  PCRItemType,
  PCRContactRole,
  ManageTeamMemberMethod,
} from "@framework/constants/pcrConstants";
import { TypeOfAid } from "@framework/constants/project";
import { ProjectChangeRequest } from "@framework/constants/recordTypes";
import { ProjectRole, ProjectRoleName } from "@framework/dtos/projectContactDto";

export const mapToPCRManageTeamMemberType = (type: unknown): ManageTeamMemberMethod => {
  switch (type) {
    case "New Team Member":
      return ManageTeamMemberMethod.CREATE;
    case "Replaced":
      return ManageTeamMemberMethod.REPLACE;
    case "Updated":
      return ManageTeamMemberMethod.UPDATE;
    case "Deleted":
      return ManageTeamMemberMethod.DELETE;
    default:
      return ManageTeamMemberMethod.UNKNOWN;
  }
};

export const mapToSalesforcePCRManageTeamMemberType = (
  type: ManageTeamMemberMethod | undefined | null,
): string | null | undefined => {
  switch (type) {
    case ManageTeamMemberMethod.CREATE:
      return "New Team Member";
    case ManageTeamMemberMethod.REPLACE:
      return "Replaced";
    case ManageTeamMemberMethod.UPDATE:
      return "Updated";
    case ManageTeamMemberMethod.DELETE:
      return "Deleted";
    case ManageTeamMemberMethod.UNKNOWN:
    case null:
      return null;
    case undefined:
    default:
      return undefined;
  }
};

export const mapProjectRoleToInternal = (type: string | undefined | null): ProjectRole | null | undefined => {
  switch (type) {
    case ProjectRoleName.ProjectManager:
      return ProjectRole.PROJECT_MANAGER;
    case ProjectRoleName.FinanceContact:
      return ProjectRole.FINANCE_CONTACT;
    case ProjectRoleName.MainCompanyContact:
      return ProjectRole.MAIN_COMPANY_CONTACT;
    case ProjectRoleName.Associate:
      return ProjectRole.ASSOCIATE;
    case ProjectRoleName.KBAdmin:
      return ProjectRole.KNOWLEDGE_BASE_ADMINISTRATOR;
  }
};

export const mapProjectRoleToName = (type: ProjectRole | undefined | null): ProjectRoleName | null | undefined => {
  switch (type) {
    case ProjectRole.PROJECT_MANAGER:
      return ProjectRoleName.ProjectManager;
    case ProjectRole.FINANCE_CONTACT:
      return ProjectRoleName.FinanceContact;
    case ProjectRole.MAIN_COMPANY_CONTACT:
      return ProjectRoleName.MainCompanyContact;
    case ProjectRole.ASSOCIATE:
      return ProjectRoleName.Associate;
    case ProjectRole.KNOWLEDGE_BASE_ADMINISTRATOR:
      return ProjectRoleName.KBAdmin;
  }
};

export const getPCROrganisationType = (partnerType: PCRPartnerType): PCROrganisationType => {
  if (partnerType === PCRPartnerType.Research) {
    return PCROrganisationType.Academic;
  } else if (
    partnerType === PCRPartnerType.Business ||
    partnerType === PCRPartnerType.Other ||
    partnerType === PCRPartnerType.ResearchAndTechnology
  ) {
    return PCROrganisationType.Industrial;
  }
  return PCROrganisationType.Unknown;
};

export const mapToPCRItemStatus = (status: string | number): PCRItemStatus => {
  switch (status) {
    case "To Do":
    case PCRItemStatus.ToDo:
      return PCRItemStatus.ToDo;
    case "Incomplete":
    case PCRItemStatus.Incomplete:
      return PCRItemStatus.Incomplete;
    case "Complete":
    case PCRItemStatus.Complete:
      return PCRItemStatus.Complete;
    default:
      return PCRItemStatus.Unknown;
  }
};

export const mapTypeOfAidToEnum = (typeOfAid: string): TypeOfAid => {
  switch (typeOfAid) {
    case "State aid":
      return TypeOfAid.StateAid;
    case "De minimis aid":
      return TypeOfAid.DeMinimisAid;
    default:
      return TypeOfAid.Unknown;
  }
};

export const mapToPCRStatus = (statusLabel: string) => {
  switch (statusLabel) {
    // Current Values
    case "Draft":
    case "Draft with Project Manager":
      return PCRStatus.DraftWithProjectManager;
    case "Submitted to Monitoring Officer":
      return PCRStatus.SubmittedToMonitoringOfficer;
    case "Queried by Monitoring Officer":
    case "Queried to Project Manager": // Not a real status - Used to map PCR Status Change log messages
      return PCRStatus.QueriedByMonitoringOfficer;
    case "Submitted to Innovate UK":
      return PCRStatus.SubmittedToInnovateUK;
    case "Queried by Innovation Lead":
      return PCRStatus.QueriedToProjectManager;
    case "Withdrawn":
      return PCRStatus.Withdrawn;
    case "Rejected":
      return PCRStatus.Rejected;
    case "Awaiting Amendment Letter":
      return PCRStatus.AwaitingAmendmentLetter;
    case "Approved":
      return PCRStatus.Approved;

    // Salesforce "Inactive Values"
    case "Submitted to Innovation Lead":
      return PCRStatus.DeprecatedSubmittedToInnovationLead;
    case "Queried by Innovate UK":
      return PCRStatus.DeprecatedQueriedByInnovateUK;
    case "In Review with Project Finance":
      return PCRStatus.DeprecatedInReviewWithProjectFinance;
    case "In External Review":
      return PCRStatus.DeprecatedInExternalReview;
    case "In Review with Innovate UK":
      return PCRStatus.DeprecatedInReviewWithInnovateUK;
    case "Ready for approval":
      return PCRStatus.DeprecatedReadyForApproval;
    case "Actioned":
      return PCRStatus.DeprecatedActioned;

    default:
      return PCRStatus.Unknown;
  }
};

const roles = {
  collaborator: "Collaborator",
  projectLead: "Lead",
} as const;

export const mapFromSalesforcePCRProjectRole = (role: string | null): PCRProjectRole => {
  switch (role) {
    case roles.collaborator:
      return PCRProjectRole.Collaborator;
    case roles.projectLead:
      return PCRProjectRole.ProjectLead;
    default:
      return PCRProjectRole.Unknown;
  }
};

const partnerTypes = {
  business: "Business",
  research: "Research",
  researchAndTechnology: "Research and Technology Organisation (RTO)",
  other: "Public Sector, charity or non Je-S registered research organisation",
} as const;

export const mapFromSalesforcePCRPartnerType = (partnerType: string | null) => {
  switch (partnerType) {
    case partnerTypes.business:
      return PCRPartnerType.Business;
    case partnerTypes.research:
      return PCRPartnerType.Research;
    case partnerTypes.researchAndTechnology:
      return PCRPartnerType.ResearchAndTechnology;
    case partnerTypes.other:
      return PCRPartnerType.Other;
    default:
      return PCRPartnerType.Unknown;
  }
};

export const mapToPcrItemType = (developerName: string) => {
  switch (developerName) {
    case ProjectChangeRequest.loanDrawdownChange:
    case ProjectChangeRequest.participantVirementForLoanDrawdown:
    case ProjectChangeRequest.periodVirementForLoanDrawdown:
      return PCRItemType.LoanDrawdownChange;
    case ProjectChangeRequest.changeLoansDuration:
      return PCRItemType.LoanDrawdownExtension;
    case ProjectChangeRequest.accountNameChange:
    case ProjectChangeRequest.changeAPartnersName:
      return PCRItemType.AccountNameChange;
    case ProjectChangeRequest.partnerAddition:
    case ProjectChangeRequest.addAPartner:
      return PCRItemType.PartnerAddition;
    case ProjectChangeRequest.projectSuspension:
    case ProjectChangeRequest.putProjectOnHold:
      return PCRItemType.ProjectSuspension;
    case ProjectChangeRequest.timeExtension:
    case ProjectChangeRequest.changeProjectDuration:
      return PCRItemType.TimeExtension;
    case ProjectChangeRequest.changeProjectScope:
      return PCRItemType.ScopeChange;
    case ProjectChangeRequest.projectTermination:
    case ProjectChangeRequest.endProjectEarly:
      return PCRItemType.ProjectTermination;
    case ProjectChangeRequest.financialVirement:
    case ProjectChangeRequest.multiplePartnerFinancialVirement:
    case ProjectChangeRequest.reallocateOnePartnersProjectCosts:
    case ProjectChangeRequest.reallocateSeveralPartnersProjectCost:
    case ProjectChangeRequest.singlePartnerFinancialVirement:
    case ProjectChangeRequest.betweenPartnerFinancialVirement:
      return PCRItemType.MultiplePartnerFinancialVirement;
    case ProjectChangeRequest.removeAPartner:
    case ProjectChangeRequest.partnerWithdrawal:
      return PCRItemType.PartnerWithdrawal;
    case ProjectChangeRequest.changePeriodLength:
      return PCRItemType.PeriodLengthChange;
    case ProjectChangeRequest.approveNewSubcontractor:
      return PCRItemType.ApproveNewSubcontractor;
    case ProjectChangeRequest.uplift:
      return PCRItemType.Uplift;
    case ProjectChangeRequest.manageTeamMembers:
      return PCRItemType.ManageTeamMembers;

    // Request header
    case ProjectChangeRequest.requestHeader:
    case ProjectChangeRequest.manageTeamMemberRequestHeader:
    case ProjectChangeRequest.projectChangeRequests:
      return PCRItemType.Unknown;
  }

  /**
   * TODO: Remove and replace with `DeveloperName`
   */
  switch (developerName.toLowerCase()) {
    case "partner addition":
    case "add a partner":
      return PCRItemType.PartnerAddition;
    case "change project scope":
    case "scope change":
      return PCRItemType.ScopeChange;
    case "account name change":
    case "change a partner's name":
      return PCRItemType.AccountNameChange;
    case "change project duration":
    case "time extension":
      return PCRItemType.TimeExtension;
    case "change period length":
      return PCRItemType.PeriodLengthChange;
    case "end the project early":
    case "project termination":
      return PCRItemType.ProjectTermination;
    case "put project on hold":
    case "project suspension":
      return PCRItemType.ProjectSuspension;
    case "partner withdrawal":
    case "remove a partner":
      return PCRItemType.PartnerWithdrawal;
    case "loan drawdown change":
      return PCRItemType.LoanDrawdownChange;
    case "reallocate several partners' project cost":
    case "multiple partner financial virement":
      return PCRItemType.MultiplePartnerFinancialVirement;
    case "change loans duration":
    case "loan duration change":
      return PCRItemType.LoanDrawdownExtension;
    case "approve a new subcontractor":
      return PCRItemType.ApproveNewSubcontractor;
    case "uplift":
      return PCRItemType.Uplift;
    case "manage team members":
      return PCRItemType.ManageTeamMembers;

    default:
      return PCRItemType.Unknown;
  }
};

export class PcrContactRoleMapper {
  private readonly roles = {
    projectManager: "Project Manager",
    financeContact: "Finance Contact",
  };

  public mapFromSalesforcePCRProjectRole = (role: string | null): PCRContactRole => {
    switch (role) {
      case this.roles.projectManager:
        return PCRContactRole.ProjectManager;
      case this.roles.financeContact:
        return PCRContactRole.FinanceContact;
      default:
        return PCRContactRole.Unknown;
    }
  };

  public mapToSalesforcePCRProjectRole = (role: PCRContactRole | undefined) => {
    switch (role) {
      case PCRContactRole.ProjectManager:
        return this.roles.projectManager;
      case PCRContactRole.FinanceContact:
        return this.roles.financeContact;
      default:
        return null;
    }
  };
}
