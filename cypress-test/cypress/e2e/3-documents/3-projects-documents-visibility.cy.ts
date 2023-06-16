import { visitApp } from "../../common/visit";
import {
  fcLoginDelete,
  fcLoginViewFile,
  fcShouldNotDelete,
  fcUploadToEUI,
  moLoginViewFile,
  pmLoginDelete,
  pmLoginViewFile,
  pmShouldNotDelete,
  pmUploadToEUI,
} from "./steps";
const fcEmail = "wed.addams@test.test.co.uk";

describe("Documents visibility between roles", () => {
  before(() => {
    visitApp({ asUser: fcEmail, path: "projects/a0E2600000kSvOGEA0/documents" });
  });

  it("Should upload a document against EUI Small Ent Health from the FC", fcUploadToEUI);

  it(
    "Should log out from FC and back in as PM (same partner) who can view the document uploaded by FC",
    pmLoginViewFile,
  );

  it("Should not allow the PM to delete an FC file", pmShouldNotDelete);

  it("Should upload a document against EUI Small Ent Health from the PM", () => {
    pmUploadToEUI();
  });

  it(
    "Should log back in as FC and check they can view the file and is unable to delete the PM's file",
    fcLoginViewFile,
  );

  it("Should not allow the FC to delete a PM file", fcShouldNotDelete);

  it("Should log in as MO and ensure they can see both test files", moLoginViewFile);

  it("Should not allow the MO to delete a file", fcShouldNotDelete);

  it("Should log back in as FC and delete the documents uploaded", fcLoginDelete);

  it("Should log back in as PM and delete the file", pmLoginDelete);
});
