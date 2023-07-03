import "@testing-library/cypress/add-commands";
import { visitApp } from "common/visit";
import { Tile } from "typings/tiles";

const [username, password] = Cypress.env("BASIC_AUTH").split(":");

type CommandOptions = Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>;

const getByLabel = (label: string) => {
  cy.log("**getByLabel**");
  cy.contains("label", label)
    .invoke("attr", "for")
    .then(id => {
      cy.get("#" + id);
    });
};

const getByQA = (tag: string, options?: CommandOptions) => {
  cy.log("**getByQA**");
  cy.get(`[data-qa="${tag}"]`, options ?? { timeout: 15000 });
};

const getByPageQA = (tag: string) => {
  cy.log("**getByQA**");
  cy.get(`[data-page-qa="${tag}"]`);
};

const getByAriaLabel = (label: string) => {
  cy.log("**getByAriaLabel**");
  cy.get(`[aria-label="${label}"]`);
};

const userSwitcher = (payload: Record<string, string>, goHome: boolean = false) => {
  if (goHome) {
    payload.button_home = "";
  } else {
    payload.button_stay = "";
  }

  cy.request({
    method: "POST",
    url: "/developer/userSwitcher",
    form: true,
    body: payload,
    auth: {
      username,
      password,
    },
  }).then(res => {
    //
    res.redirectedToUrl ? cy.visit(res.redirectedToUrl, { auth: { username, password } }) : cy.reload();
  });
};

const switchUserTo = (email: string, goHome: boolean = false) => {
  cy.log(`**switchUserTo:${email}**`);
  userSwitcher({ user: email }, goHome);
};

const resetUser = (goHome: boolean = false) => {
  cy.log("**resetUser**");
  userSwitcher({ reset: "" }, goHome);
};

const backLink = (name: string) => {
  cy.log("**backLink**");
  cy.get("a.govuk-back-link").contains(name);
};

const submitButton = (name: string) => {
  cy.get('button[type="submit"]').contains(name);
};

/**
 * Note that this upload button is different to the one contained within Claims documents upload which is button_upload-qa
 */
const uploadButton = (name: string) => {
  cy.get('button[type="submit"]').contains(name);
};

const tableCell = (name: string) => {
  cy.get("td").contains(name);
};

const tableHeader = (name: string) => {
  cy.get("th").contains(name);
};

const assertPcrCompletionStatus = (pcrType: string, status: string) => {
  cy.log("**assertPcrCompletionStatus**");
  cy.get("li").contains(pcrType).get("strong").contains(status);
};

const clickCheckBox = (label: string, uncheck?: boolean) => {
  cy.log("**clickCheckBox**");
  if (uncheck) {
    cy.getByLabel(label).scrollIntoView().uncheck();
  } else {
    cy.getByLabel(label).scrollIntoView().check({ force: true });
  }
};

const navigateToProject = (projectId: string) => {
  const projectCardCss = '[data-qa="pending-and-open-projects"] .acc-list-item';
  cy.log("**navigateToProject**");
  cy.contains("Projects").click({ force: true });
  cy.get(`${projectCardCss} a`).wait(1000).contains(projectId).click({ force: true });
};

const selectTile = (label: Tile) => {
  cy.get(".card-link").contains(label).click();
};

const deletePcr = (projectId: string) => {
  visitApp({});
  cy.navigateToProject(projectId);
  cy.selectTile("Project change requests");
  cy.getByQA("pcrDeleteLink").contains("Delete").click();
  cy.get("button").contains("Delete request").click({ force: true });
};

const validationLink = (message: string) => {
  cy.log("**validationLink**");
  cy.getByQA("validation-summary").contains("a", message);
};

const validationMessage = (message: string) => {
  cy.log("**validationMessage**");
  cy.getByQA("validation-summary").contains(message);
};

Cypress.Commands.add("getByLabel", getByLabel);
Cypress.Commands.add("getByQA", getByQA);
Cypress.Commands.add("getByPageQA", getByPageQA);
Cypress.Commands.add("getByAriaLabel", getByAriaLabel);
Cypress.Commands.add("switchUserTo", switchUserTo);
Cypress.Commands.add("resetUser", resetUser);
Cypress.Commands.add("backLink", backLink);
Cypress.Commands.add("submitButton", submitButton);
Cypress.Commands.add("uploadButton", uploadButton);
Cypress.Commands.add("tableCell", tableCell);
Cypress.Commands.add("tableHeader", tableHeader);
Cypress.Commands.add("assertPcrCompletionStatus", assertPcrCompletionStatus);
Cypress.Commands.add("clickCheckBox", clickCheckBox);
Cypress.Commands.add("navigateToProject", navigateToProject);
Cypress.Commands.add("selectTile", selectTile);
Cypress.Commands.add("deletePcr", deletePcr);
Cypress.Commands.add("validationLink", validationLink);
Cypress.Commands.add("validationMessage", validationMessage);
