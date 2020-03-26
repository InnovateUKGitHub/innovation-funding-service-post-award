import { PicklistEntry } from "jsforce";
import { PCRParticipantSize } from "@framework/types";

export const PCRParticipantSizePicklist: Map<PCRParticipantSize, PicklistEntry> = new Map();

PCRParticipantSizePicklist.set(PCRParticipantSize.Unknown, { value: "1", label: "Unknown", defaultValue: false, active: true});
PCRParticipantSizePicklist.set(PCRParticipantSize.Academic, { value: "2", label: "Academic", defaultValue: false, active: true });
PCRParticipantSizePicklist.set(PCRParticipantSize.Small, { value: "3", label: "Small", defaultValue: false, active: true });
PCRParticipantSizePicklist.set(PCRParticipantSize.Medium, { value: "4", label: "Medium", defaultValue: false, active: true });
PCRParticipantSizePicklist.set(PCRParticipantSize.Large, { value: "5", label: "Large", defaultValue: false, active: true });
