// tslint:disable:no-identical-functions no-duplicate-string
import { TestContext } from "../../testContextProvider";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { ProjectChangeRequestItemTypeEntity } from "@framework/entities";

describe("GetPCRItemTypesQuery", () => {
  test("returns all item types", async () => {
    const context = new TestContext();

    const expectedIds = [
      ProjectChangeRequestItemTypeEntity.SinglePartnerFinancialVirement,
      ProjectChangeRequestItemTypeEntity.MultiplePartnerFinancialVirement,
      ProjectChangeRequestItemTypeEntity.PartnerWithdrawal,
      ProjectChangeRequestItemTypeEntity.PartnerAddition,
      ProjectChangeRequestItemTypeEntity.ScopeChange,
      ProjectChangeRequestItemTypeEntity.TimeExtension,
      ProjectChangeRequestItemTypeEntity.AccountNameChange,
      ProjectChangeRequestItemTypeEntity.ProjectSuspension,
      ProjectChangeRequestItemTypeEntity.ProjectTermination,
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
