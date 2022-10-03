import { getAuthRoles, PartnerDto } from "@framework/types";

const getCurrentPartnerName = (partners: PartnerDto[]): string | undefined => {
  for (const partner of partners) {
    const { isMo, isFc, isPm } = getAuthRoles(partner.roles);
    if (isMo || isFc || isPm) return partner.name;
  }

  return;
};

export { getCurrentPartnerName };
