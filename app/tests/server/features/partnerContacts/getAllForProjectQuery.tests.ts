import { TestContext } from "../../testContextProvider";
import { GetAllForProjectQuery } from '../../../../src/server/features/projectContacts/getAllForProjectQuery';

describe("getAllForProjectQuery", () => {
    it("when project has contact expect item returned", async () => {
        let context = new TestContext();

        let project = context.testData.createProject();
        let partner = context.testData.createPartner(project);
        let projectContact = context.testData.createProjectContact(project, partner, x=> {
            x.Acc_ContactId__r = { Id : "ExpectedContactId", Name:"ExpectedContactName"};
            x.Acc_EmailOfSFContact__c = "ExpectedEmail";
            x.Acc_Role__c = "ExpectedRole";
        });

        let result = await context.runQuery(new GetAllForProjectQuery(project.Id));

        expect(result).not.toBe(null);
        expect(result.length).toBe(1);
        expect(result[0].id).toBe(projectContact.Id);
        expect(result[0].email).toBe("ExpectedEmail");
        expect(result[0].name).toBe("ExpectedContactName");
        expect(result[0].role).toBe("ExpectedRole");
        expect(result[0].partnerId).toBe(partner.Id);

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
