import { IPicklistEntry, PCRSpendProfileOverheadRate } from "@framework/types";

export const PCRSpendProfileOverheadRatePicklist: Map<PCRSpendProfileOverheadRate, IPicklistEntry> = new Map();

PCRSpendProfileOverheadRatePicklist.set(PCRSpendProfileOverheadRate.Zero, { value: "0%", label: "Zero", active: true });
PCRSpendProfileOverheadRatePicklist.set(PCRSpendProfileOverheadRate.Twenty, { value: "20%", label: "Twenty", active: true });
PCRSpendProfileOverheadRatePicklist.set(PCRSpendProfileOverheadRate.Calculated, { value: "Calculated", label: "Calculated", active: true });
PCRSpendProfileOverheadRatePicklist.set(PCRSpendProfileOverheadRate.Unknown, { value: "Unknown", label: "Unknown", active: true });
