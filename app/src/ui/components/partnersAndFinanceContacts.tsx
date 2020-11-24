import React from "react";
import { TypedTable } from "./table";
import { PartnerDto, ProjectContactDto } from "@framework/types";
import { PartnerName } from "@ui/components/partners";
import { Content } from "@content/content";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";

interface Props {
  partners: PartnerDto[];
  contacts: ProjectContactDto[];
  projectContactLabels: (content: Content) => ProjectContactLabels;
}

export const PartnersAndFinanceContacts: React.FunctionComponent<Props> = (props) => {
  const partnersAndContactsData = props.partners.map(partner => ({
    partner,
    financeContact: props.contacts.find(x => x.accountId === partner.accountId && x.role === "Finance contact")
  }));
  const PartnersTable = TypedTable<typeof partnersAndContactsData[0]>();

  return (
    <PartnersTable.Table qa="finance-contact-details" data={partnersAndContactsData}>
      <PartnersTable.String headerContent={x => props.projectContactLabels(x).contactName} value={x => x.financeContact && x.financeContact.name || ""} qa="fc-name" />
      <PartnersTable.Custom headerContent={x => props.projectContactLabels(x).partnerName} value={x => <PartnerName partner={x.partner} showIsLead={true}/>} qa="partner-name"/>
      <PartnersTable.Email headerContent={x => props.projectContactLabels(x).contactEmail} value={x => x.financeContact && x.financeContact.email || ""} qa="fc-email" />
    </PartnersTable.Table>
  );
};
