import { PicklistEntry } from "jsforce";
import { PCRParticipantSize } from "@framework/types";

export const pcrParticipantSizePicklist: Map<PCRParticipantSize, PicklistEntry> = new Map();

pcrParticipantSizePicklist.set(PCRParticipantSize.Unknown, { value: "1", label: "Unknown", defaultValue: false, active: true});
pcrParticipantSizePicklist.set(PCRParticipantSize.Academic, { value: "2", label: "Academic", defaultValue: false, active: true });
pcrParticipantSizePicklist.set(PCRParticipantSize.Small, { value: "3", label: "Small", defaultValue: false, active: true });
pcrParticipantSizePicklist.set(PCRParticipantSize.Medium, { value: "4", label: "Medium", defaultValue: false, active: true });
pcrParticipantSizePicklist.set(PCRParticipantSize.Large, { value: "5", label: "Large", defaultValue: false, active: true });
