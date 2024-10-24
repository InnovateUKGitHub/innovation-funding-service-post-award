import { fileTidyUp } from "common/filetidyup";
import { visitApp } from "../../common/visit";
import { manyPartnerDocDelete, manyPartnerUpload, shouldShowProjectTitle } from "./steps";

describe("Project Documents page > Uploading to many partners", { tags: "smoke" }, () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kTirsEAC/documents" });
    fileTidyUp("testfile.doc");
  });

  it("Should display correct project name", shouldShowProjectTitle);

  /**The below asserts both the drop-down box for the partners and that they can each have docs uploaded */
  it("Should upload a file for each partner on the project", { retries: 0 }, manyPartnerUpload);

  /** The below asserts that every partner appears on the page when there are a large number and cleans up the page */
  it(
    "Should check that the partner is noted in the documents table and remove the file",
    { retries: 0 },
    manyPartnerDocDelete,
  );
});
