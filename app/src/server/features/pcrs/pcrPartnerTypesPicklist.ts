import { PicklistEntry } from "jsforce";
import { PCRPartnerType } from "@framework/types";

export const pcrPartnerTypesPicklist: Map<PCRPartnerType, PicklistEntry> = new Map();

// TODO populate this
pcrPartnerTypesPicklist.set(PCRPartnerType.Unknown, {
  value: "1",
  label: "Unknown",
  defaultValue: false,
  active: true,
});
