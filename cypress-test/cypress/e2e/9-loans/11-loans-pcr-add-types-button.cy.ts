import { pcrTidyUp } from "common/pcrtidyup";
import { visitApp } from "../../common/visit";
import {
  addRemainingPcrTypes,
  backOutCreateProjectOnHold,
  createReallocatePartnerPcr,
  learnWhyPCRTypesMissing,
} from "./steps";
const pmEmail = "james.black@euimeabs.test";

describe("Loans project > PCR", () => {
  before(() => {
    visitApp({ asUser: pmEmail, path: "projects/a0E2600000kTcmIEAS/pcrs/dashboard" });
    pcrTidyUp("Draft");
  });
  after(() => {
    cy.deletePcr("191431");
  });

  it("Should have a 'Start new request heading'", () => {
    cy.heading("Start a new request");
  });

  it("Should add 'Reallocate project costs' and create PCR", createReallocatePartnerPcr);

  it("Should access the 'Add types' section", () => {
    cy.get("a").contains("Add types").click();
    cy.heading("Add types");
  });

  it("Should add remaining allowed PCR types one by one", addRemainingPcrTypes);

  it("Add types link should no longer exist", () => {
    cy.get("a").contains("Add types").should("not.exist");
  });

  it(
    "Should back out of this PCR and assert that it is not possible to create another 'Put project on hold'",
    backOutCreateProjectOnHold,
  );

  it("Should have a greyed out Create request button", () => {
    cy.get("a").should("not.contain", "Create request");
    cy.contains("span", "Create request");
  });
});
