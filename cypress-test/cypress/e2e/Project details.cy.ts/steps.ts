var currentYear = new Date();
var thisYear = currentYear.getFullYear();

export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const projectPeriodSubHeading = () => {
  cy.get("h2").contains("Project period");
  cy.get("span").contains(thisYear);
};

export const moDetailsSection = () => {
  cy.get("h3").contains("Monitoring Officer");
  ["Javier Baez", "testman2@testing.comnoemail"].forEach(moInfo => {
    cy.getByQA("partner-information-monitoring-officer").contains(moInfo);
  });
};

export const pmDetailsSection = () => {
  ["James Black", "EUI Small Ent Health (Lead)", "james.black@euimeabs.testnoemail"].forEach(pmInfo => {
    cy.getByQA("partner-information-project-manager").contains(pmInfo);
  });
  cy.get("h3").contains("Project Manager");
  cy.get("p").contains("Only project managers can raise project change requests.");
};

export const financeDetailsSection = () => {
  [
    "ken Charles",
    "A B Cad Services",
    "contact77@test.co.uknoemail",
    "Sarah Shuang",
    "ABS EUI Medium Enterprise",
    "s.shuang@irc.trde.org.uk.testnoemail",
  ].forEach(fcInfo => {
    cy.getByQA("partner-information-finance-contacts").contains(fcInfo);
  });
  cy.get("h3").contains("Finance contacts");
  cy.get("p").contains("Only finance contacts can submit claims.");
};

export const ilDetailsSection = () => {
  ["Name", "Email", "Nicole Hedges", "nicole.hedges@iuk.ukri.org"].forEach(ilInfo => {
    cy.getByQA("partner-information-innovation-lead").contains(ilInfo);
  });
  cy.get("h3").contains("Innovation lead");
};

export const ipmDetailsSection = () => {
  ["Name", "Email", "Wednesday Addams", "wed.addams@test.test.co.uk"].forEach(ipmInfo => {
    cy.getByQA("partner-information-ipm").contains(ipmInfo);
  });
  cy.get("h3").contains("IPM");
};

export const otherDetailsSection = () => {
  ["Name", "Role", "Relationship Manager", "Email", "allan.haines@iuk.ukri.org"].forEach(otherInfo => {
    cy.getByQA("partner-information-other-contacts").contains(otherInfo);
  });
  cy.get("h3").contains("Other contacts");
};

export const partnerDetailsSection = () => {
  [
    "Partner",
    "Name",
    "Email",
    "Funding status",
    "Location",
    "EUI Small Ent Health",
    "Business",
    "Active",
    "Funded",
    "ABS EUI Medium Enterprise",
    "A B Cad Services",
  ].forEach(partnerInfo => {
    cy.getByQA("partner-information").contains(partnerInfo);
  });
  cy.get("h2").contains("Partner information");
};

export const detailsGuidanceMessage = () => {
  cy.get("p").contains("Only project managers can raise project change requests.");
  cy.get("p").contains("Only finance contacts can submit claims.");
  cy.get("p").contains(
    "If you need to change the lead project manager or finance contact, please email grants_service@iuk.ukri.org.",
  );
};

/**
 * Start and end date are prone to change to keep a project in the correct state for testing.
 * Therefore these are not included in the test.
 */
export const projectDetailsSection = () => {
  [
    "Competition name",
    "Competition type",
    "Project start date",
    "Project end date",
    "Duration",
    "Number of periods",
    "Project scope statement",
    "a002600000C6rp9",
    "CR&D",
    "12 months",
  ].forEach(projInfo => {
    cy.getByQA("project-details").contains(projInfo);
  });
};
