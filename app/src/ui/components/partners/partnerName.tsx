import React from "react";

interface Props {
  partner: { name: string; isWithdrawn: boolean; isLead: boolean } | null | undefined;
  showWithdrawn?: boolean;
  showIsLead?: boolean;
}

export function getPartnerName(
  partner: Props["partner"],
  showIsLead: Props["showIsLead"] = false,
  showWithdrawn: Props["showWithdrawn"] = true,
) {
  if (!partner) return "";

  let name = partner.name;

  if (showWithdrawn && partner.isWithdrawn) {
    name += " (withdrawn)";
  }
  if (showIsLead && partner.isLead) {
    name += " (Lead)";
  }
  return name;
}

/**
 * @deprecated Please use getPartnerName()
 */
export const PartnerName: React.FunctionComponent<Props> = ({ partner, showIsLead = false, showWithdrawn = true }) => {
  const name = getPartnerName(partner, showIsLead, showWithdrawn);

  if (!partner) return null;

  return <React.Fragment>{name}</React.Fragment>;
};
