import { visitApp } from "../../common/visit";
import {
  clearCostCategories,
  clickForecastsTile,
  exceedGrantValue,
  populateCategoriesZeroSubmit,
  updateLabourFields,
} from "./steps";

const financeContactEmail = "wed.addams@test.test.co.uk";

describe("Forecast > edit", () => {
  before(() => {
    visitApp({ asUser: financeContactEmail });

    cy.navigateToProject("879546");
  });

  it("should click the forecast tile", clickForecastsTile);

  it("Should display a page heading", () => {
    cy.get("h1").contains("Forecast");
  });

  it("Should have an 'Update forecast' button", () => {
    cy.get("a").contains("Update forecast").click();
  });

  it("Should allow Labour cost fields to be updated", updateLabourFields);

  it("Should calculate the totals entered in each Labour item as £666.00", () => {
    cy.tableCell("666");
  });

  it("Should now enter a sum greater than the allowed grant and display an error", exceedGrantValue);

  it(
    "Should clear the cost categories and submit with null values which should generate an error",
    clearCostCategories,
  );

  it("Should populate the cost categories with a zero and click submit", populateCategoriesZeroSubmit);
});
