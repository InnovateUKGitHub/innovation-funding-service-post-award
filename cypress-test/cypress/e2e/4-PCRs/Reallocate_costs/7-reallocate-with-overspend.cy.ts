import { pcrTidyUp } from "common/pcrtidyup";
import { visitApp } from "common/visit";
import {
  accessAbCadCheckValidation,
  accessReallocateCosts,
  clickSaveAndReturn,
  reAccessAbCadCheckValidation,
  reallocateLabourToMaterials,
  reallocateMatsToLabourRemoveVal,
  revertToIncomplete,
} from "./reallocate-steps";

const projManager = "james.black@euimeabs.test";

describe("Reallocate project costs > Partner with overspend", () => {
  before(() => {
    visitApp({ asUser: projManager });
    cy.navigateToProject("572821");
  });
  after(() => {
    cy.deletePcr("572821");
  });

  it("Should click on the Project change request tile", () => {
    cy.selectTile("Project change requests");
    cy.heading("Project change requests");
    pcrTidyUp("Reallocate project costs");
  });

  it("Should create a Reallocate project costs PCR", () => cy.createPcr("Reallocate project costs"));

  it(
    "Should access Reallocate project costs and navigate to EUI Small Ent Health who has no overspend",
    accessReallocateCosts,
  );

  it("Should reallocate funds between Labour and Materials", reallocateLabourToMaterials);

  it("Should successfully save this change and return to the partners view", () => {
    cy.clickOn("Save and return to reallocate project costs");
    cy.get("legend").contains("Mark as complete");
  });

  it("Should click 'I agree with the change' and then 'Save and return to request' prompting validation", () =>
    clickSaveAndReturn({ expectValidation: true }));

  it("Should access A B Cad Services and check validation", accessAbCadCheckValidation);

  it(
    "Should reallocate costs to increase the Labour budget which will remove validation",
    reallocateMatsToLabourRemoveVal,
  );

  it("Should save and return to Reallocate project costs", () => {
    cy.clickOn("Save and return to reallocate project costs");
    cy.get("legend").contains("Mark as complete");
  });

  it("Should check 'I agree with this change' and save and return to request", () =>
    clickSaveAndReturn({ expectValidation: false }));

  it("Should display Reallocate project costs as Complete", () => {
    cy.get("main").within(() => {
      cy.get("li").eq(1).contains("Complete");
    });
  });

  it(
    "Should go back into the PCR and uncheck 'I agree with this change' and Save and return access A B Cad Services",
    revertToIncomplete,
  );

  it(
    "Should access A B Cad Services and check validation works on the virement page by resetting costs and attempting save",
    reAccessAbCadCheckValidation,
  );

  it("Should reallocate costs to remove the validation messaging", reallocateMatsToLabourRemoveVal);
});
