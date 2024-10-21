import { ProjectRolePermissionBits } from "@framework/constants/project";
import { IRoleInfo } from "@server/features/projects/getAllProjectRolesForUser";

type AvailableAuthRoles = "Associate" | "Fc" | "Mo" | "Pm" | "PmOrMo" | "PmAndFc" | "Unknown" | "SuperAdmin";

/**
 * Gets object with auth roles as series of booleans
 */
export function getAuthRoles(role: ProjectRolePermissionBits | SfRoles): Record<`is${AvailableAuthRoles}`, boolean> {
  let isFc: boolean;
  let isPm: boolean;
  let isMo: boolean;
  let isAssociate: boolean;

  let isUnknown = false;
  if (typeof role == "number") {
    isUnknown = role === ProjectRolePermissionBits.Unknown;
    isFc = !!(role & ProjectRolePermissionBits.FinancialContact);
    isPm = !!(role & ProjectRolePermissionBits.ProjectManager);
    isMo = !!(role & ProjectRolePermissionBits.MonitoringOfficer);
    isAssociate = !!(role & ProjectRolePermissionBits.Associate);
  } else {
    isFc = role.isFc;
    isPm = role.isPm;
    isMo = role.isMo;
    isAssociate = role.isAssociate;
  }

  const isSuperAdmin = isFc && isPm && isMo;

  const isPmOrMo = isPm || isMo;
  const isPmAndFc = !isMo && isFc && isPm;

  return {
    isUnknown,
    isMo,
    isFc,
    isPm,
    isSuperAdmin,
    isPmAndFc,
    isPmOrMo,
    isAssociate,
  };
}

class RoleChecker {
  private readonly permissions: ProjectRolePermissionBits;
  constructor(roles: ProjectRolePermissionBits) {
    this.permissions = roles;
  }

  public hasRole(role: ProjectRolePermissionBits): boolean {
    return this.hasAllRoles(role);
  }

  public hasOnlyRole(role: ProjectRolePermissionBits): boolean {
    return this.permissions === role;
  }

  public hasAllRoles(...roles: ProjectRolePermissionBits[]): boolean {
    const combinedRoles = this.combineRoles(roles);
    return (this.permissions & combinedRoles) === combinedRoles;
  }

  public hasAnyRoles(...roles: ProjectRolePermissionBits[]): boolean {
    const combinedRoles = this.combineRoles(roles);
    return (this.permissions & combinedRoles) !== ProjectRolePermissionBits.Unknown;
  }

  public getRoles() {
    return this.permissions;
  }

  private combineRoles(roles: ProjectRolePermissionBits[]) {
    return roles.reduce((combined, r) => (combined |= r), ProjectRolePermissionBits.Unknown);
  }
}

// This class acts as a helper for the role information cached on the server
export class Authorisation {
  constructor(roles: { [key: string]: IRoleInfo }) {
    this.permissions = roles;
  }

  public readonly permissions: { [key: string]: IRoleInfo };

  public forPartner(projectId: ProjectId, partnerId: PartnerId | LinkedEntityId) {
    const roles = this.getRolesForPartner(projectId, partnerId);
    return new RoleChecker(roles);
  }

  public forProject(projectId: ProjectId) {
    const roles = this.getRolesForProject(projectId);
    return new RoleChecker(roles);
  }

  private getRolesForPartner(projectId: ProjectId, partnerId: PartnerId | LinkedEntityId) {
    const project = this.permissions && this.permissions[projectId];
    if (project) {
      const partner = project.partnerRoles[partnerId];
      if (partner !== undefined) {
        return partner;
      }
    }
    return ProjectRolePermissionBits.Unknown;
  }

  private getRolesForProject(projectId: ProjectId) {
    const project = this.permissions && this.permissions[projectId];
    if (project) {
      return project.projectRoles;
    }
    return ProjectRolePermissionBits.Unknown;
  }
}
