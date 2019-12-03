// tslint:disable:no-identical-functions no-duplicate-string
import { TestContext } from "../../testContextProvider";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { PCRItemType } from "@framework/constants";

describe("GetPCRItemTypesQuery", () => {
  test("returns all item types", async () => {
    const context = new TestContext();

    const expectedIds = [
      PCRItemType.SinglePartnerFinancialVirement,
      PCRItemType.MultiplePartnerFinancialVirement,
      PCRItemType.PartnerWithdrawal,
      PCRItemType.PartnerAddition,
      PCRItemType.ScopeChange,
      PCRItemType.TimeExtension,
      PCRItemType.AccountNameChange,
      PCRItemType.ProjectSuspension,
      PCRItemType.ProjectTermination,
    ];

    const query = new GetPCRItemTypesQuery();
    const result = await context.runQuery(query);

    expect(result.map(x => x.type)).toEqual(expectedIds);
  });

  test("popultates item type fields", async () => {
    const context = new TestContext();

    const recordType = context.testData.createRecordType({type: "Remove a partner", parent: "Acc_ProjectChangeRequest__c"});

    const query = new GetPCRItemTypesQuery();
    const result = await context.runQuery(query).then(x => x[2]);

    expect(result.type).toEqual(PCRItemType.PartnerWithdrawal);
    expect(result.enabled).toEqual(true);
    expect(result.recordTypeId).toEqual(recordType.id);
    expect(result.displayName).toEqual("Remove a partner");
  });

  test("return single financial virement if feature flag disabled", async () => {
    const context = new TestContext();

    context.config.features.financialVirements = false;

    const query = new GetPCRItemTypesQuery();
    const result = await context.runQuery(query);

    expect(result.find(x => x.type === PCRItemType.SinglePartnerFinancialVirement)!.enabled).toBe(true);
    expect(result.find(x => x.type === PCRItemType.MultiplePartnerFinancialVirement)!.enabled).toBe(false);
  });

  test("return multiple financial virement if feature flag enabled", async () => {
    const context = new TestContext();

    context.config.features.financialVirements = true;

    const query = new GetPCRItemTypesQuery();
    const result = await context.runQuery(query);

    expect(result.find(x => x.type === PCRItemType.SinglePartnerFinancialVirement)!.enabled).toBe(false);
    expect(result.find(x => x.type === PCRItemType.MultiplePartnerFinancialVirement)!.enabled).toBe(true);
  });
});
