import { nextYear, uploadDate } from "e2e/2-claims/steps";

var currentYear = new Date();
var thisProjectYear = currentYear.getFullYear() + 1;

const partners = ["EUI Small Ent Health", "ABS EUI Medium Enterprise", "A B Cad Services"] as const;

export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const projectPeriodSubHeading = () => {
  cy.get("h2").contains("Project period");
  cy.get("span").contains(thisProjectYear);
};

export const moDetailsSection = () => {
  cy.get("h3").contains("Monitoring Officer");
  ["Javier Baez", "testman2@testing.comnoemail", "Name", "Email"].forEach(moInfo => {
    cy.getByQA("monitoring-officer-details").contains(moInfo);
  });
};

export const pmDetailsSection = () => {
  ["James Black", "EUI Small Ent Health (Lead)", "james.black@euimeabs.test", "Name", "Partner", "Email"].forEach(
    pmInfo => {
      cy.getByQA("project-manager-details").contains(pmInfo);
    },
  );
  cy.get("h3").contains("Project Manager");
  cy.paragraph("Only project managers can raise project change requests.");
};

export const financeDetailsSection = () => {
  [
    "ken Charles",
    "A B Cad Services",
    "contact77@test.co.uknoemail",
    "Sarah Shuang",
    "ABS EUI Medium Enterprise",
    "s.shuang@irc.trde.org.uk.testnoemail",
    "Name",
    "Partner",
    "Email",
  ].forEach(fcInfo => {
    cy.getByQA("finance-contact-details").contains(fcInfo);
  });
  cy.get("h3").contains("Finance contacts");
  cy.paragraph("Only finance contacts can submit claims.");
};

export const manyFinanceDetailsSection = () => {
  [
    "contact30@test.co.uk",
    "contact7@test.co.uk",
    "contact9@test.co.uk",
    "b.doe@auto-corp.co.uk",
    "b.potter@test.co.uk",
    "b.baron@test.co.uk",
    "contact11@test.co.uk",
    "contact1c@test.co.uk",
    "contact1d@test.co.uk",
    "contact1@test.co.uk",
    "b.steven@test.co.uk",
    "c.smith@auto-corp.co.uk",
    "c.manton@test.co.uk",
    "c.mcelek@test.co.uk",
    "c.red@test.co.uk",
    "abc@test.com",
    "d.york@monitoring.test",
    "def@test.com",
    "elisabeth.evans@dev.yhdhdl.com.test",
    "emilie_prowsky@natinvestbank.co.uk.test",
    "ebrennan@limotors.org.uk.test",
    "contact77@test.co.uk",
    "m.davies@auto-health.co.uk",
    "n.mcdermott@auto-health.co.uk",
    "iukprovarmo5@gmail.com",
    "q.lewis@auto-monitoring.co.uk",
    "s.john@auto-research.co.uk",
    "s.shuang@irc.trde.org.uk.test",
    "t.williamson@auto-research.co.uk",
    "u.adams-taylor@auto-research.co.uk",
    "wed.addams@test.test.co.uk",
    "A Contact1",
    "Ali Green",
    "Ali Mohamed",
    "Anand Bhajji",
    "B Contact",
    "B Doe",
    "Billy Potter",
    "Brosnan Baron",
    "Bunty Steven",
    "C Contact",
    "C Smith",
    "Charlie Manton",
    "Charlie McElek",
    "Charlie Red",
    "D Contact",
    "David Bob",
    "Dylan York",
    "Einstine Mulgrew",
    "Elisabeth Evans",
    "Emilie Prowski",
    "Evelyn Brennan",
    "ken Charles",
    "M Davies",
    "N McDermott",
    "Provar MO5",
    "Q Lewis",
    "S John",
    "Sarah Shuang",
    "T Williamson",
    "Test McTester",
    "U Adams-Taylor",
    "Wednesday Addams",
    "Name",
    "Partner",
    "Email",
  ].forEach(fcInfo => {
    cy.getByQA("finance-contact-details").contains(fcInfo);
  });
  cy.get("h3").contains("Finance contacts");
  cy.paragraph("Only finance contacts can submit claims.");
};

export const ilDetailsSection = () => {
  ["Name", "Email", "Nicole Hedges", "nicole.hedges@iuk.ukri.org"].forEach(ilInfo => {
    cy.getByQA("innovation-lead-details").contains(ilInfo);
  });
  cy.get("h3").contains("Innovation lead");
};

export const ipmDetailsSection = () => {
  ["Name", "Email", "Allan Haines", "allan.haines@iuk.ukri.org"].forEach(ipmInfo => {
    cy.getByQA("ipm-details").contains(ipmInfo);
  });
  cy.get("h3").contains("IPM");
};

export const otherDetailsSection = () => {
  ["Name", "Role", "Relationship Manager", "Email", "allan.haines@iuk.ukri.org"].forEach(otherInfo => {
    cy.getByQA("contacts-table-details").contains(otherInfo);
  });
  cy.get("h3").contains("Other contacts");
};

