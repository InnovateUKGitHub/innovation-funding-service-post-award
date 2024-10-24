import { ProjectRolePermissionBits } from "@framework/constants/project";
import { SalesforceProjectRole } from "@framework/constants/salesforceProjectRole";
import { Partner } from "@framework/entities/partner";
import { Authorisation, getAuthRoles } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ISalesforceProjectContact, SalesforceRole } from "@server/repositories/projectContactsRepository";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";

export interface IRoleInfo {
  projectRoles: ProjectRolePermissionBits;
  partnerRoles: { [key: string]: ProjectRolePermissionBits };
}

export class GetAllProjectRolesForUser extends AuthorisedAsyncQueryBase<Authorisation> {
  public readonly runnableName: string = "GetAllProjectRolesForUser";
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
    const [contacts, partners] = await Promise.all([
      context.repositories.projectContacts.getAllForUser(email),
      context.repositories.partners.getAll(),
    ]);

    // get all rows grouped by project into lookup
    return contacts.reduce<{ [key: string]: IRoleInfo }>((allRoles, contact) => {
      const newProjectRole = this.getProjectRole(contact.Acc_Role__c);

      // get contact for project and if null initalise to empty and assign to allRoles
      const roleInfo = (allRoles[contact.Acc_ProjectId__c] =
        allRoles[contact.Acc_ProjectId__c] || this.getEmptyRoleInfo());

      roleInfo.projectRoles = roleInfo.projectRoles | newProjectRole;

      partners.forEach(partner => {
        roleInfo.partnerRoles[partner.id] = roleInfo.partnerRoles[partner.id] | ProjectRolePermissionBits.Unknown;
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

  private isPartnerLevelRole(projectRole: ProjectRolePermissionBits, partner: Partner): boolean {
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
    const [projects, partners] = await Promise.all([
      context.repositories.projects.getAll(),
      context.repositories.partners.getAll(),
    ]);

    const allRoles =
      ProjectRolePermissionBits.MonitoringOfficer |
      ProjectRolePermissionBits.ProjectManager |
      ProjectRolePermissionBits.FinancialContact |
      ProjectRolePermissionBits.Associate;

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

  private getProjectRole(salesforceRole: SalesforceRole): ProjectRolePermissionBits {
    switch (salesforceRole) {
      case "Monitoring officer":
        return ProjectRolePermissionBits.MonitoringOfficer;
      case "Project Manager":
        return ProjectRolePermissionBits.ProjectManager;
      case "Finance contact":
        return ProjectRolePermissionBits.FinancialContact;
      case "Associate":
        return ProjectRolePermissionBits.Associate;
      default:
        return ProjectRolePermissionBits.Unknown;
    }
  }

  private getEmptyRoleInfo(): IRoleInfo {
    return {
      projectRoles: ProjectRolePermissionBits.Unknown,
      partnerRoles: {},
    };
  }
}
