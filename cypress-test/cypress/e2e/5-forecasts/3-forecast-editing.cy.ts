import { visitApp } from "../../common/visit";
import {
  clearCostCategories,
  clickForecastTile,
  exceedGrantValue,
  revertCategoriesSubmit,
  updateLabourFields,
  submitCalculations,
  enterExtremePositiveValue,
  enterExtremeNegativeValue,
} from "./steps";

const financeContactEmail = "wed.addams@test.test.co.uk";

describe("Forecast > edit", () => {
  before(() => {
    visitApp({ asUser: financeContactEmail });

    cy.navigateToProject("879546");
  });

  it("should click the forecast tile", clickForecastTile);

  it("Should display a page heading and partner heading", () => {
    cy.heading("Forecast");
    cy.get("h2").contains("EUI Small Ent Health");
  });

  it("Should have an 'Update forecast' button", () => {
    cy.get("a").contains("Edit forecast").click();
  });

  it("Should allow Labour cost fields to be updated", updateLabourFields);

  it(
    "Should calculate the totals entered in each Labour item as £33,999.00 and submit the forecast",
    submitCalculations,
  );

  it(
    "Should click update forecast and enter a sum greater than the allowed grant and display an error",
    exceedGrantValue,
  );

  it(
    "Should clear the cost categories and submit with null values which should generate 6 separate validation messages",
    clearCostCategories,
  );

  it("Should enter an extreme value of 17 digits and validate appropriately", enterExtremePositiveValue);

  it("Should enter a large negative figure and save without validation", enterExtremeNegativeValue);

  it("Should revert the cost categories back to how they were and click submit", revertCategoriesSubmit);

  it("Should load the page correctly", () => {
    cy.get("a").contains("Edit forecast");
  });
});
