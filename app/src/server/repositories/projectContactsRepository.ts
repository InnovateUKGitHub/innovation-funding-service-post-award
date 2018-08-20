import SalesforceBase from "./salesforceBase";

export interface ISalesforceProjectContact {
    Id: string,
    ProjectId: string;
    AccountId?: string;
    Role__c: string;
    Name: string;
    EmailOfSFContact__c: string;
}

export interface IProjectContactsRepository {
    getAllByProjectId(projectId: string): Promise<ISalesforceProjectContact[]>;
}

function createProjectContact(seed: number, projectId: string): ISalesforceProjectContact {
    return {
        Id: "Contact " + seed,
        AccountId: "Account " + seed,
        EmailOfSFContact__c: "contact" + seed + "@test.com",
        ProjectId: projectId,
        Name: "Contact " + seed + " for proj " + projectId,
        Role__c: ["Monitoring Officer","Innovation Lead", "Project Lead"][seed % 3] 
    };
}

export class ProjectContactsRepository extends SalesforceBase<ISalesforceProjectContact> implements IProjectContactsRepository {
    constructor(){
        super("ProjectContactLink__c", ["TODO"])
    }
    
    getAllByProjectId(projectId: string): Promise<ISalesforceProjectContact[]> {
        let hardCoded : ISalesforceProjectContact[] = [
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
                AccountId: "Ooba"
            },
            {
                Id: "Contact3",
                ProjectId: projectId,
                Role__c: "Finance contact",
                Name: "Ralph Young",
                EmailOfSFContact__c: "ralph.young@ooba.example.com",
                AccountId: "Ooba"
            },
            {
                Id: "Contact4",
                ProjectId: projectId,
                Role__c: "Finance contact",
                Name: "Marian Stokes",
                EmailOfSFContact__c: "worth.email.test+marian@gmail.com",
                AccountId: "Gabtype"
            },
            {
                Id: "Contact5",
                ProjectId: projectId,
                Role__c: "Finance contact",
                Name: "Antonio Jenkins",
                EmailOfSFContact__c: "antonio.jenkins@jabbertype.example.com",
                AccountId: "Jabbertype"
            },
            {
                Id: "Contact6",
                ProjectId: projectId,
                Role__c: "Finance contact",
                Name: "Tina Taylor",
                EmailOfSFContact__c: "tina.taylor@wordpedia.example.com",
                AccountId: "Wordpedia"
            }        
        ];

        return Promise.resolve<ISalesforceProjectContact[]>(hardCoded);
    }
}
