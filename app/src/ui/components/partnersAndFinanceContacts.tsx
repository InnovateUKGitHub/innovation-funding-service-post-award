import React from "react";
import { TypedTable } from "./table";
import { PartnerDto } from "@framework/types";
import { PartnerName } from "@ui/components/partners";

interface Props {
  partners: PartnerDto[];
  contacts: ProjectContactDto[];
}

export const PartnersAndFinanceContacts: React.FunctionComponent<Props> = (props) => {
  const partnersAndContactsData = props.partners.map(partner => ({
    partner,
    financeContact: props.contacts.find(x => x.accountId === partner.accountId && x.role === "Finance contact")
  }));
  const PartnersTable = TypedTable<typeof partnersAndContactsData[0]>();

  return (
    <PartnersTable.Table qa="partner-details" data={partnersAndContactsData}>
      <PartnersTable.String header="Name" value={x => x.financeContact && x.financeContact.name || ""} qa="fc-name" />
      <PartnersTable.Custom header="Partner" value={x => <PartnerName partner={x.partner} showIsLead={true}/>} qa="partner-name"/>
      <PartnersTable.String header="Partner type" value={x => x.partner.type} qa="partner-type"/>
      <PartnersTable.Email header="Email" value={x => x.financeContact && x.financeContact.email || ""} qa="fc-email" />
    </PartnersTable.Table>
  );
};
