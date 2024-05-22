import { GetOptions } from "./component";

/**
 * Yeilds the HTML element labelled by the specified text
 * @param label The contents of the LABEL element
 */
const getByLabel = (label: string | number | RegExp) => {
  return cy
    .contains("label", label)
    .invoke("attr", "for")
    .then(id => {
      cy.get("#" + id.replaceAll(".", "\\."));
    });
};

/**
 * Yeilds the LABEL HTML element with the specified content
 * @param label The contents of the LABEL element
 */
const getLabel = (label: string) => {
  return cy.contains("label", label);
};

/**
 * Yeilds the DD elements within a DT element with the specified label
 * @param label The text within the DT label
 */
const getListItemFromKey = (label: string) => {
  return cy.contains("dt", label).siblings().get("dd");
};

/**
 * Yeilds the element with the specified QA property
 * @param tag The value of the HTML `data-qa=` property
 */
const getByQA = (tag: string, opt?: GetOptions) => {
  cy.log("**getByQA**");
  return cy.get(`[data-qa="${tag}"]`, opt);
};

/**
 * Yeilds the element with the specified ARIA role
 * @param role The value of the aria HTML `role=` property
 */
const getByRole = (role: string) => {
  cy.log("**getByRole**");
  return cy.get(`[role="${role}"]`);
};

/**
 * Yeilds the element with the specified Page QA property
 * @param tag The value of the page `data-page-qa=` property
 */
const getByPageQA = (tag: string) => {
  cy.log("**getByQA**");
  return cy.get(`[data-page-qa="${tag}"]`);
};

/**
 * Yeilds the element with the specified ARIA label
 * @param label The value of the aria HTML `aria-label=` property
 */
const getByAriaLabel = (label: string) => {
  cy.log("**getByAriaLabel**");
  return cy.get(`[aria-label="${label}"]`);
};

/**
 * Yeilds the backlink element with the specified contents
 * @param contents The contents of the backlink
 */
const getBackLink = (contents: string) => {
  cy.log("**getBackLink**");
  return cy.get("a.govuk-back-link").contains(contents);
};

/**
 * Yeilds the submit button with the specified contents
 * @param contents The contents of the submit button
 */
const getSubmitButton = (contents: string) => {
  cy.log("**getSubmitButton**");
  return cy.get('button[type="submit"]').contains(contents);
};

/**
 * Yeilds the button with the specified contents
 * @param contents The contents of the button
 */
const getButton = (contents: string) => {
  return cy.get("button").contains(contents);
};

const getTableCell = (name: string) => {
  return cy.get("td").contains(name);
};

const getTableHeader = (name: string) => {
  return cy.get("th").contains(name);
};

const getTableRow = (category: string) => {
  return cy.get("table tr").contains(category).parent();
};

type TableData = (string | undefined | RegExp)[][];

interface TableShape {
  head?: TableData;
  body?: TableData;
  footer?: TableData;
}

const getTableShape = (dataQa: string, shape: TableShape) => {
  cy.getByQA(dataQa)
    .find("table")
    .within($table => {
      const checkTable = (section: "thead" | "tbody" | "tfoot", cells: string, data: TableData) => {
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].length; j++) {
            if (data[i][j]) {
              cy.wrap($table).find(section).find("tr").eq(i).find(cells).eq(j).contains(data[i][j]);
            }
          }
        }
      };

      if (shape.head) checkTable("thead", "th,td", shape.head);
      if (shape.body) checkTable("tbody", "th,td", shape.body);
      if (shape.footer) checkTable("tfoot", "th,td", shape.footer);
    });
};

/**
 * Yeilds the H1 HTML element with the specified content
 * @param title The contents of the H1 element
 */
const getPageHeading = (title: string, options?: Partial<Cypress.Timeoutable>) => {
  cy.log("**getPageHeading**");
  return cy.get("h1", options).contains(title, options);
};

/**
 * Yeilds the H2/H3/H4/H5/H6 HTML element with the specified content
 * @param title The contents of the H1 element
 */
const getHeading = (title: string) => {
  cy.log("**getHeading**");
  return cy.get("h2,h3,h4,h5,h6").contains(title);
};

/**
 * Yeilds the P HTML element with the specified content
 * @param content The contents of the P element
 */
const getParagraph = (content: string) => {
  cy.log("**paragraph**");
  return cy.get("p").contains(content);
};

/**
 * Yeilds the LI HTML element with the specified content
 * @param title The contents of the LI element
 */
const getList = (title: string) => {
  cy.log("**list**");
  return cy.get("li").contains(title);
};

const getCaption = (title: string) => {
  cy.log("**pageCaption**");
  return cy.getByQA("page-title-caption").contains(title);
};

const getCommands = {
  getByLabel,
  getLabel,
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
  getPageHeading,
  getParagraph,
  getList,
  getCaption,
  getTableShape,
} as const;

export { getCommands };
