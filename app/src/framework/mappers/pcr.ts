import {
  PCRPartnerType,
  PCROrganisationType,
  PCRItemStatus,
  PCRStatus,
  PCRProjectRole,
  PCRItemType,
} from "@framework/constants/pcrConstants";
import { TypeOfAid } from "@framework/constants/project";

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

export const mapToPCRItemStatus = (status: string): PCRItemStatus => {
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
    case "Draft":
      return PCRStatus.Draft;
    case "Submitted to Monitoring Officer":
      return PCRStatus.SubmittedToMonitoringOfficer;
    case "Queried by Monitoring Officer":
      return PCRStatus.QueriedByMonitoringOfficer;
    case "Submitted to Innovate UK":
      return PCRStatus.SubmittedToInnovateUK;
    case "Submitted to Innovation Lead":
      return PCRStatus.SubmittedToInnovationLead;
    case "Queried by Innovate UK":
      return PCRStatus.QueriedByInnovateUK;
    case "Queried by Innovation Lead":
      return PCRStatus.QueriedByInnovationLead;
    case "In Review with Project Finance":
      return PCRStatus.InReviewWithProjectFinance;
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

export const mapToPcrItemType = (shortName: string) => {
  switch (shortName.toLowerCase()) {
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
    default:
      return PCRItemType.Unknown;
  }
};
