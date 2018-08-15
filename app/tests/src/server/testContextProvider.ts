import { ICommand, IContext, IQuery } from "../../../src/server/features/common/context";
import { IContactsRepository, ISalesforceContact } from "../../../src/server/repositories/contactsRepository";
import { IProjectRepository, ISalesforceProject } from "../../../src/server/repositories/projectsRepository";
import { ISalesforcePartner, IPartnerRepository } from "../../../src/server/repositories/partnersRepository";
import { ISalesforceProjectContact, IProjectContactsRepository } from "../../../src/server/repositories/projectContactsRepository";

export abstract class TestRepository<T> {
    Items: T[] = []

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
    getById(id: String): Promise<ISalesforceProject> {
        return super.getOne(x => x.Id == id);
    }
}

export class PartnerRepository extends TestRepository<ISalesforcePartner> implements IPartnerRepository {
    getAllByProjectId(projectId: string): Promise<ISalesforcePartner[]> {
        return super.getWhere(x => x.ProjectId__c == projectId);
    }

}


export class ProjectContactRepository extends TestRepository<ISalesforceProjectContact> implements IProjectContactsRepository {
    getAllByProjectId(projectId: string): Promise<ISalesforceProjectContact[]> {
        return super.getWhere(x => x.ProjectId == projectId);
    }
}

export class TestContext implements IContext {

    public repositories = {
        contacts: new ContactsRepository(),
        projects: new ProjectsRepository(),
        partners: new PartnerRepository(),
        projectContacts: new ProjectContactRepository()
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
                Name: "Project " + seed
            } as ISalesforceProject;

            update && update(newItem);

            this.repositories.projects.Items.push(newItem);

            return newItem;
        }
    };
}
