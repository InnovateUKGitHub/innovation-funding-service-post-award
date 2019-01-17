import { IRoleInfo } from "../server/features/projects/getAllProjectRolesForUser";
import { ProjectRole } from ".";

/// This class acts as a helper for the role infomation cached on the server
export class Authorisation {

  constructor(roles: { [key: string]: IRoleInfo }) {
    this.permissions = roles;
  }

  public readonly permissions: { [key: string]: IRoleInfo };

  public hasProjectRole(projectId: string, role: ProjectRole): boolean {
    return this.hasAllProjectRoles(projectId, role);
  }

  public hasAllProjectRoles(projectId: string, ...roles: ProjectRole[]): boolean {
    const combinedRoles = this.combineRoles(roles);
    return (this.getProjectRoles(projectId) & combinedRoles) === combinedRoles;
  }

  public hasAnyProjectRoles(projectId: string, ...roles: ProjectRole[]): boolean {
    const combinedRoles = this.combineRoles(roles);
    return (this.getProjectRoles(projectId) & combinedRoles) !== ProjectRole.Unknown;
  }

  public hasPartnerRole(projectId: string, partnerId: string, role: ProjectRole) {
    return this.hasAllPartnerRoles(projectId, partnerId, role);
  }

  public hasAllPartnerRoles(projectId: string, partnerId: string, ...roles: ProjectRole[]) {
    const combinedRoles = this.combineRoles(roles);
    return (this.getPartnerRoles(projectId, partnerId) & combinedRoles) === combinedRoles;
  }

  public hasAnyPartnerRoles(projectId: string, partnerId: string, ...roles: ProjectRole[]) {
    const combinedRoles = this.combineRoles(roles);
    return (this.getPartnerRoles(projectId, partnerId) & combinedRoles) !== ProjectRole.Unknown;
  }

  private combineRoles(roles: ProjectRole[]) {
    return roles.reduce((combined, r) => combined |= r, ProjectRole.Unknown);
  }

  public getProjectRoles(projectId: string) {
    const project = this.permissions && this.permissions[projectId];
    if (project) {
      return project.projectRoles;
    }
    return ProjectRole.Unknown;
  }

  public getPartnerRoles(projectId: string, partnerId: string) {
    const project = this.permissions && this.permissions[projectId];
    if (project) {
      const partner = project.partnerRoles[partnerId];
      if(partner) {
        return partner;
      }
    }
    return ProjectRole.Unknown;
  }
}
