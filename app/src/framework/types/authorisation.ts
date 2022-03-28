import { ProjectRole } from "@framework/constants";
import { IRoleInfo } from "@server/features/projects/getAllProjectRolesForUser";

type AvailableAuthRoles = "Fc" | "Mo" | "Pm" | "PmOrMo" | "PmAndFc" | "Unknown" | "SuperAdmin";

export function getAuthRoles(role: ProjectRole): Record<`is${AvailableAuthRoles}`, boolean> {
  // Note: As 'Unknown' there is never an overlap so we check against itself
  const isUnknown = (role & ProjectRole.Unknown) === ProjectRole.Unknown && role === ProjectRole.Unknown;

  const isFc = !!(role & ProjectRole.FinancialContact);
  const isPm = !!(role & ProjectRole.ProjectManager);
  const isMo = !!(role & ProjectRole.MonitoringOfficer);

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
  };
}

class RoleChecker {
  private readonly permissions: ProjectRole;
  constructor(roles: ProjectRole) {
    this.permissions = roles;
  }

  public hasRole(role: ProjectRole): boolean {
    return this.hasAllRoles(role);
  }

  public hasOnlyRole(role: ProjectRole): boolean {
    return this.permissions === role;
  }

  public hasAllRoles(...roles: ProjectRole[]): boolean {
    const combinedRoles = this.combineRoles(roles);
    return (this.permissions & combinedRoles) === combinedRoles;
  }

  public hasAnyRoles(...roles: ProjectRole[]): boolean {
    const combinedRoles = this.combineRoles(roles);
    return (this.permissions & combinedRoles) !== ProjectRole.Unknown;
  }

  public getRoles() {
    return this.permissions;
  }

  private combineRoles(roles: ProjectRole[]) {
    return roles.reduce((combined, r) => (combined |= r), ProjectRole.Unknown);
  }
}

// This class acts as a helper for the role information cached on the server
export class Authorisation {
  constructor(roles: { [key: string]: IRoleInfo }) {
    this.permissions = roles;
  }

  public readonly permissions: { [key: string]: IRoleInfo };

  public forPartner(projectId: string, partnerId: string) {
    const roles = this.getRolesForPartner(projectId, partnerId);
    return new RoleChecker(roles);
  }

  public forProject(projectId: string) {
    const roles = this.getRolesForProject(projectId);
    return new RoleChecker(roles);
  }

  private getRolesForPartner(projectId: string, partnerId: string) {
    const project = this.permissions && this.permissions[projectId];
    if (project) {
      const partner = project.partnerRoles[partnerId];
      if (partner !== undefined) {
        return partner;
      }
    }
    return ProjectRole.Unknown;
  }

  private getRolesForProject(projectId: string) {
    const project = this.permissions && this.permissions[projectId];
    if (project) {
      return project.projectRoles;
    }
    return ProjectRole.Unknown;
  }
}
