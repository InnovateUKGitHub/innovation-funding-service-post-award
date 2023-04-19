import { visitApp } from "../../common/visit";
import {
  detailsGuidanceMessage,
  financeDetailsSection,
  ilDetailsSection,
  ipmDetailsSection,
  otherDetailsSection,
  partnerDetailsSection,
  projectInfoSection,
  shouldShowProjectTitle,
} from "./steps";

describe("Projects details", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kTirsEAC/overview" });
  });

  it("Should click the Project details tile", () => {
    cy.selectTile("Project details");
  });

  it("Should display a page heading", () => {
    cy.get("h1").contains("Project details");
  });

  it("Should have the project title", shouldShowProjectTitle);

  it("Should have Finance contacts section", financeDetailsSection);

  it("Should have an Innovation Lead section", ilDetailsSection);

  it("Should have an IPM section", ipmDetailsSection);

  it("Should have Other contacts section", otherDetailsSection);

  it("Should display a Partner information section", partnerDetailsSection);

  it("Should present correct guidance messaging", detailsGuidanceMessage);

  it("Should have 'Project information' heading and correct fields", projectInfoSection);
});
