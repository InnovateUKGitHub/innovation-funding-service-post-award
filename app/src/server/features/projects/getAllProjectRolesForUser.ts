import { Authorisation, getAuthRoles, IContext, ProjectRole } from "@framework/types";
import { SalesforceProjectRole } from "@server/constants/enums";
import { Partner } from "@framework/entities";
import { QueryBase } from "../common/queryBase";
import { ISalesforceProjectContact, SalesforceRole } from "../../repositories";

export interface IRoleInfo {
  projectRoles: ProjectRole;
  partnerRoles: { [key: string]: ProjectRole };
}

export class GetAllProjectRolesForUser extends QueryBase<Authorisation> {
  public async run(context: IContext): Promise<Authorisation> {
    const email = context.user && context.user.email;

    if (!email) {
      return new Authorisation({});
    } else if (
      email === context.config.salesforceServiceUser.serviceUsername ||
      email === context.config.bankDetailsValidationUser.serviceUsername
    ) {
      return new Authorisation(
        await context.caches.projectRoles.fetchAsync(email, () => this.getServiceAccountRoles(context)),
      );
    } else {
      return new Authorisation(
        await context.caches.projectRoles.fetchAsync(email, () => this.getProjectRoles(email, context)),
      );
    }
  }

  private async getProjectRoles(email: string, context: IContext) {
    const contacts = await context.repositories.projectContacts.getAllForUser(email);
    const partners = await context.repositories.partners.getAll();

    // get all rows grouped by project into lookup
    return contacts.reduce<{ [key: string]: IRoleInfo }>((allRoles, contact) => {
      const newProjectRole = this.getProjectRole(contact.Acc_Role__c);

      // get contact for project and if null initalise to empty and assign to allRoles
      const roleInfo = (allRoles[contact.Acc_ProjectId__c] =
        allRoles[contact.Acc_ProjectId__c] || this.getEmptyRoleInfo());

      roleInfo.projectRoles = roleInfo.projectRoles | newProjectRole;

      partners.forEach(partner => {
        roleInfo.partnerRoles[partner.id] = roleInfo.partnerRoles[partner.id] | ProjectRole.Unknown;
        // if this is a partner level contact then add it at the partner level too
        if (this.isPartnerContact(contact, partner) && this.isPartnerLevelRole(newProjectRole, partner)) {
          roleInfo.partnerRoles[partner.id] = roleInfo.partnerRoles[partner.id] | newProjectRole;
        }
      });

      return allRoles;
    }, {});
  }

  private isPartnerContact(contact: ISalesforceProjectContact, partner: Partner): boolean {
    return !!(contact.Acc_AccountId__c && partner.accountId === contact.Acc_AccountId__c);
  }

  private isPartnerLevelRole(projectRole: ProjectRole, partner: Partner): boolean {
    const { isFc, isPm } = getAuthRoles(projectRole);

    return isFc || (isPm && partner.projectRole === SalesforceProjectRole.ProjectLead);
  }

  /**
   * Obtain a full-access permission-set for the system user.
   *
   * @param context The system user context.
   * @returns The full permissions for all projects and it's associated partners
   */
  private async getServiceAccountRoles(context: IContext): Promise<{ [key: string]: IRoleInfo }> {
    const projects = await context.repositories.projects.getAll();
    const partners = await context.repositories.partners.getAll();
    const allRoles = ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager | ProjectRole.FinancialContact;

    // Create an empty roles set.
    const roles: Record<string, IRoleInfo> = {};

    // Collate a list of all possible project IDs.
    // If the project id doesn't exist in projects list, it will be included via the partners project id.
    const projectIds = [...projects.map(p => p.Id), ...partners.map(p => p.projectId)];

    // For each project...
    for (const project of projectIds) {
      // Initialise the project with all possible roles.
      roles[project] = {
        projectRoles: allRoles,
        partnerRoles: {},
      };
    }

    // For each partner...
    for (const partner of partners) {
      // Initialise each partner of the project with all the possible roles.
      roles[partner.projectId].partnerRoles[partner.id] = allRoles;
    }

    // Give back the super-user permission-set.
    return roles;
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
    return {
      projectRoles: ProjectRole.Unknown,
      partnerRoles: {},
    };
  }
}
