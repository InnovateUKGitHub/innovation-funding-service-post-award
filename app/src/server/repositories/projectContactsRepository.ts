// tslint:disable
import SalesforceBase from "./salesforceBase";
import { Connection } from "jsforce";

export interface ISalesforceProjectContact {
    Id: string;
    Acc_AccountId__c: string;
    Acc_ProjectId__c: string;
    Acc_EmailOfSFContact__c: string;
    Acc_Role__c: string;
    Acc_ContactId__r: {
        Id: string;
        Name: string;
    };
}

const fields = [
    "Id",
    "Acc_AccountId__c",
    "Acc_ProjectId__c",
    "Acc_EmailOfSFContact__c",
    "Acc_Role__c",
    "Acc_ContactId__r.Id",
    "Acc_ContactId__r.Name"
];

export interface IProjectContactsRepository {
    getAllByProjectId(projectId: string): Promise<ISalesforceProjectContact[]>;
}

export class ProjectContactsRepository extends SalesforceBase<ISalesforceProjectContact> implements IProjectContactsRepository {
    constructor(connection: () => Promise<Connection>) {
        super(connection, "Acc_ProjectContactLink__c", fields);
    }

    getAllByProjectId(projectId: string): Promise<ISalesforceProjectContact[]> {
        return this.whereFilter({ Acc_ProjectId__c: projectId });
    }
}
