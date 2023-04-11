import { PartnerDtoGql } from "@framework/dtos";

export type PartnerNameValues = Pick<PartnerDtoGql, "name" | "isWithdrawn" | "isLead">;

/**
 * getPartnerName
 *
 * @returns name of partner with suffix `(withdrawn)` or `(Lead)` if relevant for that partner
 */
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
