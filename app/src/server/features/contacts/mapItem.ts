import { ISalesforceContact } from "../../repositories/contactsRepository";
import { IContact } from "../../../ui/models";

export function mapItem(input: ISalesforceContact): IContact {
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
  };
}
