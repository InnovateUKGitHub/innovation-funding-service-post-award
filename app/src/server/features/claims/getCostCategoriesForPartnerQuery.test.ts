import { PCROrganisationType } from "@framework/constants";
import { PartnerDto } from "@framework/dtos";
import { CostCategory } from "@framework/entities";
import { GetCostCategoriesForPartnerQuery } from "@server/features/claims/getCostCategoriesForPartnerQuery";

import { TestContext } from "@tests/test-utils/testContextProvider";

describe("GetCostCategoriesForPartnerQuery()", () => {
  const setup = (propertyValidate: keyof Pick<CostCategory, "organisationType" | "competitionType">) => {
    const stubCostCategoryTotal = 2;
    const mockPartner = {
      competitionType: "ABC",
      organisationType: PCROrganisationType.Industrial,
    };

    const context = new TestContext();

    const stubProject = context.testData.createProject();
    const stubPartner = context.testData.createPartner(stubProject, x => {
      x.competitionType = mockPartner.competitionType;
      x.organisationType = mockPartner.organisationType;
    });

    // Create test data which will should be matched
    context.testData.range(stubCostCategoryTotal, count => {
      // Create both sets of data at the same time so they will always match
      context.testData.createCostCategory(mockPartner);
      context.testData.createProfileDetail({ id: `CostCat${count}` } as any, { id: stubPartner.id } as any);
    });

    // Create blank cost categories which will never match
    const invalidPayload = { ...mockPartner, [propertyValidate]: "I_SHOULD_NOT_MATCH" };
    context.testData.range(5, () => context.testData.createCostCategory(invalidPayload));

    // Preform query
    const query = new GetCostCategoriesForPartnerQuery({ ...mockPartner, id: stubPartner.id } as PartnerDto);

    return {
      context,
      query,
      expectedCategoryCount: stubCostCategoryTotal,
    };
  };

  describe("@returns", () => {
    it("with correctly filtered competitionType", async () => {
      const { context, query, expectedCategoryCount } = setup("competitionType");

      const result = await context.runQuery(query);

      expect(result).toHaveLength(expectedCategoryCount);
    });

    it("with correctly filtered organisationType", async () => {
      const { context, query, expectedCategoryCount } = setup("organisationType");

      const result = await context.runQuery(query);

      expect(result).toHaveLength(expectedCategoryCount);
    });
  });
});
