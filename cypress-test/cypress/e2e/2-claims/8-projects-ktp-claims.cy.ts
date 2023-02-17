import { visitApp } from "../../common/visit";
import { accessOpenClaim, shouldShowProjectTitle } from "./steps";

describe("claims > KTP", () => {
  before(() => {
    visitApp({ path: "/projects/a0E2600000kTfqTEAS/overview" });
  });

  it("clicking Claims will navigate to claims screen", () => {
    cy.selectTile("Claims");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to project");
  });

  it("Displays a claim in draft state", accessOpenClaim);

  it("Displays the project title", shouldShowProjectTitle);

  it("Should display 'Costs to be claimed' title and guidance messaging", () => {
    cy.get("h1").contains("Costs to be claimed");
    cy.getByQA("validation-message-content").contains(
      "This project does not follow the normal grant calculation rules",
    );
    cy.getByQA("validation-message-content").contains(
      "The project and any partner may have one or more cost categories",
    );
  });

  it("Should contain the correct KTP cost categories", () => {
    [
      "Associate Employment",
      "Travel and subsistence",
      "Consumables",
      "Associate development",
      "Knowledge base supervisor",
      "Estate",
      "Indirect costs",
      "Other costs",
      "Additional associate support",
      "Subcontracting",
    ].forEach(ktpCostCat => {
      cy.getByQA("cost-cat").contains(ktpCostCat);
    });
    [
      "Category",
      "Total eligible costs",
      "Eligible costs claimed to date",
      "Costs claimed this period",
      "Remaining eligible costs",
      "Total",
    ].forEach(tableHeader => {
      cy.tableHeader(tableHeader);
    });
  });

  it("Should click into the 'Associate Employment' category and take you to that page", () => {
    cy.get("td").contains("Associate Employment").click();
  });

  it("Should have Associate Employment page heading and guidance", () => {
    cy.get("h1").contains("Associate Employment");
    cy.getByQA("validation-message-content").contains(
      "This project does not follow the normal grant calculation rules",
    );
    cy.getByQA("validation-message-content").contains(
      "The project and any partner may have one or more cost categories paid at a different funding award rate compared to your overall funding award rate.",
    );

    cy.getByQA("guidance-currency-message").contains("You can enter up to 120 separate lines of costs");
  });

  it("Should click 'Back to claims'", () => {
    cy.backLink("Back to claims").click();
  });

  it("Should click 'Continue to claims documents' and land on the right page", () => {
    cy.submitButton("Continue to claims documents").click();
    cy.get("h1").contains("Claim documents");
  });

  it("Should have KTP guidance messaging around document uploads", () => {
    [
      "For KTP claims, you must upload one of these claim approval documents",
      "LMC minutes",
      "LMC virtual approval",
    ].forEach(ktpDocGuidance => {
      cy.getByQA("iarText").contains(ktpDocGuidance);
    });
  });

  it("Should click 'Continue to update forecast' and ensure correct cost categories are listed", () => {
    cy.get("a").contains("Continue to update forecast").click();
    [
      "Associate Employment",
      "Travel and subsistence",
      "Consumables",
      "Associate development",
      "Knowledge base supervisor",
      "Estate",
      "Indirect costs",
      "Other costs",
      "Additional associate support",
      "Subcontracting",
    ].forEach(ktpCostCat => {
      cy.getByQA("field-claimForecastTable").contains(ktpCostCat);
    });
  });

  it("Should update 'Associate Employment' to check the calculations are working", () => {
    ["Associate Employment Period 2", "Associate Employment Period 3", "Associate Employment Period 4"].forEach(
      ktpInput => {
        cy.getByAriaLabel(ktpInput).clear().type("100");
      },
    );
    ["td:nth-child(3)", "td:nth-child(4)", "td:nth-child(5)"].forEach(column => {
      cy.get(column).contains("£100.00");
    });

    cy.get("td:nth-child(6)").contains("£300.00");
    ["Associate Employment Period 2", "Associate Employment Period 3", "Associate Employment Period 4"].forEach(
      ktpInput => {
        cy.getByAriaLabel(ktpInput).clear().type("0");
      },
    );
  });

  it("Should continue to summary and display the correct messaging", () => {
    cy.submitButton("Continue to summary").click();
    cy.get("h1").contains("Claim summary");
  });

  it("Should display correct messaging", () => {
    cy.getByQA("validation-message-content").contains(
      "This project does not follow the normal grant calculation rules",
    );
    cy.getByQA("validation-message-content").contains(
      "The project and any partner may have one or more cost categories",
    );
  });
});
