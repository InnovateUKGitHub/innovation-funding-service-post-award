import { PicklistEntry } from "jsforce";
import { PCRPartnerType } from "@framework/types";

export const PCRPartnerTypesPicklist: Map<PCRPartnerType, PicklistEntry> = new Map();

// TODO populate this
PCRPartnerTypesPicklist.set(PCRPartnerType.Unknown, { value: "1", label: "Unknown", defaultValue: false, active: true});
