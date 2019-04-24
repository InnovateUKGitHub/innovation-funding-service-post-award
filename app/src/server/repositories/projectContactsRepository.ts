import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export type SalesforceRole = "Project Manager" | "Monitoring officer" | "Finance contact";

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
}

export interface IProjectContactsRepository {
  getAllByProjectId(projectId: string): Promise<ISalesforceProjectContact[]>;
  getAllForUser(login: string): Promise<ISalesforceProjectContact[]>;
}

export class ProjectContactsRepository extends SalesforceRepositoryBase<ISalesforceProjectContact> implements IProjectContactsRepository {

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
  ];

  getAllByProjectId(projectId: string): Promise<ISalesforceProjectContact[]> {
    return this.where(`Acc_ProjectId__c = '${projectId}' AND Acc_Role__c != 'Innovation lead'`);
  }

  getAllForUser(email: string): Promise<ISalesforceProjectContact[]> {
    // ToDo: see if we can/should get access to the login rather than the email...
    // It may be correct to use the contact email - salesforce are expecting the contact email to always equal the user login
    // only a problem if they dont
    return this.where(`Acc_ContactId__r.Email = '${email}'`);
  }
}
