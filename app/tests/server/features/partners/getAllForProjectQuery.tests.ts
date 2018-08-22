import { TestContext } from "../../testContextProvider";
import { GetAllForProjectQuery } from '../../../../src/server/features/partners/getAllForProjectQuery';

describe("getAllForProjectQuery", () => {
    it("when project has partner expect item returned", async () => {
        let context = new TestContext();
        
        let project = context.testData.createProject();
        let partner = context.testData.createPartner(project);

        let result = await context.runQuery(new GetAllForProjectQuery(project.Id));

        expect(result).not.toBe(null);
        expect(result.length).toBe(1);
        expect(result[0].id).toBe(partner.Id);
        expect(result[0].isLead).toBe(true);
        expect(result[0].name).toBe(partner.ParticipantName__c);
        expect(result[0].type).toBe(partner.ParticipantType__c);

    });

    it("when pathers only on other project expect empty", async () => {
        let context = new TestContext();
        
        let project1 = context.testData.createProject();
        let project2 = context.testData.createProject();
        context.testData.createPartner(project1);

        let result = await context.runQuery(new GetAllForProjectQuery(project2.Id));

        expect(result).not.toBe(null);
        expect(result.length).toBe(0);
    });

    it("when role is Lead expect isLead true", async () => {
        let context = new TestContext();
        
        let project = context.testData.createProject();
        let notLeadPartner = context.testData.createPartner(project, (x) => x.ProjectRole__c = "Other");
        let leadPartner = context.testData.createPartner(project, (x) => x.ProjectRole__c = "Lead");

        let result = await context.runQuery(new GetAllForProjectQuery(project.Id));

        expect(result).not.toBe(null);
        expect(result.length).toBe(2);
        expect(result.find(x => x.id == leadPartner.Id).isLead).toBe(true);
        expect(result.find(x => x.id == notLeadPartner.Id).isLead).toBe(false);
    });
});
