import {
  InitialForecastDetailsDtosValidator,
  InitialForecastDetailsDtoCostCategoryValidator,
} from "@ui/validators/initialForecastDetailsDtosValidator";
import { GetAllForecastsGOLCostsQuery, GetUnfilteredCostCategoriesQuery } from "@server/features/claims";
import { GetAllInitialForecastsForPartnerQuery } from "@server/features/forecastDetails/getAllInitialForecastsForPartnerQuery";
import { CostCategoryForecast } from "@ui/validators";
import { CostCategoryType } from "@framework/constants";
import { TestContext } from "@tests/test-utils/testContextProvider";

describe("InitialForecastDetailsDtoCostCategoryValidator()", () => {
  describe("should successfully fail", () => {
    test("when total forecasts do not match gol cost", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner();
      const labour = context.testData.createCostCategory({
        type: CostCategoryType.Labour,
        name: "Labour",
        isCalculated: true,
      });

      context.testData.createProfileTotalCostCategory(labour, partner, 10);
      context.testData.createProfileDetail(labour, partner, 1, item => (item.Acc_InitialForecastCost__c = 5));

      const forecasts = await context.runQuery(new GetAllInitialForecastsForPartnerQuery(partner.id));
      const golCosts = await context.runQuery(new GetAllForecastsGOLCostsQuery(partner.id));
      const costCategories = await context.runQuery(new GetUnfilteredCostCategoriesQuery());

      const stubForecast: CostCategoryForecast = {
        golCost: golCosts[0],
        forecasts,
        costCategory: costCategories[0],
      };

      const validation = new InitialForecastDetailsDtoCostCategoryValidator(stubForecast, false, true);

      expect(validation.isValid).toBe(true);
    });
  });

  describe("should successfully pass", () => {
    test("when counting forecast totals floating point numbers should parse correctly", async () => {
      /**
       * Note: JavaScript will return this math = 0.1 + 0.2 = 0.30000000000000004
       *
       * This test should ensure a response of 0.3, as user would expect it.
       */

      const stubFirstValue = 0.1;
      const stubSecondValue = 0.2;

      const stubExpectedTotal = 0.3;

      const context = new TestContext();
      const partner = context.testData.createPartner();
      const labour = context.testData.createCostCategory({ type: CostCategoryType.Labour, name: "Labour" });

      context.testData.createProfileTotalCostCategory(labour, partner, stubExpectedTotal);

      context.testData.createProfileDetail(
        labour,
        partner,
        1,
        item => (item.Acc_InitialForecastCost__c = stubFirstValue),
      );
      context.testData.createProfileDetail(
        labour,
        partner,
        2,
        item => (item.Acc_InitialForecastCost__c = stubSecondValue),
      );

      const forecasts = await context.runQuery(new GetAllInitialForecastsForPartnerQuery(partner.id));
      const golCosts = await context.runQuery(new GetAllForecastsGOLCostsQuery(partner.id));
      const costCategories = await context.runQuery(new GetUnfilteredCostCategoriesQuery());

      const stubForecast: CostCategoryForecast = {
        golCost: golCosts[0],
        forecasts,
        costCategory: costCategories[0],
      };

      const validation = new InitialForecastDetailsDtoCostCategoryValidator(stubForecast, true, true);

      expect(validation.isValid).toBe(true);
    });

    test("when submit is set to false", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner();
      const labour = context.testData.createCostCategory({ type: CostCategoryType.Labour, name: "Labour" });

      context.testData.createProfileTotalCostCategory(labour, partner, 10);
      context.testData.createProfileDetail(labour, partner, 1, item => (item.Acc_InitialForecastCost__c = 10));

      const forecasts = await context.runQuery(new GetAllInitialForecastsForPartnerQuery(partner.id));
      const golCosts = await context.runQuery(new GetAllForecastsGOLCostsQuery(partner.id));
      const costCategories = await context.runQuery(new GetUnfilteredCostCategoriesQuery());

      const stubForecast: CostCategoryForecast = {
        golCost: golCosts[0],
        forecasts,
        costCategory: costCategories[0],
      };

      const validation = new InitialForecastDetailsDtoCostCategoryValidator(stubForecast, false, true);

      expect(validation.isValid).toBe(true);
    });

    test("when isCalculated is truthy", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner();
      const labour = context.testData.createCostCategory({
        type: CostCategoryType.Labour,
        name: "Labour",
        isCalculated: true,
      });

      context.testData.createProfileTotalCostCategory(labour, partner, 10);
      context.testData.createProfileDetail(labour, partner, 1, item => (item.Acc_InitialForecastCost__c = 10));

      const forecasts = await context.runQuery(new GetAllInitialForecastsForPartnerQuery(partner.id));
      const golCosts = await context.runQuery(new GetAllForecastsGOLCostsQuery(partner.id));
      const costCategories = await context.runQuery(new GetUnfilteredCostCategoriesQuery());

      const stubForecast: CostCategoryForecast = {
        golCost: golCosts[0],
        forecasts,
        costCategory: costCategories[0],
      };

      const validation = new InitialForecastDetailsDtoCostCategoryValidator(stubForecast, false, true);

      expect(validation.isValid).toBe(true);
    });
  });
});

