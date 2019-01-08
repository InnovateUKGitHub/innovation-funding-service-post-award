import React from "react";
import { TypedTable } from "./table";

interface Props {
  partners: PartnerDto[];
  contacts: ProjectContactDto[];
}

export const PartnersAndFinanceContacts: React.SFC<Props> = (props) => {
  const partnersAndContactsData = props.partners.map(partner => ({ partner, financeContact: props.contacts.find(x => x.accountId === partner.accountId && x.role === "Finance contact") }));
  const PartnersTable = TypedTable<typeof partnersAndContactsData[0]>();

  return (
    <PartnersTable.Table qa="partner-details" data={partnersAndContactsData}>
      <PartnersTable.String header="Partner" value={x => x.partner.isLead ? `${x.partner.name} (Lead)` : x.partner.name} qa="partner-name"/>
      <PartnersTable.String header="Partner type" value={x => x.partner.type} qa="partner-type"/>
      <PartnersTable.String header="Finance Contact" value={x => x.financeContact && x.financeContact.name || ""} qa="fc-name" />
      <PartnersTable.Email header="Email" value={x => x.financeContact && x.financeContact.email || ""} qa="fc-email" />
    </PartnersTable.Table>
  );
};
