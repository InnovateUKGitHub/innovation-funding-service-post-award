import { TestContext } from "../../testContextProvider";
import { GetAllForProjectQuery } from "../../../../src/server/features/projectContacts/getAllForProjectQuery";

describe("getAllForProjectQuery", () => {
    it("when project has contact expect item returned", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project);
        const projectContact = context.testData.createFinanceContact(project, partner, x=> {
            x.Acc_ContactId__r = {
                Id : "ExpectedContactId",
                Name:"ExpectedContactName",
                Email: "contacts.login@test.com"
            };
            x.Acc_EmailOfSFContact__c = "ExpectedEmail";
        });

        const result = await context.runQuery(new GetAllForProjectQuery(project.Id));

        expect(result).not.toBe(null);
        expect(result.length).toBe(1);
        expect(result[0].id).toBe(projectContact.Id);
        expect(result[0].email).toBe("ExpectedEmail");
        expect(result[0].name).toBe("ExpectedContactName");
        expect(result[0].role).toBe("Finance contact");
        expect(result[0].roleName).toBe("Finance Contact");
        expect(result[0].accountId).toBe(partner.accountId);

    });

    it("when contact only on other project expect empty", async () => {
        const context = new TestContext();

        const project1 = context.testData.createProject();
        const project2 = context.testData.createProject();
        context.testData.createMonitoringOfficer(project1);

        const result = await context.runQuery(new GetAllForProjectQuery(project2.Id));

        expect(result).not.toBe(null);
        expect(result.length).toBe(0);
    });

});
