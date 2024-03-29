import { sss } from "@server/util/salesforce-string-helpers";
import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export type SalesforceRole = "Project Manager" | "Monitoring officer" | "Finance contact" | "Associate";

export interface ISalesforceProjectContact {
  Id: string;
  Acc_AccountId__c: string | undefined;
  Acc_ProjectId__c: string;
  Acc_EmailOfSFContact__c: string;
  Acc_Role__c: SalesforceRole;
  RoleName: string;
  Acc_ContactId__r: {
    Id: string;
    Name: string;
    Email: string;
  };
  Acc_UserId__r: {
    Name: string;
    Username: string;
  } | null;
}

type UserResult = { ContactId: string };

export interface IProjectContactsRepository {
  getAllByProjectId(projectId: ProjectId): Promise<ISalesforceProjectContact[]>;
  getAllForUser(login: string): Promise<ISalesforceProjectContact[]>;
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

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_AccountId__c",
    "Acc_ProjectId__c",
    "Acc_EmailOfSFContact__c",
    "Acc_Role__c",
    "toLabel(Acc_Role__c) RoleName",
    "Acc_ContactId__r.Id",
    "Acc_ContactId__r.Name",
    "Acc_ContactId__r.Email",
    "Acc_UserId__r.Name",
    "Acc_UserId__r.Username",
  ];

  getAllByProjectId(projectId: ProjectId): Promise<ISalesforceProjectContact[]> {
    return this.where(`Acc_ProjectId__c = '${sss(projectId)}'`);
  }

  async getAllForUser(email: string): Promise<ISalesforceProjectContact[]> {
    const conn = await this.getSalesforceConnection();

    const userResult: Partial<UserResult> | undefined | Error = (await conn
      .sobject<UserResult>("User")
      .select(["ContactId"])
      .where({ Username: email })
      .execute()
      .then(x => x.pop())
      .catch(e => this.constructError(e))) as UserResult; // type hack here

    return this.where(`Acc_ContactId__c = '${sss(userResult?.ContactId ?? "")}'`);
  }
}
