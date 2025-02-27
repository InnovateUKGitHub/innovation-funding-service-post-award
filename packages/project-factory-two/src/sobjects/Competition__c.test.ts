import { StubDatabaseConnector } from "../database/StubDatabaseConnector";
import { ProjectFactoryMissingNonNullableFieldException } from "../exceptions/ProjectFactoryMissingNonNullableFieldException";
import { Competition__c } from "./Competition__c";

describe("Competition Factory", () => {
  test("non-nullable fields are mandatory", async () => {
    const Database = new StubDatabaseConnector();
    const competition = new Competition__c();
    competition.Acc_CompetitionCode__c = "0";
    competition.Acc_CompetitionName__c = "Competition";

    expect(Database.insert(competition)).rejects.toThrow(ProjectFactoryMissingNonNullableFieldException);
  });

  test("competition can be made", async () => {
    const Database = new StubDatabaseConnector();
    const competition = new Competition__c();
    competition.Acc_CompetitionCode__c = "0";
    competition.Acc_CompetitionName__c = "Competition";
    competition.Acc_CompetitionType__c = "CR&D";
    competition.Impact_Management_participation__c = "No";

    // Set fields are marked as such
    expect(competition._fields).toMatchSnapshot();

    // Field values are still there
    expect(competition.toObject()).toMatchObject({
      Acc_CompetitionCode__c: "0",
      Acc_CompetitionName__c: "Competition",
      Acc_CompetitionType__c: "CR&D",
      Impact_Management_participation__c: "No",
    });

    await Database.insert(competition);

    // ID is populated
    expect(competition).toMatchObject({
      Id: "Competition__c-1",
      sobject: "Competition__c",
    });
  });
});
