import "jest";
import { TestContext } from "../../testContextProvider";
import { GetAllClaimDetailsByPartner } from "../../../../src/server/features/claimDetails";

describe("claimDetails/getAllByPartner", () => {
  it("returns objects of correct shape", async () => {
    const context = new TestContext();
    const costCat = context.testData.createCostCategory();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    context.testData.createClaimDetail(project, costCat, partner);

    const query  = new GetAllClaimDetailsByPartner(partner.id);
    const result = await context.runQuery(query);
    const item   = result[0];

    expect(item.costCategoryId).toBe(costCat.id);
    expect(item.periodId).toBe(1);
    expect(item.value).toBe(1000);
  });

  it("returns array with single result", async () => {
    const context = new TestContext();
    const costCat = context.testData.createCostCategory();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    context.testData.createClaimDetail(project, costCat, partner);

    const query  = new GetAllClaimDetailsByPartner(partner.id);
    const result = await context.runQuery(query);

    expect(result.length).toBe(1);
  });

  it("returns array with multiple results", async () => {
    const context = new TestContext();
    const costCat = context.testData.createCostCategory();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();

    context.testData.createClaimDetail(project, costCat, partner);
    context.testData.createClaimDetail(project, costCat, partner);
    context.testData.createClaimDetail(project, costCat, partner);

    const query  = new GetAllClaimDetailsByPartner(partner.id);
    const result = await context.runQuery(query);

    expect(result.length).toBe(3);
  });

});
