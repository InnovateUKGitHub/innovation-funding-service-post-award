export const getLeadPartner = <T extends { isLead: boolean }>(partners: T[]): T | undefined =>
  partners.find(x => x.isLead);
