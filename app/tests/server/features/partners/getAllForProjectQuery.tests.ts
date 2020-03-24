import { TestContext } from "../../testContextProvider";
import { GetAllForProjectQuery } from "../../../../src/server/features/partners/getAllForProjectQuery";

describe("getAllForProjectQuery", () => {
    it("when project has partner expect item returned", async () => {
        const context = new TestContext();
        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project, x => x.projectRole = "Lead");
        const result = await context.runQuery(new GetAllForProjectQuery(project.Id));

        expect(result).not.toBe(null);
        expect(result.length).toBe(1);
        expect(result[0].id).toBe(partner.id);
        expect(result[0].isLead).toBe(true);
        expect(result[0].name).toBe(partner.name);
        expect(result[0].type).toBe(partner.participantType);

    });

    it("when pathers only on other project expect empty", async () => {
        const context = new TestContext();
        const project1 = context.testData.createProject();
        const project2 = context.testData.createProject();
        context.testData.createPartner(project1);

        const result = await context.runQuery(new GetAllForProjectQuery(project2.Id));

        expect(result).not.toBe(null);
        expect(result.length).toBe(0);
    });

    it("when role is 'Project Lead' expect isLead true", async () => {
        const context = new TestContext();
        const project = context.testData.createProject();
        const notLeadPartner = context.testData.createPartner(project, (x) => x.projectRole = "Other");
        const leadPartner = context.testData.createPartner(project, (x) => x.projectRole = "Lead");
        const result = await context.runQuery(new GetAllForProjectQuery(project.Id));

        expect(result).not.toBe(null);
        expect(result.length).toBe(2);
        expect(result.find(x => x.id === leadPartner.id)!.isLead).toBe(true);
        expect(result.find(x => x.id === notLeadPartner.id)!.isLead).toBe(false);
    });

    it("sorts by 'Project Lead' and then alpabetical", async () => {
        const context = new TestContext();
        const project = context.testData.createProject();
        const partners = context.testData.range(10, () => context.testData.createPartner(project));

        partners
            .forEach((p,i) => {
                p.name = "Partner_" + String.fromCharCode(65 + partners.length - 1 - i); // 65 = A
                p.projectRole = "Other";
            });

        // Set partner B, D to be lead
        partners
            .filter(x => x.name === "Partner_B" || x.name === "Partner_D")
            .forEach(x => x.projectRole = "Lead");

        const result = await context.runQuery(new GetAllForProjectQuery(project.Id));

        const expected = [
            "Partner_B",
            "Partner_D",
            "Partner_A",
            "Partner_C",
            "Partner_E",
            "Partner_F",
            "Partner_G",
            "Partner_H",
            "Partner_I",
            "Partner_J"
        ];

        expect(result.map(x => x.name)).toEqual(expected);
    });

    it("sorts no name to bottom of list", async () => {
        const context = new TestContext();
        const project = context.testData.createProject();
        const partners = context.testData.range(10, () => context.testData.createPartner(project));

        partners
            .forEach((p,i) => {
                p.name = "Partner_" + String.fromCharCode(65 + partners.length - 1 - i); // 65 = A
            });

        // Set partner B, D, E, to be no name
        partners
            .filter(x => x.name === "Partner_B" || x.name === "Partner_D"|| x.name === "Partner_E")
            .forEach(x => x.name = null!);

        const result = await context.runQuery(new GetAllForProjectQuery(project.Id));

        const expected = [
            "Partner_A",
            "Partner_C",
            "Partner_F",
            "Partner_G",
            "Partner_H",
            "Partner_I",
            "Partner_J",
            null,
            null,
            null
        ];

        expect(result.map(x => x.name)).toEqual(expected);
    });

});
