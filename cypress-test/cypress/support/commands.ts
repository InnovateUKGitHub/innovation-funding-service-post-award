import "@testing-library/cypress/add-commands";
import { seconds } from "common/seconds";
import { visitApp } from "common/visit";
import { CostCategory } from "typings/costCategory";
import { Heading } from "typings/headings";
import { PcrType } from "typings/pcr";
import { Tile } from "typings/tiles";

const [username, password] = Cypress.env("BASIC_AUTH").split(":");

type CommandOptions = Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>;

const getByLabel = (label: string) => {
  cy.log(`**getByLabel "${label}" **`);
  cy.contains("label", label)
    .invoke("attr", "for")
    .then(id => {
      cy.get("#" + id);
    });
};

const getListItemFromKey = (label: string, item: string) => {
  cy.log("**getListItemFromKey**");
  cy.contains("dt", label).siblings().contains(item);
};

const getByQA = (tag: string, options?: CommandOptions) => {
  cy.log("**getByQA**");
  cy.get(`[data-qa="${tag}"]`, options ?? { timeout: 25000 });
};

const getByRole = (role: string, label?: string) => {
  cy.log("**getByRole**");
  if (label) {
    cy.get(`[role="${role}"]`).contains(label);
  } else {
    cy.get(`[role="${role}"]`);
  }
};

const getHintFromLabel = (label: string) => {
  cy.log(`** get hint related to ${label} **`);
  cy.contains("label", label)
    .invoke("attr", "for")
    .then(id => {
      cy.get("#hint-for-" + id);
    });
};

const getErrorFromLabel = (label: string) => {
  cy.log(`** get error related to ${label} **`);

  cy.contains("label", label).siblings().get(".govuk-error-message");
};

const getByPageQA = (tag: string) => {
  cy.log("**getByQA**");
  cy.get(`[data-page-qa="${tag}"]`);
};

const getByAriaLabel = (label: string) => {
  cy.log("**getByAriaLabel**");
  cy.get(`[aria-label="${label}"]`);
};

const userSwitcher = (email: string, newPath?: string) => {
  // Intercept all future web requests, and inject our UserSwitcher(TM) header
  cy.intercept(Cypress.config().baseUrl + "/**", req => {
    req.headers["x-acc-userswitcher"] = email;
    req.continue();
  });

  // Capture all i18n requests so we can wait for them later
  cy.intercept("/internationalisation/**").as("i18n");

  if (newPath) {
    // Visit the new page
    cy.visit(newPath, { auth: { username, password }, headers: { "x-acc-userswitcher": email } });
  } else {
    cy.reload();
  }

  // Wait for i18n requests to complete before continuing
  cy.wait(["@i18n"]);
};

const userSwitcherJsDisabled = (email: string, newPath?: string) => {
  // Intercept all future web requests, and inject our UserSwitcherJSDisabled(TM) header
  cy.clearAllCookies();
  cy.intercept(Cypress.config().baseUrl + "/**", req => {
    req.headers["x-acc-userswitcher"] = email;
    req.headers["x-acc-js-disabled"] = "true";
    req.continue();
  });

  if (newPath) {
    // Visit the new page
    cy.log("js disabled visiting");
    cy.visit(newPath, {
      auth: { username, password },
      headers: { "x-acc-userswitcher": email, "x-acc-js-disabled": "true" },
    });
  } else {
    cy.reload(true);
  }
  cy.wait(seconds(3));
};

const switchUserTo = (
  email: string,
  options: { newPath?: string; jsDisabled?: boolean } = { newPath: "", jsDisabled: false },
) => {
  cy.log(`**switchUserTo:${email} **`);
  if (options.jsDisabled) {
    userSwitcherJsDisabled(email, options.newPath);
  } else {
    userSwitcher(email, options.newPath);
  }
};

const disableJs = () => {
  cy.intercept(Cypress.config().baseUrl + "/**", req => {
    req.headers["x-acc-js-disabled"] = "true";
    req.continue();
  });
};

const backLink = (name: string) => {
  cy.log("**backLink**");
  cy.get("a.govuk-back-link").contains(name);
};

const submitButton = (name: string) => {
  cy.get('button[type="submit"]').contains(name);
};

const button = (name: string) => {
  cy.get("button").contains(name);
};

