import { SalesforceContact, IQuery, IContext } from "../common/context";

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

export class GetByIdQuery implements IQuery<ResultDto> {
    
    public id : string = "";
    public async Run(context:IContext){
        let item = (await context.repositories.contacts.getById(this.id));
        return mapItem(item);
    }
}