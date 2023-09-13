import { visitApp } from "../../common/visit";
import {
  viewDrawdown,
  pmDrawdownGuidance,
  drawdownRequestTable,
  deleteFile,
  fcAndPmFileAssertion,
  hybridButtonAssertion,
} from "./steps";
const pmEmail = "james.black@euimeabs.test";
const fcEmail = "wed.addams@test.test.co.uk";

describe("Loans project > Drawdown view", () => {
  before(() => {
    visitApp({ asUser: pmEmail, path: "/loans/a0E2600000kTcmIEAS" });
  });

  it("Should click the drawdown 'View' button and land on the view-only drawdown page ", viewDrawdown);

  it("Has a back link", () => {
    cy.backLink("Back to loans summary page");
  });

  it("Has a project title", () => {
    cy.getByQA("page-title-caption").contains("CYPRESS_LOANS_DO_NOT_USE");
  });

  it("Should have drawdown guidance including link to drawdown pcrs", pmDrawdownGuidance);

  it("Should have the drawdown request table", drawdownRequestTable);

  it("Should log in as FC, upload a file and log back in as PM to assert the file is visible", fcAndPmFileAssertion);

  it("Should switch back to the FC and delete the file", () => {
    cy.switchUserTo(fcEmail);
    deleteFile();
  });

  it(
    "Should navigate back to the drawdown summary page as hybrid PM/FC and check the correct button text is displayed",
    hybridButtonAssertion,
  );
});
