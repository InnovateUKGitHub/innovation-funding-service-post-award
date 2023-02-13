import { visitApp } from "../../common/visit";
import {
  clearCostCategories,
  clickForecastTile,
  exceedGrantValue,
  populateCategoriesZeroSubmit,
  showPartnerTable,
  updateLabourFields,
} from "./steps";

const financeContactEmail = "james.black@euimeabs.test";

describe("Forecast > edit", () => {
  before(() => {
    visitApp({ asUser: financeContactEmail });

    cy.navigateToProject("879546");
  });

  it("should click the forecast tile", clickForecastTile);

  it("Should display the partner table", showPartnerTable);

  it("Should click the first View forecast link", () => {
    cy.contains("td", "EUI Small Ent Health (Lead)").siblings().contains("a", "View forecast").click();
  });

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
