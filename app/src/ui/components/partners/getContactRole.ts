import { PartnerDto, ProjectContactDto } from "@framework/dtos";

export interface IContactRole {
  partner?: PartnerDto;
  contact: ProjectContactDto;
}

export const getContactRole = ({
  contacts,
  partners,
  partnerRole,
}: {
  contacts: ProjectContactDto[];
  partners: PartnerDto[];
  partnerRole: ProjectContactDto["role"];
}) => {
  const contactRoleData: IContactRole[] = [];

  for (const contact of contacts) {
    if (contact.role === partnerRole) {
      const partner = partners.find(partner => partner.accountId === contact.accountId);

      contactRoleData.push({
        partner,
        contact,
      });
    }
  }

  return contactRoleData;
};
