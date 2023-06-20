import { PCRPartnerType } from "@framework/constants/pcrConstants";
import { PicklistEntry } from "jsforce";

export const pcrPartnerTypesPicklist: Map<PCRPartnerType, PicklistEntry> = new Map();

// TODO populate this
pcrPartnerTypesPicklist.set(PCRPartnerType.Unknown, {
  value: "1",
  label: "Unknown",
  defaultValue: false,
  active: true,
});
