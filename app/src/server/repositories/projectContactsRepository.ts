import SalesforceBase from "./salesforceBase";

export interface ISalesforceProjectContact {
    Id: string,
    ProjectId: string;
    AccountId: string;
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
        return Promise.resolve<ISalesforceProjectContact[]>([
            createProjectContact(1, projectId),
            createProjectContact(2, projectId),
            createProjectContact(3, projectId),
            createProjectContact(4, projectId)
        ]);
    }
}
