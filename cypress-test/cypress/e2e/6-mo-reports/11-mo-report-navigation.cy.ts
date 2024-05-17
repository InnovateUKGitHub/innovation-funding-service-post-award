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
  editSection5WithTooMuchCopy,
  reflectSection5Changes,
  assertSection7Comments,
  assertSectionCommentsAndScore,
  completeSection8,
  editSection5WithCorrectCopy,
} from "./steps";

const moContactEmail = "testman2@testing.com";

describe("MO report > Complete all sections, navigate sections", { tags: "smoke" }, () => {
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

  it("Should navigate back to section 7 and assert text entered previously is still saved", assertSection7Comments);

  it("Should navigate back to section 6, Project planning and assert the score and text entered previously is saved", () =>
    assertSectionCommentsAndScore("Project planning", 6));

  it("Should navigate back to section 5, Risk management and assert the score and text entered previously is saved", () =>
    assertSectionCommentsAndScore("Risk management", 5));

  it("Should navigate back to section 4, Exploitation and assert the score and text entered previously is saved", () =>
    assertSectionCommentsAndScore("Exploitation", 4));

  it("Should navigate back to section 3, Cost and assert the score and text entered previously is saved", () =>
    assertSectionCommentsAndScore("Cost", 3));

  it("Should navigate back to section 2, Time and assert the score and text entered previously is saved", () =>
    assertSectionCommentsAndScore("Time", 2));

  it("Should navigate back to section 1, Scope and assert the score and text entered previously is saved", () =>
    assertSectionCommentsAndScore("Scope", 1));

  it("Should click 'Save and return to summary'", () => {
    cy.button("Save and return to summary").click();
  });

  it("Should now enter comments into section 8 and save", completeSection8);

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

  it(
    "Should access Section 5 'Risk management' and update the text with 32,001 characters",
    editSection5WithTooMuchCopy,
  );

  it("Should validate that you are over the allowed character limit of 32,000", () => {
    cy.button("Save and return to summary").click();
    cy.validationLink("Maximum of 32,000 characters");
  });

  it("Should backspace a single character to bring the text to 32,000 characters", editSection5WithCorrectCopy);

  it("Should now correctly save and continue to the summary page", () => {
    cy.button("Save and return to summary").click();
    cy.heading("Monitoring report");
  });

  it("Should reflect the Section 5 changes on the Summary page", reflectSection5Changes);
});
