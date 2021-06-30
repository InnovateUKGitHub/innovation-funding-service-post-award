import { PartnerDto } from "@framework/dtos";

export type PartnerNameValues = Pick<PartnerDto, "name" | "isWithdrawn" | "isLead">;

export function getPartnerName(partner?: PartnerNameValues | null, showIsLead = false, showWithdrawn = true) {
  if (!partner) return "";

  let finalName = partner.name;

  if (showWithdrawn && partner.isWithdrawn) {
    finalName += " (withdrawn)";
  }
  if (showIsLead && partner.isLead) {
    finalName += " (Lead)";
  }

  return finalName;
}
