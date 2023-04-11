import { getPartnerName } from "@ui/components/partners";
import { ReactNode } from "react";
import { createTypedTable } from "./table";
import { PartnerDtoGql, ProjectContactDto } from "@framework/dtos";

type PartnersTableType = {
  contact: ProjectContactDto;
  partner: Pick<PartnerDtoGql, "name" | "isWithdrawn" | "isLead">;
};

export interface PartnersAndFinanceContactsProps {
  comment?: ReactNode;
  footnote?: ReactNode;
  contactRoles: PartnersTableType[];
  qa: string;
  hidePartnerColumn?: boolean;
}

const PartnersTable = createTypedTable<PartnersTableType>();

export const PartnerContactRoleTable = ({
  contactRoles,
  comment,
  footnote,
  qa,
  hidePartnerColumn = false,
}: PartnersAndFinanceContactsProps) => {
  return (
    <>
      {comment}
      <PartnersTable.Table qa={qa} data={contactRoles}>
        {[
          <PartnersTable.String
            qa="fc-name"
            key="fc-name"
            header={x => x.projectContactLabels.contactName}
            value={x => x.contact?.name || ""}
          />,
          ...[
            !hidePartnerColumn
              ? [
                  <PartnersTable.Custom
                    qa="partner-name"
                    key="partner-name"
                    header={x => x.projectContactLabels.partnerName}
                    value={x => getPartnerName(x.partner, true)}
                  />,
                ]
              : [],
          ],
          <PartnersTable.Email
            qa="fc-email"
            key="fc-email"
            header={x => x.projectContactLabels.contactEmail}
            value={x => x.contact?.email || ""}
          />,
        ]}
      </PartnersTable.Table>
      {footnote}
    </>
  );
};
