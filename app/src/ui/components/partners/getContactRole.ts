import { PartnerDto, ProjectContactDto } from "@framework/dtos";

export interface IContactRole {
  partner?: PartnerDto;
  contact: ProjectContactDto;
}

/**
 * Get the list of contact/partner pairs that match a specific partner role.
 *
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
 * @returns The list of contacts, matched to their corresponding partner for this specific partnerRole.
 */
export const getContactRole = ({
  contacts,
  partners,
  partnerRole,
}: {
  contacts: ProjectContactDto[];
  partners: PartnerDto[];
  partnerRole: ProjectContactDto["role"];
}) =>
  contacts
    .filter(contact => contact.role === partnerRole)
    .map(contact => {
      const partner = partners.find(partner => partner.accountId === contact.accountId);

      return {
        partner,
        contact,
      };
    })
    .sort((a, b) => {
      const partnerNameA = a.partner?.name ?? "";
      const partnerNameB = b.partner?.name ?? "";

      const contactComparison = a.contact.name.localeCompare(b.contact.name);
      const partnerComparison = partnerNameA.localeCompare(partnerNameB);

      return partnerComparison || contactComparison;
    });
