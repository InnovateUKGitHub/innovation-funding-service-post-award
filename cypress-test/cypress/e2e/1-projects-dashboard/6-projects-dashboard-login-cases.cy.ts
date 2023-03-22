import { visitApp } from "../../common/visit";

const pmEmail = "james.black@euimeabs.test";

describe("projects dashboard > Login using different cases in email addresses", () => {
  before(() => {
    visitApp({ path: "projects/dashboard", asUser: pmEmail });
  });

  it("As PM it should display the project dashboard with projects in the live section", () => {
    cy.getByQA("pending-and-open-projects").contains("328407");
  });

  it("Should now switch user to the same email address but with an uppercase first letter 'James.black@euimeabs.test'", () => {
    cy.switchUserTo("James.black@euimeabs.test");
    cy.getByQA("pending-and-open-projects").contains("328407");
  });

  it("Should switch again to include a mix of upper and lower-case letters: 'JaMes.blacK@euimeabs.TEST'", () => {
    cy.switchUserTo("JaMes.blacK@euimeabs.TEST");
    cy.getByQA("pending-and-open-projects").contains("328407");
  });

  it("Should do the same with a different project role (FC) 'contact77@test.co.uk'", () => {
    cy.switchUserTo("contact77@test.co.uk");
    cy.getByQA("pending-and-open-projects").contains("328407");
  });

  it("Should should switch again to include a mix of upper and lower-case letters 'ContaCT77@TEST.co.uk'", () => {
    cy.switchUserTo("ContaCT77@TEST.co.uk");
    cy.getByQA("pending-and-open-projects").contains("328407");
  });
});
