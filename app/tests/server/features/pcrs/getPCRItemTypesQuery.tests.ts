// tslint:disable:no-identical-functions no-duplicate-string
import { TestContext } from "../../testContextProvider";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { PCRItemType } from "@framework/entities/pcr";

describe("GetPCRItemTypesQuery", () => {
  test("returns all item types", async () => {
    const context = new TestContext();

    const expectedIds = [
      PCRItemType.AccountNameChange,
      PCRItemType.PartnerAddition,
      PCRItemType.PartnerWithdrawal,
      PCRItemType.ProjectSuspension,
      PCRItemType.ProjectTermination,
      PCRItemType.MultiplePartnerFinancialVirement,
      PCRItemType.SinglePartnerFinancialVirement,
      PCRItemType.ScopeChange,
      PCRItemType.TimeExtension
    ];

    const query = new GetPCRItemTypesQuery();
    const result = await context.runQuery(query);

    expect(result.map(x => x.id)).toEqual(expectedIds);
  });

  test("popultates item type fields", async () => {
    const context = new TestContext();

    const recordType = context.testData.createRecordType({type: "Partner Withdrawal", parent: "Acc_ProjectChangeRequest__c"});

    const query = new GetPCRItemTypesQuery();
    const result = await context.runQuery(query).then(x => x[2]);

    expect(result.id).toEqual(PCRItemType.PartnerWithdrawal);
    expect(result.enabled).toEqual(true);
    expect(result.recordTypeId).toEqual(recordType.id);
    expect(result.displayName).toEqual("Partner Withdrawal");
  });
});
