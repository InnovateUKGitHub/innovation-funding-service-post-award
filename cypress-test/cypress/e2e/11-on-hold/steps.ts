import { Tile } from "typings/tiles";

export const onHoldMessage = () => {
  cy.validationNotification("Partner is on hold. Contact Innovate UK for more information.");
};

export const onHoldShouldNotExist = () => {
  cy.get("main").within(() => {
    cy.getByQA("validation-message-content").should("not.exist");
  });
};

export const moOnHoldShouldNotExist = () => {
  cy.getByQA("validation-message-content").should(
    "not.contain",
    "Partner is on hold. Contact Innovate UK for more information.",
  );
};

export const accessProjectCard = (projectNum: string) => {
  cy.wait(1000);
  cy.getByQA("pending-and-open-projects").within(() => {
    cy.getByQA(`project-${projectNum}`).contains("a", projectNum).click();
  });
  cy.heading("Project overview");
};

export const accessTileAndCheckOnHoldMessage = (tile: Tile) => {
  cy.selectTile(tile);
  onHoldMessage();
  suspensionNotificationShouldNotExist();
  cy.get("a").contains("Back to project").click();
  cy.heading("Project overview");
};

export const checkViewOnlyClaim = () => {
  cy.get("td").contains("Draft").siblings().contains("View").click();
  cy.heading("Claim");
  onHoldMessage();
  cy.getByQA("cost-cat");
  cy.clickOn("Back to claims");
  cy.heading("Claims");
};

export const accessForecastsCheckForMessaging = () => {
  cy.selectTile("Forecasts");
  cy.heading("Forecasts");
  onHoldMessage();
  suspensionNotificationShouldNotExist();
  ["Swindon University", "Provar MO Account"].forEach((partner, index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get("td:nth-child(1)").contains(partner);
        cy.get("td:nth-child(6)").contains("View forecast").click();
      });
    cy.heading("Forecast");
    cy.get("h2").contains(partner);
    cy.get("a").should("not.have.text", "Edit forecast");
    cy.clickOn("Back to forecasts");
    cy.heading("Forecasts");
  });
};

export const accessPcrTileCheckReadOnly = () => {
  cy.selectTile("Project change requests");
  cy.heading("Project change requests");
  [
    ["6", "Put project on hold", "Queried to Project Manager"],
    ["5", "Approve a new subcontractor", "Queried to Project Manager"],
    ["4", "Change project scope", "Submitted to Monitoring Officer"],
    ["3", "Reallocate project costs", "Draft with Project Manager"],
    ["2", "Remove a partner", "Draft with Project Manager"],
    ["1", "Change project duration", "Draft with Project Manager"],
  ].forEach(([requestNum, type, pcrStatus], index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get("td:nth-child(1)").contains(requestNum);
        cy.get("td:nth-child(2)").contains(type);
        cy.get("td:nth-child(4)").contains(pcrStatus);
        cy.get("td:nth-child(6)").contains("a", "View");
        cy.get("td:nth-child(6)").should("not.have.text", "Edit");
      });
  });
};

export const checkEachPcrForMessaging = () => {
  [
    ["6", "Put project on hold"],
    ["5", "Approve a new subcontractor"],
    ["4", "Change project scope"],
    ["3", "Reallocate project costs"],
    ["2", "Remove a partner"],
    ["1", "Change project duration"],
  ].forEach(([requestNumber, pcrStatus], index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get("td:nth-child(1)").contains(requestNumber);
        cy.get("td:nth-child(6)").contains("a", "View").click();
      });
    cy.heading("Request");
    onHoldMessage();
    suspensionNotificationShouldNotExist();
    cy.getListItemFromKey("Request number", requestNumber);
    cy.getListItemFromKey("Types", pcrStatus);
    cy.clickOn("Back to project change requests");
    cy.heading("Project change requests");
  });
};

export const checkClaimsTileforMessaging = () => {
  cy.selectTile("Claims");
  cy.heading("Claims");
  onHoldMessage();
  cy.get("td").contains("Draft").siblings().contains("View");
};

export const moSuspensionNotification = () => {
  cy.getByAriaLabel("alert message").within(() => {
    [
      "Please note this project is currently under suspension",
      "Some project participants will not be able to submit any claims or project change requests. Please email ",
      " for further information.",
    ].forEach(paragraph => {
      cy.paragraph(paragraph);
    });
    cy.get("a").contains("askoperations@iuk.ukri.org");
  });
};

export const suspensionNotificationShouldNotExist = () => {
  cy.getByAriaLabel("alert message").should("not.exist");
};

export const moAccessClaimCheckforMessaging = (fn: () => void) => {
  cy.selectTile("Claims");
  cy.heading("Claims");
  fn();
  cy.get("tr")
    .eq(2)
    .within(() => {
      cy.get("a").contains("View").click();
    });
  cy.heading("Claim");
  fn();
  cy.clickOn("Back to claims");
  cy.heading("Claims");
  cy.clickOn("Back to project");
  cy.heading("Project overview");
};

export const moAccessForecastsCheckforMessaging = (fn: () => void) => {
  cy.selectTile("Forecasts");
  cy.heading("Forecasts");
  cy.tableCell("Swindon University (Lead)").siblings().contains("a", "View forecast").click();
  cy.heading("Forecast");
  fn();
  cy.clickOn("Back to forecasts");
  cy.heading("Forecasts");
  cy.clickOn("Back to project");
  cy.heading("Project overview");
};

export const moAccessPcrCheckReview = <T>(fn: () => void) => {
  cy.selectTile("Project change requests");
  cy.heading("Project change requests");
  fn();
  cy.tableCell("Submitted to Monitoring Officer").siblings().contains("a", "Review").click();
  cy.heading("Request");
  fn();
  [
    "Give us information",
    "Explain why you want to make the changes",
    "Status and comments log",
    "How do you want to proceed?",
  ].forEach(sectionHeading => {
    cy.get("h2").contains(sectionHeading);
  });
  ["Change project scope", "Complete"].forEach(pcrItem => {
    cy.getByQA("WhatDoYouWantToDo").within(() => {
      cy.get("li").contains(pcrItem);
    });
    ["Reasoning for Innovate UK", "Complete"].forEach(reasoning => {
      cy.getByQA("reasoning").within(() => {
        cy.get("li").contains(reasoning);
      });
    });
    ["Query the request", "Send for approval"].forEach(label => {
      cy.getByLabel(label);
    });
    cy.get("label").contains("Add your comments");
    cy.get("textarea");
    cy.paragraph("You have 1000 characters remaining");
  });
  cy.button("Submit");
  cy.get("a").contains("Change project scope").click();
  cy.heading("Change project scope");
  fn();
  cy.clickOn("Back to request");
  cy.heading("Request");
  fn();
  cy.clickOn("Back to project change requests");
  cy.heading("Project change requests");
  cy.clickOn("Back to project");
  cy.heading("Project overview");
};

export const accessTileCheckforSuspension = (tile: Tile, fn: () => void) => {
  cy.selectTile(tile);
  cy.heading(tile);
  fn();
  cy.get("a").contains("Back to project").click();
  cy.heading("Project overview");
};

export const moAccessDocumentsCheckforMessaging = (fn: () => void) => {
  cy.selectTile("Documents");
  cy.heading("Project documents");
  fn();
  cy.get("a").contains("Back to project").click();
  cy.heading("Project overview");
};
