import { visitApp } from "../../../common/visit";
import { testEach } from "../../../support/methods";
import {
  monitoringReportCardShouldNotExist,
  shouldFindMatchingProjectCard,
  navigateFilter,
  collaboratorFinancials,
} from "./steps";

const financeContactEmail = "contact77@test.co.uk";

describe(" js disabled > project dashboard as Finance Contact", { tags: "js-disabled" }, () => {
  before(() => {
    visitApp({ asUser: financeContactEmail, jsDisabled: true });
  });

  beforeEach(() => {
    cy.disableJs();
  });

  it("Should navigate to the project list and filter the correct project", navigateFilter);

  it("Should display the correct project card which displays 'you need to submit your claim'", () => {
    ["You need to submit your claim", "EUI Small Ent Health"].forEach(cardItem => {
      cy.getByQA("project-328407").contains(cardItem);
    });
  });

  it("Should now navigate to the project", () => {
    cy.get("a").contains("328407").click();
  });

  it("Should display the correct project name in a subtitle", () => {
    cy.get("h2").contains("A B Cad Services costs to date");
  });

  it("Should display finance information at the top of the page", collaboratorFinancials);

  testEach(["Claims", "Forecast", "Project change requests", "Documents", "Project details", "Finance summary"])(
    'should show the "$0" Link',
    shouldFindMatchingProjectCard,
  );

  it("should not show the Monitoring Reports card to Finance Contacts", monitoringReportCardShouldNotExist);

  it("Should show a claim needs submitting", () => {
    cy.getByQA("message-ClaimDue").contains("Claim due");
  });
});
