import { visitApp } from "../../../common/visit";

const pmEmail = "james.black@euimeabs.test";

describe(
  "js-disabled >projects dashboard > Login using different cases in email addresses",
  { tags: "js-disabled" },
  () => {
    before(() => {
      visitApp({ path: "projects/dashboard", asUser: pmEmail, jsDisabled: true });
    });

    beforeEach(() => {
      cy.disableJs();
    });

    it("As PM it should display the project dashboard with projects in the live section", () => {
      cy.getByQA("pending-and-open-projects").contains("328407");
    });

    it("Should now switch user to the same email address but with an uppercase first letter 'James.black@euimeabs.test'", () => {
      cy.switchUserTo("James.black@euimeabs.test", { jsDisabled: true });
      cy.getByQA("pending-and-open-projects").contains("328407");
    });

    it("Should switch again to include a mix of upper and lower-case letters: 'JaMes.blacK@euimeabs.TEST'", () => {
      cy.switchUserTo("JaMes.blacK@euimeabs.TEST", { jsDisabled: true });
      cy.getByQA("pending-and-open-projects").contains("328407");
    });

    it("Should do the same with a different project role (FC) 'contact77@test.co.uk'", () => {
      cy.switchUserTo("contact77@test.co.uk", { jsDisabled: true });
      cy.getByQA("pending-and-open-projects").contains("328407");
    });

    it("Should should switch again to include a mix of upper and lower-case letters 'ContaCT77@TEST.co.uk'", () => {
      cy.switchUserTo("ContaCT77@TEST.co.uk", { jsDisabled: true });
      cy.getByQA("pending-and-open-projects").contains("328407");
    });
  },
);
