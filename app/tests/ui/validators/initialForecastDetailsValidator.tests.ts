import { TestContext } from "../../server/testContextProvider";
import { CostCategoryType } from "@framework/entities";
import { InitialForecastDetailsDtosValidator } from "@ui/validators/initialForecastDetailsDtosValidator";
import { GetAllForecastsGOLCostsQuery, GetCostCategoriesQuery } from "@server/features/claims";
import { GetAllInitialForecastsForPartnerQuery } from "@server/features/forecastDetails/getAllInitialForecastsForPartnerQuery";

describe("InitialForecastDetailsValidator", () => {

  describe("InitialForecastDetailsDtosValidator", () => {
    it("should not validate each cost category total if the forecast is not being submitted", async () => {

      const context = new TestContext();
      const partner = context.testData.createPartner();
      const labour = context.testData.createCostCategory({ type: CostCategoryType.Labour, name: "Labour" });

      context.testData.createProfileTotalCostCategory(labour, partner, 90);

      context.testData.createProfileDetail(labour, partner, 1, (item) => item.Acc_InitialForecastCost__c = 50);
      context.testData.createProfileDetail(labour, partner, 2, (item) => item.Acc_InitialForecastCost__c = 50);

      const forecasts = await context.runQuery(new GetAllInitialForecastsForPartnerQuery(partner.id));
      const golCosts = await context.runQuery(new GetAllForecastsGOLCostsQuery(partner.id));
      const costCategories = await context.runQuery(new GetCostCategoriesQuery());

      const validation = new InitialForecastDetailsDtosValidator(forecasts, golCosts, costCategories, false, true);

      expect(validation.isValid).toBe(true);

      const labourResult = validation.costCategoryForecasts.results.find(x => x.model.costCategory.id === labour.id)!;

      expect(labourResult.isValid).toBe(true);
    });
    it("should not validate each cost category total if the forecast items are not valid", async () => {

      const context = new TestContext();
      const partner = context.testData.createPartner();
      const labour = context.testData.createCostCategory({ type: CostCategoryType.Labour, name: "Labour" });

      context.testData.createProfileTotalCostCategory(labour, partner, 90);

      const invalidForecast = context.testData.createProfileDetail(labour, partner, 1, (item) => item.Acc_InitialForecastCost__c = null as any);
      context.testData.createProfileDetail(labour, partner, 2, (item) => item.Acc_InitialForecastCost__c = 50);

      const forecasts = await context.runQuery(new GetAllInitialForecastsForPartnerQuery(partner.id));
      const golCosts = await context.runQuery(new GetAllForecastsGOLCostsQuery(partner.id));
      const costCategories = await context.runQuery(new GetCostCategoriesQuery());

      const validation = new InitialForecastDetailsDtosValidator(forecasts, golCosts, costCategories, true, true);

      expect(validation.isValid).toBe(false);

      const forecastResult = validation.items.results.find(x => x.model.id === invalidForecast.Id)!;

      expect(forecastResult.isValid).toBe(false);

      const labourResult = validation.costCategoryForecasts.results.find(x => x.model.costCategory.id === labour.id)!;

      expect(labourResult.isValid).toBe(true);
    });
    it("should validate each cost category total must equal the total eligible costs for that cost category", async () => {

      const context = new TestContext();
      const partner = context.testData.createPartner();
      const labour = context.testData.createCostCategory({ type: CostCategoryType.Labour, name: "Labour" });
      const materials = context.testData.createCostCategory({ type: CostCategoryType.Materials, name: "Materials" });
      const subcontracting = context.testData.createCostCategory({ type: CostCategoryType.Subcontracting, name: "Subcontracting" });

      context.testData.createProfileTotalCostCategory(labour, partner, 90);
      context.testData.createProfileTotalCostCategory(materials, partner, 100);
      context.testData.createProfileTotalCostCategory(subcontracting, partner, 110);

      context.testData.createProfileDetail(labour, partner, 1, (item) => item.Acc_InitialForecastCost__c = 50);
      context.testData.createProfileDetail(labour, partner, 2, (item) => item.Acc_InitialForecastCost__c = 50);

      context.testData.createProfileDetail(materials, partner, 1, (item) => item.Acc_InitialForecastCost__c = 50);
      context.testData.createProfileDetail(materials, partner, 2, (item) => item.Acc_InitialForecastCost__c = 50);

      context.testData.createProfileDetail(subcontracting, partner, 1, (item) => item.Acc_InitialForecastCost__c = 50);
      context.testData.createProfileDetail(subcontracting, partner, 2, (item) => item.Acc_InitialForecastCost__c = 50);

      const forecasts = await context.runQuery(new GetAllInitialForecastsForPartnerQuery(partner.id));
      const golCosts = await context.runQuery(new GetAllForecastsGOLCostsQuery(partner.id));
      const costCategories = await context.runQuery(new GetCostCategoriesQuery());

      const validation = new InitialForecastDetailsDtosValidator(forecasts, golCosts, costCategories, true, true);

      expect(validation.isValid).toBe(false);

      const labourResult = validation.costCategoryForecasts.results.find(x => x.model.costCategory.id === labour.id)!;
      const materialsResult = validation.costCategoryForecasts.results.find(x => x.model.costCategory.id === materials.id)!;
      const subcontractingResult = validation.costCategoryForecasts.results.find(x => x.model.costCategory.id === subcontracting.id)!;

      expect(labourResult.isValid).toBe(false);
      expect(materialsResult.isValid).toBe(true);
      expect(subcontractingResult.isValid).toBe(false);
    });
  });

});
