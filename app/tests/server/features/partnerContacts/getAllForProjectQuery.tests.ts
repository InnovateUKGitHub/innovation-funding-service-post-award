import { TestContext } from "../../testContextProvider";
import { GetAllForProjectQuery } from '../../../../src/server/features/projectContacts/getAllForProjectQuery';

describe("getAllForProjectQuery", () => {
    it("when project has contact expect item returned", async () => {
        let context = new TestContext();
        
        let project = context.testData.createProject();
        let partner = context.testData.createPartner(project);
        let projectContact = context.testData.createProjectContact(project, partner);

        let result = await context.runQuery(new GetAllForProjectQuery(project.Id));

        expect(result).not.toBe(null);
        expect(result.length).toBe(1);
        expect(result[0].id).toBe(projectContact.Id);
        expect(result[0].email).toBe(projectContact.EmailOfSFContact__c);
        expect(result[0].name).toBe(projectContact.Name);
        expect(result[0].role).toBe(projectContact.Role__c);
        expect(result[0].organisationId).toBe(partner.AccountId);

    });

    it("when contact only on other project expect empty", async () => {
        let context = new TestContext();
        
        let project1 = context.testData.createProject();
        let project2 = context.testData.createProject();
        context.testData.createProjectContact(project1);

        let result = await context.runQuery(new GetAllForProjectQuery(project2.Id));

        expect(result).not.toBe(null);
        expect(result.length).toBe(0);
    });

});
