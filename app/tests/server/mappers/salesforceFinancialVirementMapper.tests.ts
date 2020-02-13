// tslint:disable:no-duplicate-string
import { SalesforceFinancialVirementMapper } from "@server/repositories/mappers/financialVirementMapper";
import { ISalesforceFinancialVirement } from "@server/repositories";
import { createDto } from "@framework/util/dtoHelpers";

const createPartnerLevelSalesforceRecord = (update?: Partial<ISalesforceFinancialVirement>): ISalesforceFinancialVirement => {
  return createDto<ISalesforceFinancialVirement>({
    Id: "Test_Id",
    Acc_ProjectChangeRequest__c: "PCR_Id",
    Acc_ProjectParticipant__c: "Partner_Id",
    ...update
  });
};

const createVirementLevelSalesforceRecord = (partnerLevel: ISalesforceFinancialVirement, costCategoryId: string, update?: Partial<ISalesforceFinancialVirement>): ISalesforceFinancialVirement => {
  return createDto<ISalesforceFinancialVirement>({
    Id: "Test_Id",
    Acc_ProjectChangeRequest__c: "PCR_Id",
    Acc_CurrentCosts__c: 100,
    Acc_ClaimedCostsToDate__c: 200,
    Acc_NewCosts__c: 300,
    Acc_Profile__r: {
      Acc_CostCategory__c: costCategoryId,
      Acc_ProjectParticipant__c: partnerLevel.Acc_ProjectParticipant__c,
    },
    ...update,
  });
};

describe("SalesforceFinancialVirementMapper", () => {
  it("Maps partner correctly", () => {
    const partner = createPartnerLevelSalesforceRecord({
      Acc_ProjectParticipant__c: "Expected Partner Id",
      Acc_ProjectChangeRequest__c: "Expected PCR Id"
    });

    const results = new SalesforceFinancialVirementMapper().map([partner]);

    expect(results.length).toBe(1);

    const result = results[0];

    expect(result.partnerId).toBe("Expected Partner Id");
    expect(result.pcrItemId).toBe("Expected PCR Id");
    expect(result.virements).toEqual([]);

  });

  it("Maps partner virement correctly", () => {
    const partner = createPartnerLevelSalesforceRecord();

    const virement = createVirementLevelSalesforceRecord(partner, "Expected Cost Category", {
      Acc_ClaimedCostsToDate__c: 10,
      Acc_CurrentCosts__c: 20,
      Acc_NewCosts__c: 30,
    });

    const results = new SalesforceFinancialVirementMapper().map([partner, virement]);

    expect(results.length).toBe(1);

    const result = results[0];

    expect(result.virements.length).toEqual(1);

    expect(result.virements[0].costCategoryId).toEqual("Expected Cost Category");
    expect(result.virements[0].newCosts).toEqual(30);
    expect(result.virements[0].originalCostsClaimedToDate).toEqual(10);
    expect(result.virements[0].originalEligibleCosts).toEqual(20);

  });

  it("Maps multiple partners correctly", () => {
    const partner1 = createPartnerLevelSalesforceRecord({
      Acc_ProjectParticipant__c: "Expected Partner 1",
      Acc_ProjectChangeRequest__c: "Expected PCR Id"
    });

    const virement1 = createVirementLevelSalesforceRecord(partner1, "Expected Cost Category 1", {
      Acc_ClaimedCostsToDate__c: 10,
      Acc_CurrentCosts__c: 20,
      Acc_NewCosts__c: 30,
    });

    const partner2 = createPartnerLevelSalesforceRecord({
      Acc_ProjectParticipant__c: "Expected Partner 2",
      Acc_ProjectChangeRequest__c: "Expected PCR Id"
    });

    const virement2 = createVirementLevelSalesforceRecord(partner2, "Expected Cost Category 1", {
      Acc_ClaimedCostsToDate__c: 40,
      Acc_CurrentCosts__c: 50,
      Acc_NewCosts__c: 60,
    });

    const virement3 = createVirementLevelSalesforceRecord(partner2, "Expected Cost Category 2", {
      Acc_ClaimedCostsToDate__c: 70,
      Acc_CurrentCosts__c: 80,
      Acc_NewCosts__c: 90,
    });

    const results = new SalesforceFinancialVirementMapper().map([partner1, virement1, virement2, virement3, partner2]);

    expect(results.length).toBe(2);

    expect(results.map(x => x.partnerId)).toEqual(["Expected Partner 1", "Expected Partner 2"]);
    expect(results.map(x => x.virements.length)).toEqual([1, 2]);

    expect(results[1].virements[0].costCategoryId).toEqual("Expected Cost Category 1");
    expect(results[1].virements[0].newCosts).toEqual(60);
    expect(results[1].virements[0].originalCostsClaimedToDate).toEqual(40);
    expect(results[1].virements[0].originalEligibleCosts).toEqual(50);

  });
});
