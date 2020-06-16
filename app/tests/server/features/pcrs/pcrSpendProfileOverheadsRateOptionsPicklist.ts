import { PicklistEntry } from "jsforce";
import { PCRSpendProfileOverheadRate } from "@framework/types";

export const PCRSpendProfileOverheadRatePicklist: Map<PCRSpendProfileOverheadRate, PicklistEntry> = new Map();

PCRSpendProfileOverheadRatePicklist.set(PCRSpendProfileOverheadRate.Zero, { value: "0", label: "Zero", defaultValue: false, active: true });
PCRSpendProfileOverheadRatePicklist.set(PCRSpendProfileOverheadRate.Twenty, { value: "20", label: "Twenty", defaultValue: false, active: true });
PCRSpendProfileOverheadRatePicklist.set(PCRSpendProfileOverheadRate.Calculated, { value: "calculated", label: "Calculated", defaultValue: false, active: true });
PCRSpendProfileOverheadRatePicklist.set(PCRSpendProfileOverheadRate.Unknown, { value: "unknown", label: "Unknown", defaultValue: false, active: true });
