import { ProjectRole } from "@framework/constants";

export type Role = {
  isFc: boolean;
  isPm: boolean;
  isMo: boolean;
};

export const convertRolesToPermissionsValue = (role: Role) => {
  let permissions = 0;
  if (role.isMo) permissions += ProjectRole.MonitoringOfficer;
  if (role.isPm) permissions += ProjectRole.ProjectManager;
  if (role.isFc) permissions += ProjectRole.FinancialContact;
  return permissions;
};
