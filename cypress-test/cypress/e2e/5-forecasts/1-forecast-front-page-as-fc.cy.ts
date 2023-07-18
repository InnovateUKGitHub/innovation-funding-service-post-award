import { visitApp } from "../../common/visit";
import { clickForecastTile, displayForecastTable, shouldShowProjectTitle } from "./steps";

const financeContactEmail = "wed.addams@test.test.co.uk";

describe("Forecast > front page as FC", () => {
  before(() => {
    visitApp({ asUser: financeContactEmail });

    cy.navigateToProject("879546");
  });

  it("should click the forecast tile", clickForecastTile);

  it("Should display a page heading", () => {
    cy.heading("Forecast");
  });

  it("Should have the project title", shouldShowProjectTitle);

  it("Should have a back link", () => {
    cy.backLink("Back to project");
  });

  it("Should have forecast advice text", () => {
    cy.getByQA("forecastClaimAdvice").contains("You can only update forecasts");
  });

  it("Should display the top three rows correctly", () => {
    [
      ["Period", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      ["IAR Due", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes"],
      [
        "Month",
        "Mar 2023",
        "Apr 2023",
        "May 2023",
        "Jun 2023",
        "Jul 2023",
        "Aug 2023",
        "Sep 2023",
        "Oct 2023",
        "Nov 2023",
        "Dec 2023",
        "Jan 2024",
        "Feb 2024",
      ],
    ].forEach(([col1, col2, col3, col4, col5, col6, col7, col8, col9, col10, col11, col12, col13], rowNumber = 0) => {
      cy.get("tr")
        .eq(rowNumber + 1)
        .within(() => {
          cy.get("th:nth-child(1)").contains(col1);
          cy.get("th:nth-child(2)").contains(col2);
          cy.get("th:nth-child(3)").contains(col3);
          cy.get("th:nth-child(4)").contains(col4);
          cy.get("th:nth-child(5)").contains(col5);
          cy.get("th:nth-child(6)").contains(col6);
          cy.get("th:nth-child(7)").contains(col7);
          cy.get("th:nth-child(8)").contains(col8);
          cy.get("th:nth-child(9)").contains(col9);
          cy.get("th:nth-child(10)").contains(col10);
          cy.get("th:nth-child(11)").contains(col11);
          cy.get("th:nth-child(12)").contains(col12);
          cy.get("th:nth-child(13)").contains(col13);
        });
    });
  });

  it("should show the forecast table", displayForecastTable);

  it("Should have an 'Update forecast' button", () => {
    cy.get("a").contains("Update forecast");
  });
});
