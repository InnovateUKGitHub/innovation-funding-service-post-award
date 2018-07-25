import {IContext, IQuery, ICommand} from './context';
import contactsRepository from '../../repositories/contactsRepository';

class Context implements IContext {
    public runQuery<TResult>(query:IQuery<TResult>) : Promise<TResult> {
        return query.Run(this);
    }

    public runCommand<TResult>(query:ICommand<TResult>) : Promise<TResult> {
        return query.Run(this);
    }

    public repositories = {
        contacts: new contactsRepository()
    }
}

class ContextProvider {
    public start(): IContext {
        return new Context();
    }
}

export default new ContextProvider();
