import { PartnerDto } from "@framework/dtos";

export const getLeadPartner = <T extends PartnerDto>(partners: T[]): T | undefined => partners.find(x => x.isLead);
