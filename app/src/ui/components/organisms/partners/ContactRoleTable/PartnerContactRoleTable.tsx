import { PartnerDtoGql } from "@framework/dtos/partnerDto";
import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { ReactNode } from "react";
import { createTypedTable } from "@ui/components/molecules/Table/Table";
import { getPartnerName } from "../utils/partnerName";

type PartnersTableType = {
  contact: Pick<ProjectContactDto, "name" | "email">;
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
