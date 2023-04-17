import { PartnerDto } from "@framework/dtos";

export const getLeadPartner = <T extends Pick<PartnerDto, "isLead">>(partners: T[]): T | undefined =>
  partners.find(x => x.isLead);

export const sortPartnersLeadFirst = <T extends Pick<PartnerDto, "isLead">>(partners: T[]): T[] => [
  ...partners.filter(x => x.isLead),
  ...partners.filter(x => !x.isLead),
];
