// tslint:disable:no-identical-functions no-duplicate-string
import { TestContext } from "../../testContextProvider";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { ProjectChangeRequestItemTypeEntity } from "@framework/entities";

describe("GetPCRItemTypesQuery", () => {
  test("returns all item types", async () => {
    const context = new TestContext();

    const expectedIds = [
      ProjectChangeRequestItemTypeEntity.AccountNameChange,
      ProjectChangeRequestItemTypeEntity.PartnerAddition,
      ProjectChangeRequestItemTypeEntity.PartnerWithdrawal,
      ProjectChangeRequestItemTypeEntity.ProjectSuspension,
      ProjectChangeRequestItemTypeEntity.ProjectTermination,
      ProjectChangeRequestItemTypeEntity.MultiplePartnerFinancialVirement,
      ProjectChangeRequestItemTypeEntity.SinglePartnerFinancialVirement,
      ProjectChangeRequestItemTypeEntity.ScopeChange,
      ProjectChangeRequestItemTypeEntity.TimeExtension
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

    expect(result.type).toEqual(ProjectChangeRequestItemTypeEntity.PartnerWithdrawal);
    expect(result.enabled).toEqual(true);
    expect(result.recordTypeId).toEqual(recordType.id);
    expect(result.displayName).toEqual("Remove a partner");
  });
});