/**
 * Note that this upload button is different to the one contained within Claims documents upload which is button_upload-qa.
 * N.B. this is identical to submitButton and should probably request a dev to use a standard data-qa for document uploads.
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

const getTableRow = <T extends string>(category: T) => {
  cy.log(`** getTableRow for ${category} **`);
  cy.get("table tr").contains(category).parents("tr");
};

const getCellFromHeaderAndRow = <T extends string, U extends string>(header: T, row: U) => {
  cy.log(`**getCellFromHeaderAndRow header: ${header}; row: ${row} **`);
  cy.contains("table thead th", header)
    .invoke("index")
    .then(columnIndex => cy.contains("tbody tr", row).find("td").eq(columnIndex));
};

const getCellFromHeaderAndRowNumber = <T extends string>(header: T, rowNumber: number, selector?: string) => {
  cy.log(`**getCellFromHeaderAndRowNumber header: ${header}; rowNumber: ${rowNumber} **`);

  if (selector) {
    cy.contains("table thead th", header)
      .invoke("index")
      .then(columnIndex => cy.get(`table tr:nth-child(${rowNumber})`).find("td").eq(columnIndex))
      .find(selector);
  } else {
    cy.contains("table thead th", header)
      .invoke("index")
      .then(columnIndex => cy.get(`table tr:nth-child(${rowNumber})`).find("td").eq(columnIndex));
  }
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
  cy.heading("Project change requests");
};

const validationLink = (message: string | RegExp) => {
  cy.log("**validationLink**");
  cy.getByQA("validation-summary").contains("a", message);
};

const validationMessage = (message: string) => {
  cy.log("**validationMessage**");
  cy.getByQA("validation-summary").contains(message);
};

const validationNotification = (message: string) => {
  cy.getByQA("validation-message-content").contains(message);
};

const heading = (title: Heading | Tile | CostCategory) => {
  cy.log("**heading**");
  cy.get("h1").should("have.text", title, { timeout: 50000 });
};

const paragraph = (content: string | RegExp) => {
  cy.log("**paragraph**");
  cy.get("p").contains(content);
};

const list = (title: string) => {
  cy.log("**list**");
  cy.get("li").contains(title);
};

const fileInput = (path: string, fileName?: string) => {
  cy.log("*fileInput**");
  cy.readFile(`cypress/documents/${path}`, null).then((contents: typeof Cypress.Buffer) => {
    cy.wait(200);
    cy.get(`input[type="file"]`)
      .wait(300)
      .selectFile({
        fileName: fileName ?? path,
        contents,
      });
  });
  cy.wait(300);
};

const downloadFile = (href: string): ReturnType<Cypress.Chainable["downloadFile"]> => {
  return cy.url().then(async path => {
    const pathToFetch = new URL(path);
    if (href.startsWith("/")) pathToFetch.pathname = href;

    const res = await fetch(pathToFetch);
    const blob = await res.arrayBuffer();
    const base64 = Buffer.from(blob).toString("base64");
    const headers = [...(res.headers as any)] as [[string, string]];

    return {
      headers: Object.fromEntries(headers),
      ok: res.ok,
      redirected: res.redirected,
      statusText: res.statusText,
      status: res.status,
      type: res.type,
      url: res.url,
      base64,
    };
  });
};

const createPcr = (pcr: PcrType, options?: { jsDisabled?: boolean }) => {
  if (options?.jsDisabled) {
    cy.wait(seconds(2));
    cy.clickCheckBox(pcr);
    cy.wait(seconds(3));
    cy.button("Create request").click();
  } else {
    cy.wait(500);
    cy.clickCheckBox(pcr);
    cy.intercept("POST", "/api/pcrs/*").as("pcrPrepare");
    cy.wait(500);
    cy.button("Create request").click();
    cy.wait("@pcrPrepare");
  }
};

function clickOn(...args: unknown[]) {
  if (typeof args[0] === "string" && typeof args[1] === "string") {
    cy.contains(args[0], new RegExp(`^${args[1]}$`)).click(args[2]);
  } else if (typeof args[0] === "string" && typeof args[1] !== "string") {
    cy.contains(new RegExp(`^${args[0]}$`)).click(args[1]);
  }
}

function enter(label: string, value: string) {
  cy.getByLabel(label).clear().type(value);
}

function checkEntry(label: string, value: string) {
  cy.getByLabel(label).should("have.value", value);
}

function selectProject(label: string) {
  cy.getByQA("pending-and-open-projects").contains(label).click();
}

const checkTotalFor = (label: string, total: string | number) => {
  cy.get("tr").contains(label).siblings().contains(total);
};

const clickLink = (label: string, link: "Edit" | "Review" | "Delete" | "Remove") => {
  cy.get("tr").contains(label).siblings().contains("a", link).click();
};

const validateCurrency = (label: string, errorLabel: string, validValue: string, submitLabel?: string) => {
  const errorToken = errorLabel.toLowerCase();
  const firstPlaceErrorToken = errorToken
    .split("")
    .map((x, i) => (i === 0 ? x.toUpperCase() : x))
    .join("");
  cy.getByLabel(label).clear();
  if (submitLabel) cy.clickOn(submitLabel);
  cy.validationLink(`Enter ${errorToken}.`);
  cy.getByLabel(label).clear().type("banana");
  cy.validationLink(`${firstPlaceErrorToken} must be a number.`);
  cy.getByLabel(label).clear().type("35.45678");
  cy.validationLink(`${firstPlaceErrorToken} must be 2 decimal places or fewer.`);
  cy.getByLabel(label).clear().type(validValue);
};

const validatePositiveWholeNumber = (label: string, errorLabel: string, validValue: string, submitLabel?: string) => {
  const errorToken = errorLabel.toLowerCase();
  const firstPlaceErrorToken = errorToken
    .split("")
    .map((x, i) => (i === 0 ? x.toUpperCase() : x))
    .join("");
  cy.getByLabel(label).clear();
  if (submitLabel) cy.clickOn(submitLabel);
  cy.validationLink(`Enter ${errorToken}.`);
  cy.getByLabel(label).clear().type("banana");
  cy.validationLink(`${firstPlaceErrorToken} must be a number.`);
  cy.getByLabel(label).clear().type("35.45678");
  cy.validationLink(`${firstPlaceErrorToken} must be a whole number, like 15.`);
  cy.getByLabel(label).clear().type("-56");
  cy.validationLink(`${firstPlaceErrorToken} must be 0 or more.`);
  cy.getByLabel(label).clear().type(validValue);
};

Cypress.Commands.add("getByLabel", getByLabel);
Cypress.Commands.add("getListItemFromKey", getListItemFromKey);
Cypress.Commands.add("getByQA", getByQA);
Cypress.Commands.add("getByPageQA", getByPageQA);
Cypress.Commands.add("getByRole", getByRole);
Cypress.Commands.add("getHintFromLabel", getHintFromLabel);
Cypress.Commands.add("getErrorFromLabel", getErrorFromLabel);
Cypress.Commands.add("getByAriaLabel", getByAriaLabel);
Cypress.Commands.add("switchUserTo", switchUserTo);
Cypress.Commands.add("disableJs", disableJs);
Cypress.Commands.add("backLink", backLink);
Cypress.Commands.add("submitButton", submitButton);
Cypress.Commands.add("uploadButton", uploadButton);
Cypress.Commands.add("tableCell", tableCell);
Cypress.Commands.add("tableHeader", tableHeader);
Cypress.Commands.add("getTableRow", getTableRow);
Cypress.Commands.add("getCellFromHeaderAndRow", getCellFromHeaderAndRow);
Cypress.Commands.add("getCellFromHeaderAndRowNumber", getCellFromHeaderAndRowNumber);
Cypress.Commands.add("assertPcrCompletionStatus", assertPcrCompletionStatus);
Cypress.Commands.add("clickCheckBox", clickCheckBox);
Cypress.Commands.add("navigateToProject", navigateToProject);
Cypress.Commands.add("selectTile", selectTile);
Cypress.Commands.add("deletePcr", deletePcr);
Cypress.Commands.add("validationLink", validationLink);
Cypress.Commands.add("validationMessage", validationMessage);
Cypress.Commands.add("heading", heading);
Cypress.Commands.add("button", button);
Cypress.Commands.add("paragraph", paragraph);
Cypress.Commands.add("list", list);
Cypress.Commands.add("fileInput", fileInput);
Cypress.Commands.add("validationNotification", validationNotification);
Cypress.Commands.add("downloadFile", downloadFile);
Cypress.Commands.add("createPcr", createPcr);
Cypress.Commands.add("clickOn", clickOn);
Cypress.Commands.add("getHintFromLabel", getHintFromLabel);
Cypress.Commands.add("enter", enter);
Cypress.Commands.add("checkEntry", checkEntry);
Cypress.Commands.add("selectProject", selectProject);
Cypress.Commands.add("checkTotalFor", checkTotalFor);
Cypress.Commands.add("clickLink", clickLink);
Cypress.Commands.add("validateCurrency", validateCurrency);
Cypress.Commands.add("validatePositiveWholeNumber", validatePositiveWholeNumber);
