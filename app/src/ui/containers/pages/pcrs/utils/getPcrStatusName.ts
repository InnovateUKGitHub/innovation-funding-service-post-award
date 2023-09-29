import { PCRStatus } from "@framework/constants/pcrConstants";

export const getPcrStatusName = (status: PCRStatus): string => {
  switch (status) {
    case PCRStatus.Draft:
      return "Draft";
    case PCRStatus.SubmittedToMonitoringOfficer:
      return "Submitted to Monitoring Officer";
    case PCRStatus.QueriedByMonitoringOfficer:
      return "Queried by Monitoring Officer";
    case PCRStatus.SubmittedToInnovationLead:
      return "Submitted to Innovation Lead";
    case PCRStatus.SubmittedToInnovateUK:
      return "Submitted to Innovate UK";
    case PCRStatus.QueriedByInnovateUK:
      return "Queried by Innovate UK";
    case PCRStatus.QueriedByInnovationLead:
      return "Queried by Innovation Lead";
    case PCRStatus.InReviewWithProjectFinance:
      return "In Review with Project Finance";
    case PCRStatus.InExternalReview:
      return "In External Review";
    case PCRStatus.InReviewWithInnovateUK:
      return "In Review with Innovate UK";
    case PCRStatus.Rejected:
      return "Rejected";
    case PCRStatus.Withdrawn:
      return "Withdrawn";
    case PCRStatus.Approved:
      return "Approved";
    case PCRStatus.Actioned:
      return "Actioned";
    default:
      return "";
  }
};
