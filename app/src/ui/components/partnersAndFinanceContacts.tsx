import { Content } from "@content/content";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";
import { PartnerDto, ProjectContactDto } from "@framework/types";
import { getPartnerName } from "@ui/components/partners";
import { ReactNode } from "react";
import { TypedTable } from "./table";

export interface PartnersAndFinanceContactsProps {
  partners: PartnerDto[];
  contacts: ProjectContactDto[];
  projectContactLabels: (content: Content) => ProjectContactLabels;
  comment?: ReactNode;
  footnote?: ReactNode;
}

export function PartnersAndFinanceContacts({
  contacts,
  partners,
  projectContactLabels,
  comment,
  footnote,
}: PartnersAndFinanceContactsProps) {
  const partnersAndContactsData = partners.map(partner => ({
    partner,
    financeContact: contacts.find(x => x.accountId === partner.accountId && x.role === "Finance contact"),
  }));

  const PartnersTable = TypedTable<typeof partnersAndContactsData[0]>();

  return (
    <>
      {comment}
      <PartnersTable.Table qa="finance-contact-details" data={partnersAndContactsData}>
        <PartnersTable.String
          qa="fc-name"
          header={x => projectContactLabels(x).contactName}
          value={x => x.financeContact?.name || ""}
        />

        <PartnersTable.Custom
          qa="partner-name"
          header={x => projectContactLabels(x).partnerName}
          value={x => getPartnerName(x.partner, true)}
        />

        <PartnersTable.Email
          qa="fc-email"
          header={x => projectContactLabels(x).contactEmail}
          value={x => x.financeContact?.email || ""}
        />
      </PartnersTable.Table>
      {footnote}
    </>
  );
}
