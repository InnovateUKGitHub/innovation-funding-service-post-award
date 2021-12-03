import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { PCRItemType } from "@framework/constants";
import { TestContext } from "../../testContextProvider";

// TODO: Add test to capture conditional competition types - snapshot?
describe("GetPCRItemTypesQuery", () => {
  test("returns all item types", async () => {
    const context = new TestContext();

    const expectedIds = [
      PCRItemType.MultiplePartnerFinancialVirement,
      PCRItemType.PartnerWithdrawal,
      PCRItemType.PartnerAddition,
      PCRItemType.ScopeChange,
      PCRItemType.TimeExtension,
      PCRItemType.AccountNameChange,
      PCRItemType.ProjectSuspension,
      PCRItemType.ProjectTermination,
    ];

    const project = context.testData.createProject();

    const query = new GetPCRItemTypesQuery(project.Id);
    const result = await context.runQuery(query);

    expect(result.map(x => x.type)).toEqual(expectedIds);
  });

  test("populates item type fields", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const recordType = context.testData.createRecordType({
      type: "Remove a partner",
      parent: "Acc_ProjectChangeRequest__c",
    });

    const query = new GetPCRItemTypesQuery(project.Id);
    const itemTypes = await context.runQuery(query);

    const matchedResult = itemTypes.find(x => x.displayName === recordType.type);

    if (!matchedResult) {
      throw Error("The matched item type could not be found.");
    }

    expect(matchedResult.type).toEqual(PCRItemType.PartnerWithdrawal);
    expect(matchedResult.enabled).toEqual(true);
    expect(matchedResult.recordTypeId).toEqual(recordType.id);
    expect(matchedResult.displayName).toEqual("Remove a partner");
  });

  test("return financial virement", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();

    const query = new GetPCRItemTypesQuery(project.Id);
    const result = await context.runQuery(query);

    const singlePartnerVirement = result.find(x => x.type === PCRItemType.SinglePartnerFinancialVirement);
    const multiplePartnerVirement = result.find(x => x.type === PCRItemType.MultiplePartnerFinancialVirement);

    if (!multiplePartnerVirement) {
      throw Error("multiplePartnerVirement was not found");
    }

    expect(singlePartnerVirement).toBe(undefined);
    expect(multiplePartnerVirement.enabled).toBe(true);
  });

  describe("with competition types", () => {
    const competitionSetup = async (stubCompetitionType: string) => {
      const context = new TestContext();

      const project = context.testData.createProject(x => (x.Acc_CompetitionType__c = stubCompetitionType));

      const itemTypesQuery = new GetPCRItemTypesQuery(project.Id);
      const itemTypes = await context.runQuery(itemTypesQuery);

      const expectedTypes = itemTypes.map(x => x.type);

      return {
        expectedTypes,
      };
    };

    describe("with common competition types", () => {
      // Note: We don't need to waste time on duplicate tests, these should all be same except edge cases
      const commonPcrItemTypes = ["CR&D", "CONTRACTS", "KTP", "CATAPULTS", "SBRI", "SBRI IFS"];

      test.each(commonPcrItemTypes)("with %s", async stubCompetitionType => {
        const { expectedTypes } = await competitionSetup(stubCompetitionType);

        expect(expectedTypes).toStrictEqual([
          PCRItemType.MultiplePartnerFinancialVirement,
          PCRItemType.PartnerWithdrawal,
          PCRItemType.PartnerAddition,
          PCRItemType.ScopeChange,
          PCRItemType.TimeExtension,
          PCRItemType.AccountNameChange,
          PCRItemType.ProjectSuspension,
          PCRItemType.ProjectTermination,
        ]);
      });
    });

    describe("with specific competition types", () => {
      test("with LOANS", async () => {
        const { expectedTypes } = await competitionSetup("LOANS");

        expect(expectedTypes).toStrictEqual([
          PCRItemType.MultiplePartnerFinancialVirement,
          PCRItemType.ScopeChange,
          PCRItemType.TimeExtension,
          PCRItemType.ProjectSuspension,
        ]);
      });
    });
  });
});
