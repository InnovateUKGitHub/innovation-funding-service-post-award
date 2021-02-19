import { GetCostCategoriesForPartnerQuery } from "@server/features/claims/getCostCategoriesForPartnerQuery";
import { TestContext } from "../../testContextProvider";

describe("GetCostCategoriesForPartnerQuery", () => {
  it("returns cost categories filtered by project competitionType", async () => {
    const ctx = new TestContext();
    const projectDto = { competitionType: "ABC" };
    const partnerDto = { organisationType: "123" };

    ctx.testData.range(5, () => ctx.testData.createCostCategory({ organisationType: partnerDto.organisationType }));
    ctx.testData.range(3, () => ctx.testData.createCostCategory({
      competitionType: projectDto.competitionType,
      organisationType: partnerDto.organisationType,
    }));

    const query = new GetCostCategoriesForPartnerQuery(projectDto as any, partnerDto as any);
    const result = await ctx.runQuery(query);
    expect(result.length).toBe(3);
  });

  it("returns cost categories filtered by partner organisationType", async () => {
    const ctx = new TestContext();
    const projectDto = { competitionType: "ABC" };
    const partnerDto = { organisationType: "123" };

    ctx.testData.range(5, () => ctx.testData.createCostCategory({ competitionType: projectDto.competitionType}));
    ctx.testData.range(13, () => ctx.testData.createCostCategory({
      competitionType: projectDto.competitionType,
      organisationType: partnerDto.organisationType,
    }));

    const query = new GetCostCategoriesForPartnerQuery(projectDto as any, partnerDto as any);
    const result = await ctx.runQuery(query);
    expect(result.length).toBe(13);
  });
});
