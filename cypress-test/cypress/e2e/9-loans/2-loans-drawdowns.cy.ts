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
  /**
   * To test this properly, ensure one of the middle drawdowns have been deleted and re-built. This will therefore be the newest.
   * Despite being the 'newest' it should NOT change the ordering of the drawdowns in the front end. Unlike the bug in ACC-10572
   */
  it("Should display the Drawdown table in the correct order", drawdownTable);
});
