import { PicklistEntry } from "jsforce";
import { PCRSpendProfileOverheadRate } from "@framework/types";

export const PCRSpendProfileOverheadRatePicklist: Map<PCRSpendProfileOverheadRate, PicklistEntry> = new Map();

PCRSpendProfileOverheadRatePicklist.set(0, { value: "0", label: "Zero", defaultValue: false, active: true });
PCRSpendProfileOverheadRatePicklist.set(20, { value: "20", label: "Twenty", defaultValue: false, active: true });
PCRSpendProfileOverheadRatePicklist.set("calculated", { value: "calculated", label: "Calculated", defaultValue: false, active: true });
PCRSpendProfileOverheadRatePicklist.set("unknown", { value: "unknown", label: "Unknown", defaultValue: false, active: true });
