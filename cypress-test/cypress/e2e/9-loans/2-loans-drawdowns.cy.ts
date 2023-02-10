import { visitApp } from "../../common/visit";
import { drawdownCard, drawdownTable } from "./steps";

const fcEmail = "wed.addams@test.test.co.uk";

describe("Loans project > Drawdowns", () => {
  before(() => {
    visitApp({ asUser: fcEmail, path: "/projects/a0E2600000kTcmIEAS/overview" });
  });

  it("Should click the 'Drawdowns' card and navigate to the 'Drawdowns' page", drawdownCard);

  it("Has a back link", () => {
    cy.backLink("Back to Project");
  });

  it("Has a project title", () => {
    cy.getByQA("page-title-caption").contains("CYPRESS_LOANS_DO_NOT_USE");
  });

  it("Should display the Drawdown table", drawdownTable);
});
