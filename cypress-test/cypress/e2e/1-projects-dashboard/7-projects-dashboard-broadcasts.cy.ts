import { visitApp } from "common/visit";
import {
  shouldDisplayTwoProjectCards,
  shouldNavigateToProjectDashboard,
  accessBroadCastMessageAndAssert,
  backToDashboard,
  hasBroadcasts,
  hasLimitedBroadcasts,
  ktpBroadcastInvisible,
  broadcastMessageText,
} from "./steps";

const KTP_PM = "james.black@euimeabs.test";
const KTP_FC1 = "testman2@testing.com";
const KTP_FC2 = "s.shuang@irc.trde.org.uk.test";
const KTP_MO = "contact77@test.co.uk";
const NOT_KTP = "b.potter@test.co.uk";

describe("projects dashboard > Broadcast message", () => {
  before(() => {
    visitApp({ asUser: KTP_PM });
  });

  it("displays two cards", shouldDisplayTwoProjectCards);

  it('should navigate to project dashboard when the "Projects" card is selected', shouldNavigateToProjectDashboard);

  it("Should include four broadcast messages at the top of the page", hasBroadcasts);

  it("Should follow the link to access the full broadcast information", () =>
    accessBroadCastMessageAndAssert("Cypress broadcast message"));

  it("Should display the correct broadcast message text", () =>
    broadcastMessageText("This is a test message for Cypress."));

  it("Should follow the back link to the previous page", backToDashboard);

  it("Should follow the link to access the KTP broadcast information", () =>
    accessBroadCastMessageAndAssert("KTP KTP KTP KTP KTP KTP KTP KTP KTP KTP"));

  it("Should display the correct broadcast message text", () =>
    broadcastMessageText("This is a KTP-only broadcast message."));

  it("Should follow the back link to the previous page", backToDashboard);

  it("Should follow the link to access the CR&D-only broadcast information", () =>
    accessBroadCastMessageAndAssert("CR&D CR&D CR&D CR&D CR&D CR&D"));

  it("Should display the correct broadcast message text", () =>
    broadcastMessageText("This is a CR&D-only broadcast message."));

  it("Should follow the back link to the previous page", backToDashboard);

  it("Should follow the link to access the full broadcast information", () =>
    accessBroadCastMessageAndAssert("NO COMP TYPE"));

  it("Should display the correct broadcast message text", () =>
    broadcastMessageText("This is a broadcast message for all projects."));

  it("Should follow the back link to the previous page", backToDashboard);

  /**
   * User switching STILL KTP
   */
  it("Should switch user to KTP_FC1", () => {
    cy.switchUserTo(KTP_FC1);
  });

  it("Should include four broadcast messages at the top of the page", hasBroadcasts);

  it("Should follow the link to access the full broadcast information", () =>
    accessBroadCastMessageAndAssert("Cypress broadcast message"));

  it("Should display the correct broadcast message text", () =>
    broadcastMessageText("This is a test message for Cypress."));

  it("Should follow the back link to the previous page", backToDashboard);

  it("Should follow the link to access the KTP broadcast information", () =>
    accessBroadCastMessageAndAssert("KTP KTP KTP KTP KTP KTP KTP KTP KTP KTP"));

  it("Should display the correct broadcast message text", () =>
    broadcastMessageText("This is a KTP-only broadcast message."));

  it("Should follow the back link to the previous page", backToDashboard);

  it("Should follow the link to access the CR&D-only broadcast information", () =>
    accessBroadCastMessageAndAssert("CR&D CR&D CR&D CR&D CR&D CR&D"));

  it("Should display the correct broadcast message text", () =>
    broadcastMessageText("This is a CR&D-only broadcast message."));

  it("Should follow the back link to the previous page", backToDashboard);

  it("Should follow the link to access the full broadcast information", () =>
    accessBroadCastMessageAndAssert("NO COMP TYPE"));

  it("Should display the correct broadcast message text", () =>
    broadcastMessageText("This is a broadcast message for all projects."));

  it("Should follow the back link to the previous page", backToDashboard);

  /**
   * User switching STILL KTP
   */
  it("Should switch user to KTP_FC2", () => {
    cy.switchUserTo(KTP_FC2);
  });

  it("Should include four broadcast messages at the top of the page", hasBroadcasts);

  it("Should follow the link to access the full broadcast information", () =>
    accessBroadCastMessageAndAssert("Cypress broadcast message"));

  it("Should follow the back link to the previous page", backToDashboard);

  it("Should follow the link to access the KTP broadcast information", () =>
    accessBroadCastMessageAndAssert("KTP KTP KTP KTP KTP KTP KTP KTP KTP KTP"));

  it("Should display the correct broadcast message text", () =>
    broadcastMessageText("This is a KTP-only broadcast message."));

  it("Should follow the back link to the previous page", backToDashboard);

  it("Should follow the link to access the CR&D-only broadcast information", () =>
    accessBroadCastMessageAndAssert("CR&D CR&D CR&D CR&D CR&D CR&D"));

  it("Should display the correct broadcast message text", () =>
    broadcastMessageText("This is a CR&D-only broadcast message."));

  it("Should follow the back link to the previous page", backToDashboard);

  it("Should follow the link to access the full broadcast information", () =>
    accessBroadCastMessageAndAssert("NO COMP TYPE"));

  it("Should display the correct broadcast message text", () =>
    broadcastMessageText("This is a broadcast message for all projects."));

  it("Should follow the back link to the previous page", backToDashboard);

  /**
   * User switching STILL KTP
   */
  it("Should switch user to KTP_MO", () => {
    cy.switchUserTo(KTP_MO);
  });

  it("Should include four broadcast messages at the top of the page", hasBroadcasts);

  it("Should follow the link to access the full broadcast information", () =>
    accessBroadCastMessageAndAssert("Cypress broadcast message"));

  it("Should display the correct broadcast message text", () =>
    broadcastMessageText("This is a test message for Cypress."));

  it("Should follow the back link to the previous page", backToDashboard);

  it("Should follow the link to access the KTP broadcast information", () =>
    accessBroadCastMessageAndAssert("KTP KTP KTP KTP KTP KTP KTP KTP KTP KTP"));

  it("Should display the correct broadcast message text", () =>
    broadcastMessageText("This is a KTP-only broadcast message."));

  it("Should follow the back link to the previous page", backToDashboard);

  it("Should follow the link to access the CR&D-only broadcast information", () =>
    accessBroadCastMessageAndAssert("CR&D CR&D CR&D CR&D CR&D CR&D"));

  it("Should display the correct broadcast message text", () =>
    broadcastMessageText("This is a CR&D-only broadcast message."));

  it("Should follow the back link to the previous page", backToDashboard);

  it("Should follow the link to access the full broadcast information", () =>
    accessBroadCastMessageAndAssert("NO COMP TYPE"));

  it("Should display the correct broadcast message text", () =>
    broadcastMessageText("This is a broadcast message for all projects."));

  it("Should follow the back link to the previous page", backToDashboard);

  /**
   * User switching NON-KTP
   * IF THIS STEP EVER FAILS, DOUBLE CHECK BILLY POTTER HASN'T BEEN ADDED TO KTP PROJECT IN SALESFORCE
   */
  it("Should switch user to a non-ktp user", () => {
    cy.switchUserTo(NOT_KTP);
  });

  it("Should not show KTP broadcasts", ktpBroadcastInvisible);

  it("Should show the full broadcast message and CR&D broadcast", hasLimitedBroadcasts);

  it("Should follow the link to access the full broadcast information", () =>
    accessBroadCastMessageAndAssert("Cypress broadcast message"));

  it("Should display the correct broadcast message text", () =>
    broadcastMessageText("This is a test message for Cypress."));

  it("Should follow the back link to the previous page", backToDashboard);

  it("Should follow the link to access the CR&D-only broadcast information", () =>
    accessBroadCastMessageAndAssert("CR&D CR&D CR&D CR&D CR&D CR&D"));

  it("Should display the correct broadcast message text", () =>
    broadcastMessageText("This is a CR&D-only broadcast message."));

  it("Should follow the back link to the previous page", backToDashboard);

  it("Should follow the link to access the full broadcast information", () =>
    accessBroadCastMessageAndAssert("NO COMP TYPE"));

  it("Should display the correct broadcast message text", () =>
    broadcastMessageText("This is a broadcast message for all projects."));

  it("Should follow the back link to the previous page", backToDashboard);
});
