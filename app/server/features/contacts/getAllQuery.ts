import { IQuery, IContext, SalesforceContact } from '../common/context'

export interface ResultDto {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    address: {
        street: string;
        city: string;
        county: string;
        postcode: string;
    }
}


const mapItem = (input: SalesforceContact) : ResultDto => {
    if(!input) throw new Error("NULL");
    return {
        id: input.Id, 
        title: input.Salutation,
        firstName: input.FirstName,
        lastName: input.LastName,
        email: input.Email,
        address: {
            street: input.MailingStreet,
            city: input.MailingCity,
            county: input.MailingState,
            postcode: input.MailingPostalCode,
        }
    }
}

export default class GetAllQuery implements IQuery<ResultDto[]> {
    public async Run(context:IContext){
        return (await context.repositories.contacts.getAll()).map(y => mapItem(y));
    }
}

export class GetByIdQuery implements IQuery<ResultDto> {
    
    private _id : string = "";
    public get id() : string {
        return this._id;
    }
    public set id(v : string) {
        this._id = v;
    }
    
    public async Run(context:IContext){
        let item = (await context.repositories.contacts.getById(this.id));
        return mapItem(item);
    }
}