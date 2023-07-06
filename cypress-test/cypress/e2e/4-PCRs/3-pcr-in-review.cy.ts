import { visitApp } from "common/visit";
import { pcrStatusChange } from "common/pcrStatusChange";
import {
  leaveCommentQuery,
  switchUserMoReviewPcr,
  pcrStatusTable,
  switchUserCheckForComments,
  enterCommentsSubmit,
  switchToMoCheckComments,
} from "./steps";

describe("PCR > In Review", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSvOGEA0/pcrs/dashboard" });
    pcrStatusChange("Queried by Monitoring Officer");
  });

  it("Should switch user to Monitoring Officer and open the submitted PCR", switchUserMoReviewPcr);

  it("Should check that more than 10 status changes are displayed for the MO", pcrStatusTable);

  it("Should leave a comment and query the PCR", leaveCommentQuery);

  it("Should switch the user to PM and re-submit the claim with comments", switchUserCheckForComments);

  it("Should check that more than 10 status changes are displayed for the PM.", pcrStatusTable);

  it("Should enter comments and re-submit", enterCommentsSubmit);

  it("Should switch user back to MO and check for comments", switchToMoCheckComments);
});
