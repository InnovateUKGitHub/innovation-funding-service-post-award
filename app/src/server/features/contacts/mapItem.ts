import { SalesforceContact } from "../../repositories/contactsRepository";
import { Contact } from "../../../models";

export const mapItem = (input: SalesforceContact): Contact => {
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
