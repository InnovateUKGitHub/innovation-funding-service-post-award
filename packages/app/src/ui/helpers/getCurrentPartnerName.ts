import { PartnerDto } from "@framework/dtos/partnerDto";
import { getAuthRoles } from "@framework/types/authorisation";

const getCurrentPartnerName = (partners: Pick<PartnerDto, "roles" | "name">[]): string | undefined => {
  for (const partner of partners) {
    const { isMo, isFc, isPm } = getAuthRoles(partner.roles);
    if (isMo || isFc || isPm) return partner.name;
  }

  return;
};

export { getCurrentPartnerName };
