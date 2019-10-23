import { QueryBase } from "../common/queryBase";
import { ISalesforcePartner, ISalesforceProjectContact, SalesforceProjectRole, SalesforceRole } from "../../repositories";
import { Authorisation, IContext, ProjectRole } from "@framework/types";

export interface IRoleInfo {
  projectRoles: ProjectRole;
  partnerRoles: { [key: string]: ProjectRole };
}

export class GetAllProjectRolesForUser extends QueryBase<Authorisation> {
  public async Run(context: IContext): Promise<Authorisation> {
    const email = context.user && context.user.email;

    if (!email) {
      return new Authorisation({});
    }
    else if (email === context.config.salesforce.serivceUsername) {
      return new Authorisation(await context.caches.projectRoles.fetchAsync(email, () => this.getServiceAccountRoles(context)));
    }
    else {
      return new Authorisation(await context.caches.projectRoles.fetchAsync(email, () => this.getProjectRoles(email, context)));
    }
  }

  private async getProjectRoles(email: string, context: IContext) {
    const contacts = await context.repositories.projectContacts.getAllForUser(email);
    const partners = await context.repositories.partners.getAll();

    // get all rows grouped by project into lookup
    return contacts.reduce<{ [key: string]: IRoleInfo }>((allRoles, contact) => {
      const newRole = this.getProjectRole(contact.Acc_Role__c);

      // get contact for project and if null initalise to empty and assign to allRoles
      const roleInfo = allRoles[contact.Acc_ProjectId__c] = (allRoles[contact.Acc_ProjectId__c] || this.getEmptyRoleInfo());

      roleInfo.projectRoles = roleInfo.projectRoles | newRole;

      partners.forEach(partner => {
        roleInfo.partnerRoles[partner.Id] = roleInfo.partnerRoles[partner.Id] | ProjectRole.Unknown;
        // if this is a partner level contact then add it at the partner level too
        if (this.isPartnerContact(contact, partner) && this.isPartnerLevelRole(newRole, partner)) {
          roleInfo.partnerRoles[partner.Id] = roleInfo.partnerRoles[partner.Id] | newRole;
        }
      });

      return allRoles;
    }, {});
  }

  private isPartnerContact(contact: ISalesforceProjectContact, partner: ISalesforcePartner): boolean {
    return !!contact.Acc_AccountId__c && partner.Acc_AccountId__r.Id === contact.Acc_AccountId__c;
  }

  private isPartnerLevelRole(role: ProjectRole, partner: ISalesforcePartner): boolean {
    return role === ProjectRole.FinancialContact || (role === ProjectRole.ProjectManager && partner.Acc_ProjectRole__c === SalesforceProjectRole.ProjectLead);
  }

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
      // get or create new project level roles record
      const project = roles[partner.Acc_ProjectId__r.Id] || (roles[partner.Acc_ProjectId__r.Id] = { projectRoles: allRoles, partnerRoles: {}});
      // set current partner level to all
      project.partnerRoles[partner.Id] = allRoles;
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

  private getEmptyRoleInfo(): IRoleInfo {
    return ({
      projectRoles: ProjectRole.Unknown,
      partnerRoles: {}
    });
  }

}
