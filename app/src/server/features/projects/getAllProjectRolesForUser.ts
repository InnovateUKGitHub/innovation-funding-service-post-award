import { QueryBase } from "../common/queryBase";
import { Authorisation, ProjectRole } from "../../../types";
import { SalesforceRole } from "../../repositories";
import { IContext } from "../../../types/IContext";

export interface IRoleInfo {
  projectRoles: ProjectRole;
  partnerRoles: { [key: string]: ProjectRole };
}

export function getEmptyRoleInfo(): IRoleInfo {
  return ({
    projectRoles: ProjectRole.Unknown,
    partnerRoles: {}
  });
}

export class GetAllProjectRolesForUser extends QueryBase<Authorisation> {
  public async Run(context: IContext): Promise<Authorisation> {
    const permisions = await context.caches.projectRoles.fetchAsync(context.user.email, () => context.config.salesforceUsername !== context.user.email ? this.getProjectRoles(context) : this.getServiceAccountRoles(context));
    return new Authorisation(permisions);
  }

  private async getProjectRoles(context: IContext) {
    const roles = await context.repositories.projectContacts.getAllForUser(context.user.email);
    const partners = await context.repositories.partners.getAll();

    // get all rows grouped by project into lookup
    return roles.reduce<{ [key: string]: IRoleInfo }>((allRoles, current) => {
      const newRole = this.getProjectRole(current.Acc_Role__c);

      // get current for project and if null initalise to empty and assign to allRoles
      const roleInfo = allRoles[current.Acc_ProjectId__c] = (allRoles[current.Acc_ProjectId__c] || getEmptyRoleInfo());

      roleInfo.projectRoles = roleInfo.projectRoles | newRole;

      // if this is a partner level role then add it at the partner level too
      if (newRole === ProjectRole.FinancialContact && current.Acc_AccountId__c) {
        partners.filter(x => x.Acc_AccountId__r.Id === current.Acc_AccountId__c).forEach(x => {
          roleInfo.partnerRoles[x.Id] = roleInfo.partnerRoles[x.Id] | newRole;
        });
      }

      return allRoles;
    }, {});
  }

  // TODO remove before live
  private async getServiceAccountRoles(context: IContext): Promise<{ [key: string]: IRoleInfo }> {
    const projects = await context.repositories.projects.getAll();
    const partners = await context.repositories.partners.getAll();
    const allRoles = ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager | ProjectRole.FinancialContact;

    const projectRoles = projects.reduce<{ [key: string]: IRoleInfo }>((roles, project) => {
      roles[project.Id] = {
        projectRoles: allRoles,
        partnerRoles: {}
      };
      return roles;
    }, {});

    return partners.reduce((roles, partner) => {
      roles[partner.Acc_ProjectId__c].partnerRoles[partner.Id] = allRoles;
      return roles;
    }, projectRoles);
  }

  private getProjectRole(salesforceRole: SalesforceRole): ProjectRole {
    switch (salesforceRole) {
      case "Monitoring officer":
        return ProjectRole.MonitoringOfficer;
      case "Project Manager":
        return ProjectRole.ProjectManager;
      case "Finance contact":
        return ProjectRole.FinancialContact;
      default:
        return ProjectRole.Unknown;
    }
  }
}
