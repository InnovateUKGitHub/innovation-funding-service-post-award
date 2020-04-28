import { PicklistEntry } from "jsforce";
import { PCRProjectLocation } from "@framework/types";

export const PCRProjectLocationPicklist: Map<PCRProjectLocation, PicklistEntry> = new Map();

PCRProjectLocationPicklist.set(PCRProjectLocation.Unknown, { value: "1", label: "Unknown", defaultValue: false, active: true});
PCRProjectLocationPicklist.set(PCRProjectLocation.InsideTheUnitedKingdom, { value: "2", label: "Inside the United Kingdom", defaultValue: false, active: true });
PCRProjectLocationPicklist.set(PCRProjectLocation.OutsideTheUnitedKingdom, { value: "3", label: "Outside the United Kingdom", defaultValue: false, active: true });
