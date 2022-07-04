import { SalesforceCostCategoryMapper } from "@server/repositories/mappers/costCategoryMapper";
import { ISalesforceCostCategory } from "@server/repositories";
import { PCROrganisationType, CostCategoryName } from "@framework/constants";

const createSalesforceRecord = (update?: Partial<ISalesforceCostCategory>): ISalesforceCostCategory => {
  const item: ISalesforceCostCategory = {
    Id: "Test_Id",
    Acc_CostCategoryName__c: CostCategoryName.Other_Costs,
    Acc_DisplayOrder__c: 1,
    Acc_OrganisationType__c: PCROrganisationType.Industrial,
    Acc_CompetitionType__c: "Test_Competition",
    Acc_CostCategoryDescription__c: "Test_Description",
    Acc_HintText__c: "Test_Hint",
    Acc_OverrideAwardRate__c: 0,
  };

  if (update) Object.assign(item, update);

  return item;
};

describe("SalesforceCostCategoryMapper", () => {
  it("Maps id correctly", () => {
    const expected = CostCategoryName.Academic;
    const mapper = new SalesforceCostCategoryMapper();
    const result = mapper.map(createSalesforceRecord({ Id: expected }));

    expect(result.id).toEqual(expected);
  });

  it("Maps name correctly", () => {
    const expected = CostCategoryName.Academic;

    const mapper = new SalesforceCostCategoryMapper();
    const result = mapper.map(createSalesforceRecord({ Acc_CostCategoryName__c: expected }));

    expect(result.name).toEqual(expected);
  });

  it("Maps organisationType correctly", () => {
    const expected = PCROrganisationType.Academic;

    const mapper = new SalesforceCostCategoryMapper();
    const result = mapper.map(createSalesforceRecord({ Acc_OrganisationType__c: expected }));

    expect(result.organisationType).toEqual(expected);
  });

  it("Maps competitionType correctly", () => {
    const expected = "EXPECTED";

    const mapper = new SalesforceCostCategoryMapper();
    const result = mapper.map(createSalesforceRecord({ Acc_CompetitionType__c: expected }));

    expect(result.competitionType).toEqual(expected);
  });

  it("Maps description correctly", () => {
    const expected = "EXPECTED";

    const mapper = new SalesforceCostCategoryMapper();
    const result = mapper.map(createSalesforceRecord({ Acc_CostCategoryDescription__c: expected }));

    expect(result.description).toEqual(expected);
  });

  it("Maps hintText correctly", () => {
    const expected = "EXPECTED";

    const mapper = new SalesforceCostCategoryMapper();
    const result = mapper.map(createSalesforceRecord({ Acc_HintText__c: expected }));

    expect(result.hintText).toEqual(expected);
  });

  it("Maps display order correctly", () => {
    const expected = 44;

    const mapper = new SalesforceCostCategoryMapper();
    const result = mapper.map(createSalesforceRecord({ Acc_DisplayOrder__c: expected }));

    expect(result.displayOrder).toEqual(expected);
  });

  it("Maps hasRelated correctly", () => {
    const mapper = new SalesforceCostCategoryMapper();

    const result1 = mapper.map(createSalesforceRecord({ Acc_CostCategoryName__c: CostCategoryName.Labour }));
    const result2 = mapper.map(createSalesforceRecord({ Acc_CostCategoryName__c: CostCategoryName.Materials }));

    expect(result1.hasRelated).toEqual(false);
    expect(result2.hasRelated).toEqual(false);
  });

  it("Maps isCalculated correctly", () => {
    const mapper = new SalesforceCostCategoryMapper();

    const result1 = mapper.map(createSalesforceRecord({ Acc_CostCategoryName__c: CostCategoryName.Overheads }));
    const result2 = mapper.map(createSalesforceRecord({ Acc_CostCategoryName__c: CostCategoryName.Materials }));

    expect(result1.isCalculated).toEqual(false);
    expect(result2.isCalculated).toEqual(false);
  });

  it("Maps overrideAwardRate correctly", () => {
    const overrideAwardRate = 35;
    const mapper = new SalesforceCostCategoryMapper();

    const expected = mapper.map(createSalesforceRecord({ Acc_OverrideAwardRate__c: overrideAwardRate }));

    expect(expected.overrideAwardRate).toEqual(overrideAwardRate);
  });
});
