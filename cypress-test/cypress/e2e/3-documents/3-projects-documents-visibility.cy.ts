import { visitApp } from "../../common/visit";
import {
  fcLoginDelete,
  fcLoginViewFile,
  fcUploadToEUI,
  moLoginViewFile,
  pmLoginDelete,
  pmLoginViewFile,
  pmUploadToEUI,
} from "./steps";
const fcEmail = "wed.addams@test.test.co.uk";
const pmEmail = "james.black@euimeabs.test";

describe("Documents visibility between roles", () => {
  before(() => {
    visitApp({ asUser: fcEmail, path: "projects/a0E2600000kSvOGEA0/documents" });
  });

  it("Should upload a document against EUI Small Ent Health from the FC", fcUploadToEUI);

  it(
    "Should log out from FC and back in as PM (same partner) who can view the document uploaded by FC",
    pmLoginViewFile,
  );

  it("Should upload a document against EUI Small Ent Health from the PM", () => {
    cy.switchUserTo(pmEmail);
    pmUploadToEUI();
  });

  it("Should log back in as FC and check they can view the file", fcLoginViewFile);

  it("Should log in as MO and ensure they can see both test files", moLoginViewFile);

  it("Should log back in as FC and delete the documents uploaded", fcLoginDelete);

  it("Should log back in as PM and delete the file", pmLoginDelete);
});
