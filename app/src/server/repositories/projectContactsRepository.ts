// tslint:disable
import SalesforceBase from "./salesforceBase";
import { Connection } from "jsforce";

export type SalesforceRole = "Project Manager" | "Monitoring officer" | "Finance contact";

export interface ISalesforceProjectContact {
    Id: string;
    Acc_AccountId__c: string|undefined;
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

const fields = [
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

export interface IProjectContactsRepository {
    getAllByProjectId(projectId: string): Promise<ISalesforceProjectContact[]>;
    getAllForUser(login: string): Promise<ISalesforceProjectContact[]>;
}

export class ProjectContactsRepository extends SalesforceBase<ISalesforceProjectContact> implements IProjectContactsRepository {
    constructor(connection: () => Promise<Connection>) {
        super(connection, "Acc_ProjectContactLink__c", fields);
    }

    getAllByProjectId(projectId: string): Promise<ISalesforceProjectContact[]> {
        return this.where({ Acc_ProjectId__c: projectId });
    }

    getAllForUser(email: string): Promise<ISalesforceProjectContact[]> {
        // ToDo: see if we can get access to the login rather than the email...
        email = email.replace(".bjsspoc2", "");
        return this.where(`Acc_ContactId__r.Email = '${email}'`);
    }
}
