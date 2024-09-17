import { soql } from "@server/util/salesforce-string-helpers";
import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export type SalesforceRole =
  | "Monitoring officer"
  | "Project Manager"
  | "Finance contact"
  | "Innovation lead"
  | "IPM"
  | "Associate"
  | "Main Company Contact"
  | "KB Admin";

export interface ISalesforceProjectContact {
  Id: ProjectContactLinkId;
  Acc_AccountId__c: AccountId | undefined;
  Acc_ProjectId__c: ProjectId;
  Acc_EmailOfSFContact__c: string;
  Acc_Role__c: SalesforceRole;
  RoleName: string;
  Acc_ContactId__r: {
    Id: ContactId;
    Name?: string;
    Email?: string;
    FirstName?: string;
    LastName?: string;
  } | null;
  Acc_UserId__r: {
    Id: string;
    Name?: string;
    Username?: string;
    FirstName?: string;
    LastName?: string;
  } | null;
  Acc_StartDate__c: string | null;
  Acc_EndDate__c: string | null;
  Associate_Start_Date__c: string | null;
  Acc_Inactive__c: boolean;
  Acc_New_Team_Member__c: boolean;
  Acc_Send_invitation__c: boolean;
  Acc_Edited__c: boolean;
  Acc_Replaced__c: boolean;
  Acc_UserId__c: string;
}

export interface IProjectContactsRepository {
  getById(pclId: ProjectContactLinkId): Promise<ISalesforceProjectContact>;
  getAllByProjectId(projectId: ProjectId): Promise<ISalesforceProjectContact[]>;
  getAllForUser(login: string): Promise<ISalesforceProjectContact[]>;
  insert(
    contact: PickRequiredFromPartial<
      ISalesforceProjectContact,
      "Acc_AccountId__c" | "Acc_ProjectId__c" | "Acc_EmailOfSFContact__c" | "Acc_Role__c"
    >,
  ): Promise<ProjectContactLinkId>;
  update(contacts: PickRequiredFromPartial<ISalesforceProjectContact, "Id">[]): Promise<boolean>;
}

/**
 * Project Contacts are the roles users are assigned to on the project
 *
 * Stored in Acc_ProjectContactLink__c and the role is a pick list Acc_Role__c
 */
export class ProjectContactsRepository
  extends SalesforceRepositoryBase<ISalesforceProjectContact>
  implements IProjectContactsRepository
{
  protected readonly salesforceObjectName = "Acc_ProjectContactLink__c";

  // create needs Acc_New_Team_Member__c and Acc_StartDate__c and Acc_Send_invitation__c
  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_AccountId__c",
    "Acc_ProjectId__c",
    "Acc_EmailOfSFContact__c",
    "Acc_Role__c",
    "toLabel(Acc_Role__c) RoleName",
    "Acc_ContactId__r.Id",
    "Acc_ContactId__r.Name",
    "Acc_ContactId__r.FirstName",
    "Acc_ContactId__r.LastName",
    "Acc_ContactId__r.Email",
    "Acc_UserId__r.Id",
    "Acc_UserId__r.Name",
    "Acc_UserId__r.Username",
    "Acc_UserId__r.FirstName",
    "Acc_UserId__r.LastName",
    "Acc_Inactive__c",
    "Acc_StartDate__c",
    // "Acc_New_Team_Member__c",
    // "Acc_Send_invitation__c",
    "Acc_Edited__c",
    "Acc_Replaced__c",
    "Acc_EndDate__c",
    "Acc_UserId__c",
    "Associate_Start_Date__c",
  ];

  getById(pclId: ProjectContactLinkId): Promise<ISalesforceProjectContact> {
    return super.loadItem({ Id: pclId });
  }

  getAllByProjectId(projectId: ProjectId): Promise<ISalesforceProjectContact[]> {
    return this.where(soql`Acc_ProjectId__c = ${projectId}`);
  }

  async getAllForUser(email: string): Promise<ISalesforceProjectContact[]> {
    return this.where(
      soql`Acc_ContactId__c IN (SELECT ContactId FROM User WHERE Username = ${email}) AND Acc_Inactive__c != true`,
    );
  }

  public async insert(
    contact: Pick<
      ISalesforceProjectContact,
      "Acc_AccountId__c" | "Acc_ProjectId__c" | "Acc_EmailOfSFContact__c" | "Acc_Role__c" | "Associate_Start_Date__c"
    >,
  ): Promise<ProjectContactLinkId> {
    return super.insertItem(contact) as Promise<ProjectContactLinkId>;
  }

  public async update(contacts: PickRequiredFromPartial<ISalesforceProjectContact, "Id">[]): Promise<boolean> {
    return super.updateAll(contacts);
  }
}
