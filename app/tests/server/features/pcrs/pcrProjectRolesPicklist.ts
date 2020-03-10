import { PicklistEntry } from "jsforce";
import { PCRProjectRole } from "@framework/types";

export const PCRProjectRolesPicklist: Map<PCRProjectRole, PicklistEntry> = new Map();

// TODO populate this
PCRProjectRolesPicklist.set(PCRProjectRole.Unknown, { value: "1", label: "Unknown", defaultValue: false, active: true});
