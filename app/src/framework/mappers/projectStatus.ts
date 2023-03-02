import { ProjectStatus } from "@framework/constants";

export const getProjectStatus = (salesforceProjectStatus: string): ProjectStatus => {
  switch (salesforceProjectStatus) {
    case "Offer Letter Sent":
      return ProjectStatus.OfferLetterSent;
    case "Live":
      return ProjectStatus.Live;
    case "On Hold":
      return ProjectStatus.OnHold;
    case "Final Claim":
      return ProjectStatus.FinalClaim;
    case "Closed":
      return ProjectStatus.Closed;
    case "Terminated":
      return ProjectStatus.Terminated;
    default:
      return ProjectStatus.Unknown;
  }
};
