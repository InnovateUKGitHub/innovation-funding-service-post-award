import { visitApp } from "common/visit";
import { pcrTidyUp } from "common/pcrtidyup";
import { accessPcrCheckForComments, createChangeScope, populateCommentsAndSave, standardComments } from "./steps";

const pmEmail = "james.black@euimeabs.test";

describe("PCR > Save and return to requests", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard", asUser: pmEmail });
    pcrTidyUp("Draft");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should create a Change project scope PCR", createChangeScope);

  it(
    "Should populate the comments box with comments and then click 'Save and return to requests' button",
    populateCommentsAndSave,
  );

  it("Should access the PCR again and check that the comments have saved correctly", accessPcrCheckForComments);
});
