import { PCRSpendProfileCapitalUsageType } from "@framework/constants/pcrConstants";
import { PicklistEntry } from "jsforce";

export const pcrSpendProfileCapitalUsageTypePicklist: Map<PCRSpendProfileCapitalUsageType, PicklistEntry> = new Map();

pcrSpendProfileCapitalUsageTypePicklist.set(PCRSpendProfileCapitalUsageType.Unknown, {
  value: "1",
  label: "Unknown",
  defaultValue: false,
  active: true,
});
pcrSpendProfileCapitalUsageTypePicklist.set(PCRSpendProfileCapitalUsageType.New, {
  value: "2",
  label: "New",
  defaultValue: false,
  active: true,
});
pcrSpendProfileCapitalUsageTypePicklist.set(PCRSpendProfileCapitalUsageType.Existing, {
  value: "3",
  label: "Existing",
  defaultValue: false,
  active: true,
});
