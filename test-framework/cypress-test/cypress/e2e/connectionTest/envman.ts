import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { accProjectContactLinkBuilder, buildApex, competitionBuilder, contactBuilder } from "acc-factory";
import { defaultAccProjectParticipant } from "acc-factory/dist/factory/ifspa/Acc_ProjectParticipant__c";
import { defaultAccProject } from "acc-factory/dist/factory/ifspa/Acc_Project__c";
import { defaultAccount } from "acc-factory/dist/factory/ifspa/Account";
import { defaultUser } from "acc-factory/dist/factory/ifspa/User";

When("Cypress tries to create a project", function () {
  const competition = competitionBuilder
    .new()
    .set({ Acc_CompetitionCode__c: "100", Acc_CompetitionName__c: "Competition", Acc_CompetitionType__c: "CR&D" });

  const project = defaultAccProject.copy().set({ Acc_CompetitionId__c: competition });
  const mspAccount = defaultAccount.copy().set({ OrgMigrationId__c: "0", Name: "Hedge's Monitoring Ltd." });
  const pmFcAccount = defaultAccount.copy().set({ OrgMigrationId__c: "1", Name: "Hedge's Consulting Ltd." });

  const contacts = [
    ["0", mspAccount, "mo@x.gov.uk", "Matt", "Otrebski", "mo", "Monitoring officer"],
    ["1", pmFcAccount, "pm@x.gov.uk", "Peter", "May", "pm", "Project Manager"],
    ["2", pmFcAccount, "fc@x.gov.uk", "Ferris", "Colton", "fc", "Finance contact"],
  ] as const;

  const contactUserPclArray = contacts.flatMap(
    ([ContactMigrationId__c, account, Email, FirstName, LastName, Alias, Acc_Role__c]) => {
      const contact = contactBuilder
        .new()
        .set({ AccountId: account, ContactMigrationId__c, Email, FirstName, LastName });

      const user = defaultUser.copy().set({
        ContactId: contact,
        Username: Email,
        Email,
        FirstName,
        LastName,
        Alias,
        CommunityNickname: Alias,
      });

      const pcl = accProjectContactLinkBuilder.new().set({
        Acc_AccountId__c: account,
        Acc_ContactId__c: contact,
        Acc_ProjectId__c: project,
        Acc_EmailOfSFContact__c: Email,
        Acc_Role__c: Acc_Role__c,
      });

      return [contact, user, pcl];
    },
  );

  const projectParticipant = defaultAccProjectParticipant
    .copy()
    .set({ Acc_AccountId__c: pmFcAccount, Acc_ProjectId__c: project });

  const prefix = Math.floor(Date.now() / 1000).toString() + ".";

  const apex = buildApex({
    instances: [competition, ...contactUserPclArray, project, mspAccount, pmFcAccount, projectParticipant],
    options: {
      prefix,
    },
  });

  cy.log(apex);
  cy.accTask("runApex", { apex });
  cy.accTask("setCyCache", { key: "projectNumber", value: prefix + project.getField("Acc_ProjectNumber__c") });
});

Then("the user sees the project", function () {
  cy.accTask("getCyCache", { key: "projectNumber" }).then(projectNumber => {
    cy.getByQA(`project-${projectNumber}`).should("exist");
  });
});
