// tslint:disable
import SalesforceBase from "./salesforceBase";

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

export interface IProjectContactsRepository {
    getAllByProjectId(projectId: string): Promise<ISalesforceProjectContact[]>;
}

export class ProjectContactsRepository extends SalesforceBase<ISalesforceProjectContact> implements IProjectContactsRepository {
    constructor() {
        super("Acc_ProjectContactLink__c", ["Id", "Acc_AccountId__c", "Acc_ProjectId__c", "Acc_EmailOfSFContact__c", "Acc_Role__c", "Acc_ContactId__r.Id", "Acc_ContactId__r.Name"]);
    }

    getAllByProjectId(projectId: string): Promise<ISalesforceProjectContact[]> {
        return this.whereFilter(x => x.Acc_ProjectId__c === projectId);
        /*const hardCoded: ISalesforceProjectContact[] = [
            {
                Id: "Contact1",
                ProjectId: projectId,
                Role__c: "Monitoring officer",
                Name: "Thomas Filton",
                EmailOfSFContact__c: "thomas.filton@isee.example.com",
            },
            {
                Id: "Contact2",
                ProjectId: projectId,
                Role__c: "Project manager",
                Name: "Steve Smith",
                EmailOfSFContact__c: "steve.smith@isee.example.com",
                AccountId: "Partner1"
            },
            {
                Id: "Contact3",
                ProjectId: projectId,
                Role__c: "Finance contact",
                Name: "Ralph Young",
                EmailOfSFContact__c: "ralph.young@ooba.example.com",
                AccountId: "Partner1"
            },
            {
                Id: "Contact4",
                ProjectId: projectId,
                Role__c: "Finance contact",
                Name: "Marian Stokes",
                EmailOfSFContact__c: "worth.email.test+marian@gmail.com",
                AccountId: "Partner2"
            },
            {
                Id: "Contact5",
                ProjectId: projectId,
                Role__c: "Finance contact",
                Name: "Antonio Jenkins",
                EmailOfSFContact__c: "antonio.jenkins@jabbertype.example.com",
                AccountId: "Partner3"
            },
            {
                Id: "Contact6",
                ProjectId: projectId,
                Role__c: "Finance contact",
                Name: "Tina Taylor",
                EmailOfSFContact__c: "tina.taylor@wordpedia.example.com",
                AccountId: "Partner4"
            }
        ];

        return Promise.resolve<ISalesforceProjectContact[]>(hardCoded);*/
    }
}
