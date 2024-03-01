import { uploadIAR } from "e2e/2-claims/steps";

let date = new Date().toUTCString();
let comments = date;

export const moClaimTidyUp = (partnerName: string, claimType: string) => {
  cy.contains("td", partnerName)
    .siblings()
    .then($tr => {
      if ($tr.text().includes(claimType)) {
        cy.log(`Change claim status of ${claimType} claim`);
        cy.switchUserTo("iuk.accproject@bjss.com.bjssdev");
        cy.get("td").contains(partnerName).siblings().clickOn("a", "Edit");
        cy.clickOn("Continue to claims documents");
        cy.heading("Claim documents");
        uploadIAR;
        cy.clickOn("Continue to update forecast");
        cy.clickOn("Continue to summary");
        cy.clickOn("Submit claim");
        cy.heading("Claims");
        cy.switchUserTo("testman2@testing.com");
      } else {
        cy.switchUserTo("testman2@testing.com");
      }
    });
};

export const fcClaimTidyUp = async (partnerName: string, claimType: string) => {
  cy.contains("td", partnerName)
    .siblings()
    .then($tr => {
      if ($tr.text().includes(claimType)) {
        cy.log(`Change claim status of ${claimType} claim`);
        cy.switchUserTo("testman2@testing.com");
        cy.get("td").contains(partnerName).siblings().clickOn("a", "Review");
        cy.getByLabel("Query claim").click();
        cy.get("textarea").as("txt").wait(200);
        cy.get("@txt").clear();
        cy.get("@txt").type(comments);
        cy.paragraph("You have");
        cy.paragraph("I am satisfied that the costs claimed appear to comply");
        cy.clickOn("Send query");
        cy.heading("Claims");
        cy.clickOn("Back to project");
        cy.heading("Project overview");
      } else {
        cy.heading("Claims");
        cy.clickOn("Back to project");
        cy.heading("Project overview");
      }
    });
};
