/**
 * Yeilds the HTML element with the specified label
 * @param label The value of the HTML `label=` property
 */
const getByLabel = (label: string) => {
  cy.contains("label", label)
    .invoke("attr", "for")
    .then(id => {
      cy.get("#" + id);
    });
};

/**
 * Yeilds the DD elements within a DT element with the specified label
 * @param label The text within the DT label
 */
const getListItemFromKey = (label: string) => {
  cy.contains("dt", label).siblings().get("dd");
};

/**
 * Yeilds the element with the specified QA property
 * @param tag The value of the HTML `data-qa=` property
 */
const getByQA = (tag: string) => {
  cy.log("**getByQA**");
  cy.get(`[data-qa="${tag}"]`);
};

/**
 * Yeilds the element with the specified ARIA role
 * @param role The value of the aria HTML `role=` property
 */
const getByRole = (role: string) => {
  cy.log("**getByRole**");
  cy.get(`[role="${role}"]`);
};

/**
 * Yeilds the element with the specified Page QA property
 * @param tag The value of the page `data-page-qa=` property
 */
const getByPageQA = (tag: string) => {
  cy.log("**getByQA**");
  cy.get(`[data-page-qa="${tag}"]`);
};

/**
 * Yeilds the element with the specified ARIA label
 * @param label The value of the aria HTML `aria-label=` property
 */
const getByAriaLabel = (label: string) => {
  cy.log("**getByAriaLabel**");
  cy.get(`[aria-label="${label}"]`);
};

/**
 * Yeilds the backlink element with the specified contents
 * @param contents The contents of the backlink
 */
const getBackLink = (contents: string) => {
  cy.log("**getBackLink**");
  cy.get("a.govuk-back-link").contains(contents);
};

/**
 * Yeilds the submit button with the specified contents
 * @param contents The contents of the submit button
 */
const getSubmitButton = (contents: string) => {
  cy.log("**getSubmitButton**");
  cy.get('button[type="submit"]').contains(contents);
};

/**
 * Yeilds the button with the specified contents
 * @param contents The contents of the button
 */
const getButton = (contents: string) => {
  cy.get("button").contains(contents);
};

const getTableCell = (name: string) => {
  cy.get("td").contains(name);
};

const getTableHeader = (name: string) => {
  cy.get("th").contains(name);
};

const getTableRow = (category: string) => {
  cy.get("table tr").contains(category).parent();
};

/**
 * Yeilds the H1 HTML element with the specified content
 * @param title The contents of the H1 element
 */
const getHeading = (title: string) => {
  cy.log("**heading**");
  cy.get("h1").contains(title);
};

/**
 * Yeilds the P HTML element with the specified content
 * @param content The contents of the P element
 */
const getParagraph = (content: string) => {
  cy.log("**paragraph**");
  cy.get("p").contains(content);
};

/**
 * Yeilds the LI HTML element with the specified content
 * @param title The contents of the LI element
 */
const getList = (title: string) => {
  cy.log("**list**");
  cy.get("li").contains(title);
};

const getCommands = {
  getByLabel,
  getListItemFromKey,
  getByQA,
  getByRole,
  getByPageQA,
  getByAriaLabel,
  getBackLink,
  getSubmitButton,
  getButton,
  getTableCell,
  getTableHeader,
  getTableRow,
  getHeading,
  getParagraph,
  getList,
} as const;

export { getCommands };
