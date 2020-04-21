import { createDto } from "@framework/util/dtoHelpers";
import { ISalesforcePcrSpendProfile } from "@server/repositories";
import { SalesforcePcrSpendProfileMapper } from "@server/repositories/mappers/pcrSpendProfileMapper";
import { PcrSpendProfileEntity } from "@framework/entities";

const PCR_SPEND_PROFILE_TYPE = "PCR_SPEND_PROFILE_TYPE";

const createPcrSpendProfileSalesforceRecord = (update?: Partial<ISalesforcePcrSpendProfile>): ISalesforcePcrSpendProfile => {
  return createDto<ISalesforcePcrSpendProfile>({
    Id: "Test_Id",
    RecordTypeId: PCR_SPEND_PROFILE_TYPE,
    Acc_ProjectChangeRequest__c: "pcr_id",
    Acc_CostCategoryID__c: "cost_cat_id",
    Acc_CostOfRole__c: 0,
    ...update
  });
};

const createPcrSpendProfileEntity = (update?: Partial<PcrSpendProfileEntity>): PcrSpendProfileEntity => {
  return createDto<PcrSpendProfileEntity>({
    id: undefined,
    pcrItemId: "pcr_id",
    costCategoryId: "cost_cat_id",
    costOfRole: 0,
    ...update
  });
};

describe("SalesforcePcrSpendProfileMapper", () => {
  it("Maps spend profile correctly to entity", () => {
    const update: Partial<ISalesforcePcrSpendProfile> = {
      Id: "1234",
      RecordTypeId: "xxx",
      Acc_CostCategoryID__c: "Expected Partner",
      Acc_ProjectChangeRequest__c: "Expected PCR",
      Acc_CostOfRole__c: 10
    };
    const pcrSpendProfile = createPcrSpendProfileSalesforceRecord(update);
    const mapped = new SalesforcePcrSpendProfileMapper(PCR_SPEND_PROFILE_TYPE).map(pcrSpendProfile);
    expect(mapped.id).toEqual(update.Id);
    expect(mapped.costCategoryId).toEqual(update.Acc_CostCategoryID__c);
    expect(mapped.costOfRole).toEqual(update.Acc_CostOfRole__c);
    expect(mapped.pcrItemId).toEqual(update.Acc_ProjectChangeRequest__c);
  });
  it("Maps spend profile entity correctly to sf record", () => {
    const update: Partial<PcrSpendProfileEntity> = {
      id: "1234",
      costCategoryId: "Expected Partner Id",
      pcrItemId: "Expected PCR Id",
      costOfRole: 10
    };
    const pcrSpendProfile = createPcrSpendProfileEntity(update);
    const mapped = new SalesforcePcrSpendProfileMapper(PCR_SPEND_PROFILE_TYPE).mapToSalesforce(pcrSpendProfile);
    expect(mapped.Id).toEqual(update.id);
    expect(mapped.Acc_CostCategoryID__c).toEqual(update.costCategoryId);
    expect(mapped.Acc_CostOfRole__c).toEqual(update.costOfRole);
    expect(mapped.Acc_ProjectChangeRequest__c).toEqual(update.pcrItemId);
    expect(mapped.RecordTypeId).toEqual(PCR_SPEND_PROFILE_TYPE);
  });
  it("Maps spend profile entity for create correctly to sf record", () => {
    const update: Partial<PcrSpendProfileEntity> = {
      costCategoryId: "Expected Partner Id",
      pcrItemId: "Expected PCR Id",
      costOfRole: 10
    };
    const pcrSpendProfile = createPcrSpendProfileEntity(update);
    const mapped = new SalesforcePcrSpendProfileMapper(PCR_SPEND_PROFILE_TYPE).mapToSalesforceForCreate(pcrSpendProfile);
    expect((mapped as any).Id).toBe(undefined);
    expect(mapped.Acc_CostCategoryID__c).toEqual(update.costCategoryId);
    expect(mapped.Acc_CostOfRole__c).toEqual(update.costOfRole);
    expect(mapped.Acc_ProjectChangeRequest__c).toEqual(update.pcrItemId);
    expect(mapped.RecordTypeId).toEqual(PCR_SPEND_PROFILE_TYPE);
  });
});
