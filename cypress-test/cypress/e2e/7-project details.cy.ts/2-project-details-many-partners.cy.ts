import { visitApp } from "../../common/visit";
import {
  detailsGuidanceMessage,
  manyFinanceDetailsSection,
  ilDetailsSection,
  ipmDetailsSection,
  otherDetailsSection,
  manyPartnerDetailsSection,
  projectInfoSection,
  shouldShowProjectTitle,
} from "./steps";

describe("Projects details > Many partners", () => {
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

  it("Should have Finance contacts section", manyFinanceDetailsSection);

  it("Should have an Innovation Lead section", ilDetailsSection);

  it("Should have an IPM section", ipmDetailsSection);

  it("Should have Other contacts section", otherDetailsSection);

  it("Should display a Partner information section", manyPartnerDetailsSection);

  it("Should present correct guidance messaging", detailsGuidanceMessage);
});