describe("InitialForecastDetailsValidator()", () => {
  describe("InitialForecastDetailsDtosValidator", () => {
    test("should not validate each cost category total if the forecast is not being submitted", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner();
      const labour = context.testData.createCostCategory({ type: CostCategoryType.Labour, name: "Labour" });

      context.testData.createProfileTotalCostCategory(labour, partner, 90);

      context.testData.createProfileDetail(labour, partner, 1, item => (item.Acc_InitialForecastCost__c = 50));
      context.testData.createProfileDetail(labour, partner, 2, item => (item.Acc_InitialForecastCost__c = 50));

      const forecasts = await context.runQuery(new GetAllInitialForecastsForPartnerQuery(partner.id));
      const golCosts = await context.runQuery(new GetAllForecastsGOLCostsQuery(partner.id));
      const costCategories = await context.runQuery(new GetUnfilteredCostCategoriesQuery());

      const validation = new InitialForecastDetailsDtosValidator(forecasts, golCosts, costCategories, false, true);

      expect(validation.isValid).toBe(true);

      const labourResult = validation.costCategoryForecasts.results.find(x => x.model.costCategory.id === labour.id)!;

      expect(labourResult.isValid).toBe(true);
    });

    test("should validate each cost category total if the forecast items are not valid", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner();
      const labour = context.testData.createCostCategory({ type: CostCategoryType.Labour, name: "Labour" });

      context.testData.createProfileTotalCostCategory(labour, partner, 90);

      const invalidForecast = context.testData.createProfileDetail(
        labour,
        partner,
        1,
        item => (item.Acc_InitialForecastCost__c = null as any),
      );
      context.testData.createProfileDetail(labour, partner, 2, item => (item.Acc_InitialForecastCost__c = 50));

      const forecasts = await context.runQuery(new GetAllInitialForecastsForPartnerQuery(partner.id));
      const golCosts = await context.runQuery(new GetAllForecastsGOLCostsQuery(partner.id));
      const costCategories = await context.runQuery(new GetUnfilteredCostCategoriesQuery());

      const validation = new InitialForecastDetailsDtosValidator(forecasts, golCosts, costCategories, true, true);

      expect(validation.isValid).toBe(false);

      const forecastResult = validation.items.results.find(x => x.model.id === invalidForecast.Id)!;

      expect(forecastResult.isValid).toBe(false);

      const labourResult = validation.costCategoryForecasts.results.find(x => x.model.costCategory.id === labour.id)!;

      expect(labourResult.isValid).toBe(false);
    });

    test("should validate each cost category total must equal the total eligible costs for that cost category", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner();
      const labour = context.testData.createCostCategory({ type: CostCategoryType.Labour, name: "Labour" });
      const materials = context.testData.createCostCategory({ type: CostCategoryType.Materials, name: "Materials" });
      const subcontracting = context.testData.createCostCategory({
        type: CostCategoryType.Subcontracting,
        name: "Subcontracting",
      });

      context.testData.createProfileTotalCostCategory(labour, partner, 90);
      context.testData.createProfileTotalCostCategory(materials, partner, 100);
      context.testData.createProfileTotalCostCategory(subcontracting, partner, 110);

      context.testData.createProfileDetail(labour, partner, 1, item => (item.Acc_InitialForecastCost__c = 50));
      context.testData.createProfileDetail(labour, partner, 2, item => (item.Acc_InitialForecastCost__c = 50));

      context.testData.createProfileDetail(materials, partner, 1, item => (item.Acc_InitialForecastCost__c = 50));
      context.testData.createProfileDetail(materials, partner, 2, item => (item.Acc_InitialForecastCost__c = 50));

      context.testData.createProfileDetail(subcontracting, partner, 1, item => (item.Acc_InitialForecastCost__c = 50));
      context.testData.createProfileDetail(subcontracting, partner, 2, item => (item.Acc_InitialForecastCost__c = 50));

      const forecasts = await context.runQuery(new GetAllInitialForecastsForPartnerQuery(partner.id));
      const golCosts = await context.runQuery(new GetAllForecastsGOLCostsQuery(partner.id));
      const costCategories = await context.runQuery(new GetUnfilteredCostCategoriesQuery());

      const validation = new InitialForecastDetailsDtosValidator(forecasts, golCosts, costCategories, true, true);

      expect(validation.isValid).toBe(false);

      const labourResult = validation.costCategoryForecasts.results.find(x => x.model.costCategory.id === labour.id)!;
      const materialsResult = validation.costCategoryForecasts.results.find(
        x => x.model.costCategory.id === materials.id,
      )!;
      const subcontractingResult = validation.costCategoryForecasts.results.find(
        x => x.model.costCategory.id === subcontracting.id,
      )!;

      expect(labourResult.isValid).toBe(false);
      expect(materialsResult.isValid).toBe(true);
      expect(subcontractingResult.isValid).toBe(false);
    });
  });
});
