import { PicklistEntry } from "jsforce";
import { PCRSpendProfileCapitalUsageType } from "@framework/types";

export const PCRSpendProfileCapitalUsageTypePicklist: Map<PCRSpendProfileCapitalUsageType, PicklistEntry> = new Map();

PCRSpendProfileCapitalUsageTypePicklist.set(PCRSpendProfileCapitalUsageType.Unknown, { value: "1", label: "Unknown", defaultValue: false, active: true});
PCRSpendProfileCapitalUsageTypePicklist.set(PCRSpendProfileCapitalUsageType.New, { value: "2", label: "New", defaultValue: false, active: true });
PCRSpendProfileCapitalUsageTypePicklist.set(PCRSpendProfileCapitalUsageType.Existing, { value: "3", label: "Existing", defaultValue: false, active: true });
