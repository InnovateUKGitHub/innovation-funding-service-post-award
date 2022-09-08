import { PicklistEntry } from "jsforce";
import { PCRProjectRole } from "@framework/types";

export const pcrProjectRolesPicklist: Map<PCRProjectRole, PicklistEntry> = new Map();

// TODO populate this
pcrProjectRolesPicklist.set(PCRProjectRole.Unknown, {
  value: "1",
  label: "Unknown",
  defaultValue: false,
  active: true,
});
