import { visitApp } from "../../common/visit";
import {
  accessABSOpenClaim,
  shouldShowAcademicCostCatTable,
  shouldShowProjectTitle,
  newCostCatLineItem,
  correctTableHeaders,
  updateAcademicCosts,
  academicForecastNavigate,
} from "./steps";

describe("claims > edit claims as FC", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/overview" });
  });

  it("clicking Claims will navigate to claims screen", () => {
    cy.selectTile("Claims");
  });

  it("Displays a claim in draft state", accessABSOpenClaim);

  it("Should have a back option", () => {
    cy.backLink("Back to claims");
  });

  it("Displays the project title", shouldShowProjectTitle);

  it("Displays the period information", () => {
    cy.get("h2").should("contain.text", "Period");
  });

  it("Displays the cost category table", shouldShowAcademicCostCatTable);

  it("Should let you click on the cost category 'Directly incurred - Staff'", () => {
    cy.get("a").contains("Directly incurred - Staff").click();
  });

  it("Should still display the project title and cost category title", shouldShowProjectTitle);

  it("Should display the cost category heading", () => {
    cy.heading("Directly incurred - Staff");
  });

  it("Should show relevant messaging at the top of the page", () => {
    cy.getByQA("guidance-message").should("contain.text", "evidence");
  });

  it("The table should have correct headers", correctTableHeaders);

  it("Should allow you to enter a new cost category line item", () => newCostCatLineItem(true));

  it("Should display the same figure entered against 'Total costs'", () => {
    cy.get("span.currency").contains("£1,000.00");
  });

  it("Should remove the line item", () => {
    cy.clickOn("Remove");
  });

  it("Should navigate to the claims forecast page", academicForecastNavigate);

  it("Should display the correct cost category forecast and update figures", updateAcademicCosts);
});
