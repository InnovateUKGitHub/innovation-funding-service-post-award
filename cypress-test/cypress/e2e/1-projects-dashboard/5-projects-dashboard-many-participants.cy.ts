import { visitApp } from "common/visit";
import { pmEmail, switchUserTestLiveArea } from "./steps";

describe("projects dashboard > 10+ Participants", () => {
  before(() => {
    cy.clearAllCookies();
    visitApp({ path: "projects/dashboard", asUser: pmEmail });
  });

  it("Should check the pending and open projects section which should contain '154870'", () => {
    cy.getByQA("pending-and-open-projects").contains("154870");
  });

  it("Should switch to every other user and try again in turn", switchUserTestLiveArea);
});
