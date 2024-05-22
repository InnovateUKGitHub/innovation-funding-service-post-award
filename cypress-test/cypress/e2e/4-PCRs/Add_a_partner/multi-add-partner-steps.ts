import { PcrItemType, addPartnerDocUpload } from "../steps";

export const addAnotherAddPartner = () => {
  cy.get("a").contains("Add types").click();
  cy.heading("Add types");
  cy.clickCheckBox(PcrItemType.AddAPartner);
  cy.intercept("PUT", `/api/pcrs/**`).as("addRequest");
  cy.clickOn("Add to request");
  cy.wait("@addRequest");
  cy.get("h1").contains("Request");
};

export const displayTwoAddPartnerPCRs = () => {
  cy.getByQA("WhatDoYouWantToDo").within(() => {
    cy.get("ul").within(() => {
      cy.get("li").eq(0).contains("a", "Add a partner");
      cy.get("li").eq(1).contains("a", "Add a partner");
    });
  });
};

export const completeCompaniesHouse = (pcrNumber: number) => {
  if (pcrNumber == 0) {
    cy.get("#search").clear().type("A").wait(500);
    cy.get("h2").contains("Companies house search results");
    cy.getByLabel("A LIMITED").click();
    cy.get(`input[id="organisationName"], [value="A LIMITED"]`);
    cy.get(`input[id="registrationNumber"], [value="11790215"]`);
    cy.get(`input[id="registeredAddress"], [value="Springfield Road"]`);
    cy.clickOn("Save and continue");
  } else if (pcrNumber == 1) {
    cy.get("#search").clear().type("B").wait(500);
    cy.get("h2").contains("Companies house search results");
    cy.getByLabel("B LTD.").click();
    cy.get(`input[id="organisationName"], [value="B LTD."]`);
    cy.get(`input[id="registrationNumber"], [value="SC170717"]`);
    cy.get(`input[id="registeredAddress"], [value="7 Craigfoot Walk, Kirkcaldy, Fife, KY1 1GA"]`);
    cy.clickOn("Save and continue");
  }
};

export const completeFinanceContact = (pcrNumber: number) => {
  if (pcrNumber == 0) {
    [
      ["First name", "Joseph"],
      ["Last name", "Dredd"],
      ["Phone number", "01234567891"],
      ["Email", "j.dredd@mc1.law"],
    ].forEach(([input, info]) => {
      cy.getByLabel(input).clear().type(info);
    });
  } else if (pcrNumber == 1) {
    [
      ["First name", "Cassandra"],
      ["Last name", "Anderson"],
      ["Phone number", "01234567892"],
      ["Email", "c.anderson@mc1.law"],
    ].forEach(([input, info]) => {
      cy.getByLabel(input).clear().type(info);
    });
  }
  cy.clickOn("Save and return to summary");
};

export const navToAddPartnerPcrSpendProf = (listNumber: number) => {
  cy.getByQA("WhatDoYouWantToDo").within(() => {
    cy.get("ul").within(() => {
      cy.get("li").eq(listNumber).contains("a", "Add a partner").click();
    });
  });
  cy.heading("Add a partner");
  ["Collaborator", "Yes", "Business"].forEach(radio => {
    cy.getByLabel(radio).click();
  });
  cy.clickOn("Save and continue");
  cy.get("h2").contains("State aid eligibility");
  cy.clickOn("Save and continue");
  cy.get("h2").contains("Company house");
  completeCompaniesHouse(listNumber);
  cy.get("h2").contains("Organisation details");
  cy.getByLabel("Medium").click();
  cy.getByAriaLabel("number of full-time employees").type("100");
  cy.clickOn("Save and continue");
  cy.get("h2").contains("Financial details");
  cy.getByLabel("Month").type("03");
  cy.getByLabel("Year").type("2024");
  cy.get("#financialYearEndTurnover").type("100000");
  cy.clickOn("Save and continue");
  cy.get("h2").contains("Project location");
  cy.getByLabel("Inside the United Kingdom").click();
  cy.getByLabel("Name of town or city").clear().type("Swindon");
  cy.getByLabel("Postcode").clear().type("SN1 1LT");
  cy.clickOn("Save and continue");
  cy.get("h2").contains("Add person to organisation");
  completeFinanceContact(listNumber);
  cy.getListItemFromKey("Project costs for new partner", "Edit").click();
  cy.get("h2").contains("Project costs for new partner");
};

export const saveAndReturnToSummary = () => {
  cy.clickOn("Save and return to summary");
  cy.get("h2").contains("Organisation");
};

export const completePCR = (pcrNumber: number) => {
  cy.clickOn("Save and continue");
  cy.get("h2").contains("Other public sector funding?");
  cy.clickOn("Save and continue");
  cy.get("h2").contains("Funding level");
  cy.get("#awardRate").type("100");
  cy.clickOn("Save and continue");
  cy.get("legend").contains("Upload partner agreement");
  addPartnerDocUpload();
  cy.clickOn("Save and continue");
  cy.get("h2").contains("Organisation");
  cy.getByLabel("I agree with this change.").click();
  cy.clickOn("Save and return to request");
  cy.heading("Request");
  cy.getByQA("WhatDoYouWantToDo").within(() => {
    cy.get("ul").within(() => {
      cy.get("li").eq(pcrNumber).contains("Complete");
    });
  });
};
