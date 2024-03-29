import { ProjectRole } from "@framework/constants/project";

export const convertRolesToPermissionsValue = (role: SfRoles | ProjectRole) => {
  if (typeof role === "number") return role as ProjectRole;
  let permissions = 0;
  if (role.isMo) permissions += ProjectRole.MonitoringOfficer;
  if (role.isPm) permissions += ProjectRole.ProjectManager;
  if (role.isFc) permissions += ProjectRole.FinancialContact;
  if (role.isAssociate) permissions += ProjectRole.Associate;
  return permissions;
};
