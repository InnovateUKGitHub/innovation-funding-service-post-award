import { visitApp } from "../../common/visit";
import { shouldShowProjectTitle } from "./steps";

var currentYear = new Date();
var thisYear = currentYear.getFullYear();

describe("Projects details", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/overview" });
  });

  it("Should click the PCR card link", () => {
    cy.get("a").contains("Project details").click();
  });

  it("Should display a page heading", () => {
    cy.get("h1").contains("Project details");
  });

  it("Should have the project title", shouldShowProjectTitle);

  it("Should show the 'Project period' subheading and date", () => {
    cy.get("h2").contains("Project period");
    cy.get("span").contains(thisYear);
  });

  it("Should have a back link", () => {
    cy.backLink("Back to project");
  });

  it("Should have 'Project members' heading", () => {
    cy.get("h2").contains("Project members");
  });

  it("Should have Monitoring Officer section", () => {
    cy.getByQA("partner-information-monitoringOfficers");
    cy.get("h3").contains("Monitoring Officer");
    cy.get("tr").contains("Javier Baez").next().contains("testman2@testing.comnoemail");
  });

  it("Should have Project Manager section", () => {
    cy.getByQA("partner-information-projectManagers");
    cy.get("h3").contains("Project Manager");
    cy.get("tr")
      .contains("James Black")
      .next()
      .contains("EUI Small Ent Health (Lead)")
      .next()
      .contains("james.black@euimeabs.testnoemail");
  });

  it("Should have Finance contacts section", () => {
    cy.getByQA("partner-information-financeContacts");
    cy.get("h3").contains("Finance contacts");
    cy.get("tr")
      .contains("ken Charles")
      .next()
      .contains("A B Cad Services")
      .next()
      .contains("contact77@test.co.uknoemail");
    cy.get("tr")
      .contains("Sarah Shuang")
      .next()
      .contains("ABS EUI Medium Enterprise")
      .next()
      .contains("s.shuang@irc.trde.org.uk.testnoemail");
  });

  it("Should have Other contacts section", () => {
    cy.getByQA("partner-information-otherContacts");
    cy.get("h3").contains("Other contacts");
  });

  it("Should have an Innovation Lead section", () => {
    cy.getByQA("partner-information-innovationLeads");
  });

  it("Should have an IPM section", () => {
    cy.getByQA("partner-information-ipms");
  });

  it("Should have correct table headers", () => {
    cy.tableHeader("Name");
    cy.tableHeader("Email");
    cy.tableHeader("Partner");
    cy.tableHeader("Funding status");
    cy.tableHeader("Location");
  });

  it("Should display a Partner information section", () => {
    cy.get("tr")
      .contains("a", "EUI Small Ent Health")
      .next()
      .contains("Business")
      .next()
      .contains("Active")
      .next()
      .contains("Funded");
    cy.get("tr")
      .contains("a", "ABS EUI Medium Enterprise")
      .next()
      .contains("Business")
      .next()
      .contains("Active")
      .next()
      .contains("Funded");
    cy.get("tr")
      .contains("a", "A B Cad Services")
      .next()
      .contains("Business")
      .next()
      .contains("Active")
      .next()
      .contains("Funded");
  });

  it("Should display the lead partner with a suffix of '(Lead)'", () => {
    cy.get("tr").contains("(Lead)");
  });

  it("Should present correct guidance messaging", () => {
    cy.get("p").contains("Only project managers can raise project change requests.");
    cy.get("p").contains("Only finance contacts can submit claims.");
    cy.get("p").contains(
      "If you need to change the lead project manager or finance contact, please email grants_service@iuk.ukri.org.",
    );
  });

  it("Should have 'Project information' heading", () => {
    cy.get("h2").contains("Project information");
  });

  it("Should have correct fields in Project information section", () => {
    cy.getByQA("competition-name");
    cy.getByQA("competition-type");
    cy.getByQA("start-date");
    cy.getByQA("end-date");
    cy.getByQA("duration");
    cy.getByQA("periods");
    cy.getByQA("scope");
  });
});
