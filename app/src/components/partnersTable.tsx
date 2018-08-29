import React from "react";
import * as ACC from "./index";
import * as Dtos from "../models";

interface Props {
  partners: Dtos.PartnerDto[],
  contacts: Dtos.ProjectContactDto[],
}

export const PartnersTable: React.SFC<Props> = (props) => {
  const partnersAndContactsData = props.partners.map(partner => ({ partner, financeContact: props.contacts.find(x => x.accountId === partner.accountId && x.role === "Finance contact") }));
  console.log(partnersAndContactsData);
  const PartnersTable = ACC.Table.forData(partnersAndContactsData);

  return (
    <PartnersTable.Table qa="project-details-table">
      <PartnersTable.String header="Partner" value={x => x.partner.isLead ? `${x.partner.name} (Lead)` : x.partner.name} qa="partner-column"/>
      <PartnersTable.String header="Partner Type" value={x => x.partner.type} qa="partner-type-column"/>
      <PartnersTable.String header="Finance Contact" value={x => x.financeContact && x.financeContact.name || ""} qa="fc-column" />
      <PartnersTable.Email header="Email" value={x => x.financeContact && x.financeContact.email || ""} qa="email-column" />
    </PartnersTable.Table>
  );
};
