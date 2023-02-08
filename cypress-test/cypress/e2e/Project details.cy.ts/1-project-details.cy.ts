import { visitApp } from "../../common/visit";
import {
  detailsGuidanceMessage,
  financeDetailsSection,
  ilDetailsSection,
  ipmDetailsSection,
  moDetailsSection,
  otherDetailsSection,
  partnerDetailsSection,
  pmDetailsSection,
  projectDetailsSection,
  projectPeriodSubHeading,
  shouldShowProjectTitle,
} from "./steps";

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

  it("Should show the 'Project period' subheading and date", projectPeriodSubHeading);

  it("Should have a back link", () => {
    cy.backLink("Back to project");
  });

  it("Should have 'Project members' heading", () => {
    cy.get("h2").contains("Project members");
  });

  it("Should have Monitoring Officer section", moDetailsSection);

  it("Should have Project Manager section", pmDetailsSection);

  it("Should have Finance contacts section", financeDetailsSection);

  it("Should have an Innovation Lead section", ilDetailsSection);

  it("Should have an IPM section", ipmDetailsSection);

  it("Should have Other contacts section", otherDetailsSection);

  it("Should display a Partner information section", partnerDetailsSection);

  it("Should present correct guidance messaging", detailsGuidanceMessage);

  it("Should have 'Project information' heading and correct fields", projectDetailsSection);
});
