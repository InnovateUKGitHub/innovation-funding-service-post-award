import { ProjectRolePermissionBits } from "@framework/constants/project";

export const convertRolesToPermissionsValue = (role: SfRoles | ProjectRolePermissionBits) => {
  if (typeof role === "number") return role as ProjectRolePermissionBits;
  let permissions = 0;
  if (role.isMo) permissions += ProjectRolePermissionBits.MonitoringOfficer;
  if (role.isPm) permissions += ProjectRolePermissionBits.ProjectManager;
  if (role.isFc) permissions += ProjectRolePermissionBits.FinancialContact;
  if (role.isAssociate) permissions += ProjectRolePermissionBits.Associate;
  return permissions;
};
