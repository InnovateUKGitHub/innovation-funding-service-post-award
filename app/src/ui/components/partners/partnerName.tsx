import React from "react";

interface Props {
  partner: { name: string, isWithdrawn: boolean, isLead: boolean } | null | undefined;
  showWithdrawn?: boolean;
  showIsLead?: boolean;
}

export const PartnerName: React.FunctionComponent<Props> = ({ partner, showIsLead = false, showWithdrawn = true }) => {
  if (!partner) return null;
  let name = partner.name;
  if (showWithdrawn && partner.isWithdrawn) {
    name += " (withdrawn)";
  }
  if (showIsLead && partner.isLead) {
    name += " (Lead)";
  }
  return <React.Fragment>{name}</React.Fragment>;
};
