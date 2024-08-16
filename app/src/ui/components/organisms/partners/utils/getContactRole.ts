import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectContactDto } from "@framework/dtos/projectContactDto";

/**
 * Get the list of contact/partner pairs that match a specific partner role.
 *
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
 * @returns The list of contacts, matched to their corresponding partner for this specific partnerRole.
 */
export function getContactRole<
  C extends Pick<ProjectContactDto, "name" | "role" | "accountId">,
  P extends Pick<PartnerDto, "name" | "accountId">,
>({
  contacts,
  partners,
  partnerRole,
}: {
  contacts: C[];
  partners: P[];
  partnerRole: ProjectContactDto["role"];
}): { partner: P; contact: C }[] {
  return contacts
    .filter(contact => contact.role === partnerRole)
    .map(contact => {
      const partner = partners.find(partner => partner.accountId === contact.accountId);

      return {
        partner,
        contact,
      };
    })
    .filter(x => typeof x.partner !== undefined)
    .sort((a, b) => {
      const partnerNameA = a.partner?.name ?? "";
      const partnerNameB = b.partner?.name ?? "";

      const contactComparison = a.contact.name.localeCompare(b.contact.name);
      const partnerComparison = partnerNameA.localeCompare(partnerNameB);

      return partnerComparison || contactComparison;
    }) as { partner: P; contact: C }[];
}
