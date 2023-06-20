import { PCRProjectRole } from "@framework/constants/pcrConstants";
import { PicklistEntry } from "jsforce";

export const pcrProjectRolesPicklist: Map<PCRProjectRole, PicklistEntry> = new Map();

// TODO populate this
pcrProjectRolesPicklist.set(PCRProjectRole.Unknown, {
  value: "1",
  label: "Unknown",
  defaultValue: false,
  active: true,
});
