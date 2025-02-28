import { PartnerDto } from "@framework/dtos/partnerDto";

export const getLeadPartner = <T extends Pick<PartnerDto, "isLead">>(partners: T[]): T | undefined =>
  partners.find(x => x.isLead);

export const sortPartnersLeadFirst = <T extends Pick<PartnerDto, "isLead">>(partners: T[]): T[] => [
  ...partners.filter(x => x.isLead),
  ...partners.filter(x => !x.isLead),
];

export const partnerSorterLeadFirst = (a: Pick<PartnerDto, "isLead">, b: Pick<PartnerDto, "isLead">) => {
  return a.isLead && !b.isLead ? -1 : 1;
};

export const partnerSorterAlphabetical = (a: Pick<PartnerDto, "name">, b: Pick<PartnerDto, "name">) => {
  return a.name < b.name ? -1 : 1;
};
