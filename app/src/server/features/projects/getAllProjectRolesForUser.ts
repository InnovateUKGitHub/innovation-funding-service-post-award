import { QueryBase, IContext } from "../common/context";
import { ProjectRole } from "../../../types";
import { SalesforceRole } from "../../repositories";


export class GetAllProjectRolesForUser extends QueryBase<{[key:string]: ProjectRole}>{
  protected Run(context: IContext): Promise<{[key:string]: ProjectRole}> {
    return context.caches.projectRoles.fetchAsync(context.user.email, () => this.getProjectRoles(context));
  }

  private async getProjectRoles(context: IContext): Promise<{[key:string]: ProjectRole}> {
    const roles = await context.repositories.projectContacts.getAllForUser(context.user.email);
    
    // get all rows grouped by project into lookup
    return roles.reduce((r, current) => {
      const existing = r[current.Acc_ProjectId__c] || ProjectRole.Unknown;
      const newRole = this.getProjectRole(current.Acc_Role__c);
      r[current.Acc_ProjectId__c] = existing | newRole;
      return r;
    }, {} as { [key: string]: ProjectRole });
  }

  private getProjectRole(salesforceRole: SalesforceRole): ProjectRole {
    switch (salesforceRole) {
      case "Monitoring officer":
        return ProjectRole.MonitoringOfficer
      case "Project Manager":
        return ProjectRole.ProjectManager;
      case "Finance contact":
        return ProjectRole.FinancialContact;
      default:
        return ProjectRole.Unknown;
    }
  }
}