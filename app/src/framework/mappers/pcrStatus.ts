import { PCRStatus } from "@framework/constants";

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
