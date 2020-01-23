import { QueryBase } from "../common/queryBase";
import { IContext, PCRStatus } from "@framework/types";
import { OptionsQueryBase } from "../common/optionsQueryBase";

export class GetPcrStatusesQuery extends OptionsQueryBase<PCRStatus> {
  constructor() {
    super("PCRStatuses");
  }

  protected getPickListValues(context: IContext) {
    return context.repositories.projectChangeRequests.getPcrChangeStatuses();
  }

  protected mapToEnumValue(value: string) {
    switch (value) {
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
    }
}
