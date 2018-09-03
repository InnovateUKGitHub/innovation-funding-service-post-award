import { ICommand, IContext, IQuery, IClock } from "../../src/server/features/common/context";
import { IContactsRepository, ISalesforceContact } from "../../src/server/repositories/contactsRepository";
import { IProjectRepository, ISalesforceProject } from "../../src/server/repositories/projectsRepository";
import { ISalesforcePartner, IPartnerRepository } from "../../src/server/repositories/partnersRepository";
import { ISalesforceProjectContact, IProjectContactsRepository } from "../../src/server/repositories/projectContactsRepository";

export abstract class TestRepository<T> {
    Items: T[] = [];

    protected getOne(conditional: (item: T) => boolean): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const found = this.Items.find(x => conditional(x));
            if (found) {
                resolve(found);
            }
            else {
                reject(new Error("NOT FOUND"));
            }
        });
    }

    protected getWhere(conditional: (item: T) => boolean): Promise<T[]> {
        return new Promise<T[]>((resolve) => {
            const found = this.Items.filter(x => conditional(x));
            resolve(found);
        });
    }

    protected getAll(): Promise<T[]> {
        return Promise.resolve(this.Items);
    }
}

export class ContactsRepository extends TestRepository<ISalesforceContact> implements IContactsRepository {
    getById(id: String): Promise<ISalesforceContact> {
        return super.getOne(x => x.Id == id);
    }

    getAll(): Promise<ISalesforceContact[]> {
        return super.getAll();
    }
}

export class ProjectsRepository extends TestRepository<ISalesforceProject> implements IProjectRepository {
    getById(id: String) {
        return super.getOne(x => x.Id == id);
    }

    getAll() {
        return super.getAll();
    }
}

export class PartnerRepository extends TestRepository<ISalesforcePartner> implements IPartnerRepository {
    getAllByProjectId(projectId: string): Promise<ISalesforcePartner[]> {
        return super.getWhere(x => x.Acc_ProjectId__c === projectId);
    }

}


export class ProjectContactRepository extends TestRepository<ISalesforceProjectContact> implements IProjectContactsRepository {
    getAllByProjectId(projectId: string): Promise<ISalesforceProjectContact[]> {
        return super.getWhere(x => x.Acc_ProjectId__c === projectId);
    }
}

export class TestContext implements IContext {
    private testClock: Date = new Date();

    public repositories = {
        contacts: new ContactsRepository(),
        projects: new ProjectsRepository(),
        partners: new PartnerRepository(),
        projectContacts: new ProjectContactRepository()
    };

    public config = {
        ifsApplicationUrl: "",
        ifsGrantLetterUrl: ""
    };

    public runQuery<TResult>(query: IQuery<TResult>): Promise<TResult> {
        return query.Run(this as IContext);
    }

    public runCommand<TResult>(command: ICommand<TResult>): Promise<TResult> {
        return command.Run(this as IContext);
    }

    public testData = {
        range: <T>(no: number, create: (seed: number, index: number) => T) => {
            return Array.from({ length: no }, (_, i) => create(i + 1, i));
        },
        createContact: (update?: (item: ISalesforceContact) => void) => {
            let seed = this.repositories.contacts.Items.length + 1;

            let newItem = {
                Id: "Contact" + seed,
                Salutation: "Mr",
                LastName: "James" + seed,
                FirstName: "Joyce" + seed,
                Email: "james" + seed + "@test.com",
                MailingStreet: "",
                MailingCity: "",
                MailingState: "",
                MailingPostalCode: "",
            } as ISalesforceContact;

            update && update(newItem);

            this.repositories.contacts.Items.push(newItem);

            return newItem;
        },
        createProject: (update?: (item: ISalesforceProject) => void) => {
            let seed = this.repositories.projects.Items.length + 1;

            let newItem = {
                Id: "Project" + seed,
                Acc_ProjectTitle__c: "Project " + seed
            } as ISalesforceProject;

            update && update(newItem);

            this.repositories.projects.Items.push(newItem);

            return newItem;
        },
        createPartner: (project?: ISalesforceProject, update?: (item: ISalesforcePartner) => void) => {
            let seed = this.repositories.partners.Items.length + 1;
            project = project || this.testData.createProject();

            let newItem: ISalesforcePartner = {
                Id: `Partner${seed}`,
                Acc_AccountId__r: {
                    Id: `AccountId${seed}`,
                    Name: `Participant Name ${seed}`
                },
                Acc_ParticipantSize__c: "Large",
                Acc_ParticipantType__c: "Accedemic",
                Acc_ProjectRole__c: "Project Lead",
                Acc_ProjectId__c: project.Id
            };

            update && update(newItem);

            this.repositories.partners.Items.push(newItem);

            return newItem;
        },
        createProjectContact: (project?: ISalesforceProject, partner?: ISalesforcePartner, update?: (item: ISalesforceProjectContact) => void) => {

            project = project || this.testData.createProject();
            partner = partner || this.testData.createPartner(project);

            let seed = this.repositories.projectContacts.Items.length + 1;

            let newItem: ISalesforceProjectContact = {
                Id: `ProjectContact${seed}`,
                Acc_ProjectId__c: project.Id,
                Acc_AccountId__c: partner && partner.Acc_AccountId__r && partner.Acc_AccountId__r.Id,
                Acc_EmailOfSFContact__c: `projectcontact${seed}@text.com`,
                Acc_ContactId__r: {
                    Id: "Contact" + seed,
                    Name: `Ms Contact ${seed}`,
                },
                Acc_Role__c: "Finance officer",
            };

            update && update(newItem);

            this.repositories.projectContacts.Items.push(newItem);

            return newItem;
        },
        setClock: (value: string) => {
          const bits = value.split("/") as any[];
          const date = new Date(value);
          date.setHours(12);
          date.setFullYear(bits[0], bits[1] - 1, bits[2]);
          this.testClock = new Date(date);
        }
    };

    public clock(): IClock {
      const clock: IClock = {
        today: () => this.testClock,
        parse: (value: string) => new Date(value)
      };
      return clock;
    }
}
