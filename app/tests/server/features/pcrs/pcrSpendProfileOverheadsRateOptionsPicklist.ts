import { IPicklistEntry, PCRSpendProfileOverheadRate } from "@framework/types";

export const pcrSpendProfileOverheadRatePicklist: Map<PCRSpendProfileOverheadRate, IPicklistEntry> = new Map();

pcrSpendProfileOverheadRatePicklist.set(PCRSpendProfileOverheadRate.Zero, { value: "0%", label: "Zero", active: true });
pcrSpendProfileOverheadRatePicklist.set(PCRSpendProfileOverheadRate.Twenty, { value: "20%", label: "Twenty", active: true });
pcrSpendProfileOverheadRatePicklist.set(PCRSpendProfileOverheadRate.Calculated, { value: "Calculated", label: "Calculated", active: true });
pcrSpendProfileOverheadRatePicklist.set(PCRSpendProfileOverheadRate.Unknown, { value: "Unknown", label: "Unknown", active: true });
