// tslint:disable:no-bitwise
import { IContext, QueryBase } from "../common/context";
import { ProjectRole } from "../../../types";
import { SalesforceRole } from "../../repositories";

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

export class GetAllProjectRolesForUser extends QueryBase<{ [key: string]: IRoleInfo }> {
  protected Run(context: IContext): Promise<{ [key: string]: IRoleInfo }> {
    return context.caches.projectRoles.fetchAsync(context.user.email, () => this.getProjectRoles(context));
  }

  private async getProjectRoles(context: IContext): Promise<{ [key: string]: IRoleInfo }> {
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
