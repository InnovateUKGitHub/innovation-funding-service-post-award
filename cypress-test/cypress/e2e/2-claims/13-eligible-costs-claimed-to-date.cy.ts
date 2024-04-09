import { visitApp } from "common/visit";
import { drgClaimTwo, shouldShowCostsClaimedToDateTable } from "./steps";
const fcContact = "pauline.o'jones@uobcw.org.uk.test.prod";

describe("Claims > Eligible costs claimed to date", () => {
  before(() => {
    visitApp({ asUser: fcContact, path: "projects/a0E2600000kSvOGEA0/overview" });
  });
  it("Should navigate to the claims tile and access the period 2 claim for Deep Rock Galactic", drgClaimTwo);

  it("Should validate the cost category table contains all relevant data", shouldShowCostsClaimedToDateTable);

  it("Should check the previous status and comments log and ensure they are clear", () => {
    cy.getByQA("claim-status-change-table").should("not.exist");
  });
});
