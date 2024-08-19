import { PCRStatus } from "@framework/constants/pcrConstants";
import { TsforceDescribeSobjectFieldPicklistEntry } from "@server/tsforce/requests/TsforceDescribeSubrequest";

export const pcrStatusesPicklist: Map<PCRStatus, TsforceDescribeSobjectFieldPicklistEntry> = new Map();

pcrStatusesPicklist.set(PCRStatus.DraftWithProjectManager, {
  value: "1",
  label: "Draft",
  defaultValue: false,
  active: true,
});
pcrStatusesPicklist.set(PCRStatus.SubmittedToMonitoringOfficer, {
  value: "2",
  label: "Submitted to monitoring officer",
  defaultValue: false,
  active: true,
});
pcrStatusesPicklist.set(PCRStatus.QueriedByMonitoringOfficer, {
  value: "3",
  label: "Queried by monitoring officer",
  defaultValue: false,
  active: true,
});
pcrStatusesPicklist.set(PCRStatus.DeprecatedSubmittedToInnovationLead, {
  value: "4",
  label: "Submitted to Innovation Lead",
  defaultValue: false,
  active: true,
});
pcrStatusesPicklist.set(PCRStatus.DeprecatedQueriedByInnovateUK, {
  value: "5",
  label: "Queried by Innovate UK",
  defaultValue: false,
  active: true,
});
pcrStatusesPicklist.set(PCRStatus.DeprecatedInExternalReview, {
  value: "6",
  label: "In external review",
  defaultValue: false,
  active: true,
});
pcrStatusesPicklist.set(PCRStatus.Rejected, { value: "7", label: "Rejected", defaultValue: false, active: true });
pcrStatusesPicklist.set(PCRStatus.Withdrawn, { value: "8", label: "Withdrawn", defaultValue: false, active: true });
pcrStatusesPicklist.set(PCRStatus.Approved, { value: "9", label: "Approved", defaultValue: false, active: true });
pcrStatusesPicklist.set(PCRStatus.DeprecatedActioned, {
  value: "10",
  label: "Actioned",
  defaultValue: false,
  active: true,
});
