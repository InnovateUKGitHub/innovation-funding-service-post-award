import { StubDatabaseConnector } from "../database/StubDatabaseConnector";
import { ProjectFactoryMissingNonNullableFieldException } from "../exceptions/ProjectFactoryMissingNonNullableFieldException";
import { Contact } from "./Contact";

describe("Contact Factory", () => {
  test("non-nullable fields are mandatory", async () => {
    const Database = new StubDatabaseConnector();
    const competition = new Contact();
    competition.ContactMigrationId__c = "1234";
    competition.FirstName = "Mark";

    expect(Database.insert(competition)).rejects.toThrow(ProjectFactoryMissingNonNullableFieldException);
  });

  test("contact can be made", async () => {
    const Database = new StubDatabaseConnector();
    const contact = new Contact();
    contact.ContactMigrationId__c = "1234";
    contact.FirstName = "Mark";
    contact.LastName = "Scott";
    contact.Email = "marks@spencer.x.gov.uk";

    // Field values are still there
    expect(contact.toObject()).toMatchObject({
      ContactMigrationId__c: "1234",
      FirstName: "Mark",
      LastName: "Scott",
      Email: "marks@spencer.x.gov.uk",
    });

    await Database.insert(contact);

    // ID is populated
    expect(contact).toMatchObject({
      Id: "Contact-1",
      sobject: "Contact",
    });
  });
});
