import { visitApp } from "common/visit";
import {
  deleteMoReport,
  clickMoReportTile,
  clickStartNewReportButton,
  completeAllSectionsWithComments,
  section1Summary,
  section2Summary,
  section3Summary,
  section4Summary,
  section5Summary,
  section6Summary,
  section7Summary,
  section8Summary,
  backAllTheWayOut,
  accessDraftReport,
  editSection3,
  reflectSection3,
  editSection1,
  updateSection2,
  skipSection3Update4,
  reflectSection1Changes,
  reflectSection2Changes,
  reflectSection4Changes,
  editSection5WithCopy,
  reflectSection5Changes,
} from "./steps";

const moContactEmail = "testman2@testing.com";

describe("MO report > Complete all sections, navigate sections", () => {
  before(() => {
    visitApp({ asUser: moContactEmail });
    cy.navigateToProject("328407");
  });

  after(() => {
    deleteMoReport();
  });

  it("should click the MO Reports tile", clickMoReportTile);

  it("Should click the 'Start a new report' button", clickStartNewReportButton);

  it("Complete all sections with comments", completeAllSectionsWithComments);

  it("Should correctly display the period number", () => {
    ["Period", "1", "Edit"].forEach(periodSection => {
      cy.getByQA("period").contains(periodSection);
    });
  });

  it("Should correctly display the Q1 summary table.", section1Summary);

  it("Should correctly display the Q2 summary table.", section2Summary);

  it("Should correctly display the Q3 summary table.", section3Summary);

  it("Should correctly display the Q4 summary table.", section4Summary);

  it("Should correctly display the Q5 summary table.", section5Summary);

  it("Should correctly display the Q6 summary table.", section6Summary);

  it("Should correctly display the Q7 summary table.", section7Summary);

  it("Should correctly display the Q8 summary table.", section8Summary);

  it(
    "Should click into the Issues and actions section and then back all the way out down the sections",
    backAllTheWayOut,
  );

  it("Should access the draft report again", accessDraftReport);

  it("Should click into Section 3 and alter the score and comment before saving", editSection3);

  it("Should reflect the Section 3 changes on the Summary page", reflectSection3);

  it("Should click into Section 1 'Scope' and alter the score and comment and then continue", editSection1);

  it("Should now be on Section 2 'Time' and will update and continue", updateSection2);

  it(
    "Should skip section 3 'Cost' as it's already updated and update section 4 'Exploitation' and Save and return to summary",
    skipSection3Update4,
  );

  it("Should reflect the Section 1 changes on the Summary page", reflectSection1Changes);

  it("Should reflect the Section 2 changes on the Summary page", reflectSection2Changes);

  it("Should reflect the Section 4 changes on the Summary page", reflectSection4Changes);

  it("Should access Section 5 'Risk management' and update the text with 2844 characters", editSection5WithCopy);

  it("Should reflect the Section 5 changes on the Summary page", reflectSection5Changes);
});