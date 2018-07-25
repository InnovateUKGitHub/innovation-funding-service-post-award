import { IContext, IQuery, ICommand, IRepositories } from "../../../app/server/features/common/context";
import { SalesforceContact, IContactsRepository } from "../../../app/server/repositories/contactsRepository";

export abstract class TestRepository<T>
{
    public Items: T[] = []

    protected getOne(conditional: (item:T) => boolean) : Promise<T> {
        return new Promise<T>((resolve, reject) => {
            let found = this.Items.find(x => conditional(x));
            if(found) resolve(found);
            else reject(Error("NOT FOUND"));
        });
    }

    protected getWhere(conditional: (item:T) => boolean) : Promise<T[]> {
        return new Promise<T[]>((resolve) => {
            let found = this.Items.filter(x => conditional(x));
            resolve(found);
        });
    }

    protected getAll() : Promise<T[]> {
        return Promise.resolve(this.Items);
    }
}

export class ContactsRepository extends TestRepository<SalesforceContact> implements IContactsRepository {
    getById(id: String): Promise<SalesforceContact> {
        return super.getOne(x => x.Id == id);
    }    
    
    getAll(): Promise<SalesforceContact[]> {
        return super.getAll();
    }
}

export class TestContext implements IContext {
    
    public repositories = {
        contacts: new ContactsRepository()
    };

    public runQuery<TResult>(query: IQuery<TResult>) : Promise<TResult> {
        return query.Run(this as IContext);
    }

    public runCommand<TResult>(command: ICommand<TResult>) : Promise<TResult> {
        return command.Run(this as IContext);
    }

    public testData = {
        range: <T> (no: number, create: (seed:number, index: number) => T) => {
            return Array.from({length: no}, (_,i) => create(i+1, i));
        },
        createContact: (update?: (item:SalesforceContact) => void) => {
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
            } as SalesforceContact;

            update && update(newItem);

            this.repositories.contacts.Items.push(newItem);
    
            return newItem;
        }
    };
}
