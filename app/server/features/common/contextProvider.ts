import * as contexts from './context';
import range from '../../../shared/range';

function createFakeSalesForceContact(id: number): contexts.SalesforceContact {
    return {
        Id: id.toString(),
        Salutation: "Mr",
        LastName: "James",
        FirstName: "Joyce",
        Email: "james@test.com",
        MailingStreet: "",
        MailingCity: "",
        MailingState: "",
        MailingPostalCode: "",
    }
}

class Context implements contexts.IContext {
    public runQuery<TResult>(query:contexts.IQuery<TResult>) : Promise<TResult> {
        return query.Run(this);
    }

    public runCommand<TResult>(query:contexts.ICommandWithResult<TResult>) : Promise<TResult> {
        return query.Run(this);
    }

    public repositories = {
        contacts: {
            getAll: () => Promise.resolve(range(10).map(id => createFakeSalesForceContact(id))),
            getById: (id:string)=> Promise.resolve(createFakeSalesForceContact(id as any as number)),
        }
    }
}

export class ContextProvider {
    public start(): contexts.IContext {
        return new Context();
    }
}

const contextProvider = new ContextProvider();


export default contextProvider;
