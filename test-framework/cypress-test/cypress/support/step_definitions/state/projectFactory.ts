import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { accPcrHeaderBuilder, accPcrRemovePartnerBuilder, makeBaseProject } from "project-factory";

Given("a standard CR&D project exists", function () {
  if (this.projectCreated !== "CR&D") {
    cy.createProject(makeBaseProject());
    // Wait for users to be initialised
    cy.wait(20_000);
    this.projectCreated = "CR&D";
  }
});

Given("a CR&D project exists with PCR items exists", function () {
  if (this.projectCreated !== "CR&D+PCR") {
    const data = makeBaseProject();

    const header = accPcrHeaderBuilder.create().set({
      Acc_MarkedasComplete__c: "To Do",
      Acc_Status__c: "Draft",
      Acc_RequestNumber__c: 1,
      Acc_Project__c: data.project,
    });

    const removePartner = accPcrRemovePartnerBuilder.create().set({
      Acc_MarkedasComplete__c: "To Do",
      Acc_RemovalPeriod__c: 4,
      Acc_RequestHeader__c: header,
      Acc_Project_Participant__c: data.projectParticipant,
      Acc_Project__c: data.project,
    });

    data.pcrs.headers.push(header);
    data.pcrs.removePartner.push(removePartner);

    cy.createProject(data);
    // Wait for users to be initialised
    cy.wait(20_000);
    this.projectCreated = "CR&D+PCR";
  }
});
