import { visitApp } from "common/visit";
import { pmEmail, switchUserTestLiveArea } from "./steps";

describe("js-disabled >projects dashboard > 10+ Participants", { tags: "js-disabled" }, () => {
  before(() => {
    cy.clearAllCookies();
    visitApp({ path: "projects/dashboard", asUser: pmEmail, jsDisabled: true });
  });

  beforeEach(() => {
    cy.disableJs();
  });

  it("Should check the pending and open projects section which should contain '154870'", () => {
    cy.getByQA("pending-and-open-projects").contains("154870");
  });

  it("Should switch to every other user and try again in turn", switchUserTestLiveArea);
});