export const partnerDetailsSection = () => {
  [
    "Partner",
    "Name",
    "Status",
    "Funding status",
    "Location",
    "EUI Small Ent Health",
    "Business",
    "Active",
    "Funded",
    "ABS EUI Medium Enterprise",
    "A B Cad Services",
    "SN5",
  ].forEach(partnerInfo => {
    cy.getByQA("partner-information").contains(partnerInfo);
  });
  cy.get("h2").contains("Partner information");
};

export const manyPartnerDetailsSection = () => {
  [
    "Auto Corporation Ltd",
    "Auto Monitoring Ltd",
    "EUI Micro Research Co.",
    "YHDHDL",
    "Gorcium Management Services Ltd.",
    "Intaser",
    "Auto Healthcare Ltd",
    "National Investment Bank",
    "NIB Reasearch Limited",
    "Red Motor Research Ltd.",
    "Lutor Systems",
    "Swindon University",
    "The Best Manufacturing",
    "Top Castle Co.",
    "University of Bristol",
    "Munce Inc",
    "Java Coffee Inc",
    "Hyperion Corporation",
    "Maliwan",
    "Jakobs",
    "Deep Rock Galactic",
    "EUI Small Ent Health",
    "Swindon University",
    "A B Cad Services",
    "Auto Research Ltd",
    "Vitruvius Stonework Limited",
    "RBA Test Account 1",
    "UAT37",
    "Hedges' Hedges Ltd",
    "ABS EUI Medium Enterprise",
    "Brown and co",
    "Swindon Development University",
    "Partner",
    "Name",
    "Status",
    "Funding status",
    "Location",
    "Business",
    "Active",
    "Funded",
  ].forEach(partnerInfo => {
    cy.getByQA("partner-information").contains(partnerInfo);
  });
  cy.get("h2").contains("Partner information");
};

export const detailsGuidanceMessage = () => {
  cy.paragraph("Only project managers can raise project change requests.");
  cy.paragraph("Only finance contacts can submit claims.");
  cy.paragraph(
    "If you need to change the lead project manager or finance contact, please email grants_service@iuk.ukri.org.",
  );
};

/**
 * Start and end date are prone to change to keep a project in the correct state for testing.
 * Therefore these are not included in the test.
 */
export const projectInfoSection = () => {
  [
    ["Competition name", "a002600000C6rp9"],
    ["Competition type", "CR&D"],
    ["Project start date", uploadDate],
    ["Project end date", nextYear.toString()],
    ["Duration", "12 months"],
    ["Number of periods", "12"],
    ["Project scope statement", "Howdy! I am the public summary for this Cypress project."],
  ].forEach(([key, item]) => {
    cy.getListItemFromKey(key, item);
  });
};

export const editEachPartner = () => {
  partners.forEach((partnerName, index) => {
    cy.getByQA("partner-information").contains(partnerName).click(),
      cy.getByQA("partner-details").contains(partnerName),
      cy.get("a").contains("Edit").click(),
      cy
        .get("#postcode")
        .clear()
        .type("SN" + index),
      cy.get("#hint-for-postcode").contains("Enter the postcode."),
      cy.submitButton("Save and return to partner information").click(),
      cy.getByQA("partner-name"),
      cy.backLink("Back to project details").click();
  });
};

export const showUpdatedPostcodes = () => {
  cy.reload();
  partners.forEach((partnerName, index) => {
    cy.getByQA("partner-information")
      .contains("tr", partnerName)
      .contains("td:nth-child(5)", "SN" + index);
  });
};

export const clearAndRevertPostodes = () => {
  partners.forEach(partnerName => {
    cy.getByQA("partner-information").contains(partnerName).click(),
      cy.getByQA("partner-details").contains(partnerName),
      cy.get("a").contains("Edit").click(),
      cy.get("#postcode").clear().type("SN5"),
      cy.submitButton("Save and return to partner information").click(),
      cy.getByQA("partner-name"),
      cy.backLink("Back to project details").click();
  });
};

export const reflectChangesMade = () => {
  cy.reload();
  cy.getByQA("partner-information").contains("td:nth-child(5)", "SN5");
};

export const navigateToPartnerHeadings = () => {
  cy.getByQA("partner-information").within(() => {
    cy.get("a").contains("EUI Small Ent Health").click();
  });
  cy.backLink("Back to project details");
  cy.getByQA("page-title").contains("328407");
  cy.heading("Partner information");
};

export const ensureTableIsPopulated = () => {
  [
    ["Name", "EUI Small Ent Health"],
    ["Type", "Business"],
    ["Location", "SN5"],
    ["Location", "Edit"],
  ].forEach(([key, item]) => {
    cy.getListItemFromKey(key, item);
  });
  cy.backLink("Back to project details").click();
  cy.heading("Project details");
};

export const partnerValidation = () => {
  cy.getByQA("partner-information").contains(partners[0]).click();
  cy.get("a").contains("Edit").click();
  cy.getByLabel("New location");
  cy.textValidation("Project location postcode", 10, "Save and return to partner information", false, "New location");
  cy.get("#postcode").clear().type("SN123456789");
  cy.get("a").contains("Edit").click();
  cy.get("#postcode").clear().type("SN2");
  cy.submitButton("Save and return to partner information").click();
  cy.backLink("Back to project details").click();
};
