import { PicklistEntry } from "jsforce";
import { PCRStatus } from "@framework/types";

export const pcrStatusesPicklist: Map<PCRStatus, PicklistEntry> = new Map();

pcrStatusesPicklist.set(PCRStatus.Draft, { value: "1", label: "Draft", defaultValue: false, active: true });
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
pcrStatusesPicklist.set(PCRStatus.SubmittedToInnovationLead, {
  value: "4",
  label: "Submitted to Innovation Lead",
  defaultValue: false,
  active: true,
});
pcrStatusesPicklist.set(PCRStatus.QueriedByInnovateUK, {
  value: "5",
  label: "Queried by Innovate UK",
  defaultValue: false,
  active: true,
});
pcrStatusesPicklist.set(PCRStatus.InExternalReview, {
  value: "6",
  label: "In external review",
  defaultValue: false,
  active: true,
});
pcrStatusesPicklist.set(PCRStatus.Rejected, { value: "7", label: "Rejected", defaultValue: false, active: true });
pcrStatusesPicklist.set(PCRStatus.Withdrawn, { value: "8", label: "Withdrawn", defaultValue: false, active: true });
pcrStatusesPicklist.set(PCRStatus.Approved, { value: "9", label: "Approved", defaultValue: false, active: true });
pcrStatusesPicklist.set(PCRStatus.Actioned, { value: "10", label: "Actioned", defaultValue: false, active: true });
