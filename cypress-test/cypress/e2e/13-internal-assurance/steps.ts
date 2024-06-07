const costCatDocCopy =
  "Upload evidence of the costs for Innovate UK to review. If you do not upload documents Innovate UK are unlikely to accept your claim. Contact us for advice on which documents to provide.";

const costBreakdownCopy =
  "You must break down your total costs and upload evidence for each expenditure you are claiming for. Contact Innovate UK for more information about the level of detail you are required to provide.";
export const accessCostCat = (category: string) => {
  cy.clickOn(category);
  cy.get("h1").contains(category);
  cy.paragraph(costCatDocCopy);
  cy.paragraph(costBreakdownCopy);
  cy.get("p").should("not.contain", "monitoring officer");
  cy.clickOn("Back to claim");
  cy.heading("Costs to be claimed");
};

export const triggerForecastCopy = () => {
  cy.getByAriaLabel("Labour Period 2").clear().type("35001");
  cy.getByAriaLabel("info message").should("contain", "Innovate UK will let you know if they have any concerns.");
  cy.getByAriaLabel("info message").should(
    "not.contain",
    "Your Monitoring Officer will let you know if they have any concerns.",
  );
  cy.getByAriaLabel("Labour Period 2").clear().type("0");
};

export const documentsScreenCopy = () => {
  cy.clickOn("Continue to claims documents");
  cy.heading("Claim documents");
  cy.paragraph(
    "An Independent Accountant's Report (IAR) must be uploaded to support the claim before it can be submitted to Innovate UK. If your total grant value is £50,000 or under, a Statement of Expenditure (SoE) may be sufficient. Innovate UK will be able to confirm which document is needed.",
  );
  cy.get("p").should("not.contain", "monitoring officer");
  cy.get("p").should("not.contain", "Monitoring Officer");
};

export const forecastScreenCopy = () => {
  cy.clickOn("Continue to update forecast");
  cy.heading("Update forecast");
  triggerForecastCopy();
};
export const summaryPageCopy = () => {
  cy.clickOn("Continue to summary");
  cy.heading("Claim summary");
  cy.get("#hint-for-comments").should("have.text", "If you want to explain anything to Innovate UK, add it here.");
  cy.get("#hint-for-comments").should(
    "not.have.text",
    "If you want to explain anything to your monitoring officer or to Innovate UK, add it here.",
  );
};

const documentCopy = [
  `Documents stored here are only accessible to participants representing "EUI Small Ent Health".`,
  `Documents stored here are only accessible to participants representing "EUI Small Ent Health".`,
  "You must upload supporting documents on the page you are submitting your claim or PCR. Do not use this page for claims or PCRs.",
];

export const documentsCorrectCopy = () => {
  cy.selectTile("Documents");
  cy.heading("Project documents");
  documentCopy.forEach(docCopy => {
    cy.paragraph(docCopy);
  });
  cy.get("p").should("not.contain", "monitoring officer");
  cy.get("p").should("not.contain", "Monitoring Officer");
  cy.get("h3").contains("Documents for EUI Small Ent Health");
};

export const startNewRequestCopy = () => {
  cy.get("main").within(() => {
    cy.get("li").contains("discuss this request with Innovate UK");
    cy.get("li").should("not.contain", "monitoring officer");
  });
};

export const createAddPartnerCheckCopy = () => {
  cy.createPcr("Add a partner");
  cy.heading("Request");
  cy.get("#hint-for-comments").should("have.text", "If you want to explain anything to Innovate UK, add it here.");
  cy.get("#hint-for-comments").should(
    "not.have.text",
    "If you want to explain anything to your monitoring officer or to Innovate UK, add it here.",
  );
};

export const accessAddPartnerCheckCopy = () => {
  cy.get("a").contains("Add a partner").click();
  cy.heading("Add a partner");
  cy.get("#hint-for-partner-type").should(
    "have.text",
    "If the new partner's organisation type is not listed, contact Innovate UK.",
  );
  cy.get("#hint-for-partner-type").should(
    "not.have.text",
    "If the new partner's organisation type is not listed, contact your monitoring officer.",
  );
};
