import { When } from "@badeball/cypress-cucumber-preprocessor";
import { accProjectContactLinkBuilder, buildApex, competitionBuilder, contactBuilder } from "salesforce-factory";
import { defaultAccProjectParticipant } from "salesforce-factory/dist/factory/ifspa/Acc_ProjectParticipant__c";
import { defaultAccProject } from "salesforce-factory/dist/factory/ifspa/Acc_Project__c";
import { defaultAccount } from "salesforce-factory/dist/factory/ifspa/Account";
import { defaultUser } from "salesforce-factory/dist/factory/ifspa/User";

When("Cypress tries to run Apex", function () {
  cy.accTask("runApex", { apex: "System.debug('Hello World');" });
});

When("Cypress tries to create a project", function () {
  const competition = competitionBuilder
    .new()
    .setField("Acc_CompetitionCode__c", "100")
    .setField("Acc_CompetitionName__c", "Competition")
    .setField("Acc_CompetitionType__c", "CR&D");

  const project = defaultAccProject.copy().setRelationship("Acc_CompetitionId__c", competition);
  const mspAccount = defaultAccount
    .copy()
    .setField("OrgMigrationId__c", "0")
    .setField("Name", "Hedge's Monitoring Ltd.");
  const pmFcAccount = defaultAccount
    .copy()
    .setField("OrgMigrationId__c", "1")
    .setField("Name", "Hedge's Consulting Ltd.");

  const contacts = [
    ["0", mspAccount, "mo@x.gov.uk", "Matt", "Otrebski", "mo", "Monitoring officer"],
    ["1", pmFcAccount, "pm@x.gov.uk", "Peter", "May", "pm", "Project Manager"],
    ["2", pmFcAccount, "fc@x.gov.uk", "Ferris", "Colton", "fc", "Finance contact"],
  ] as const;

  const contactUserPclArray = contacts.flatMap(([id, account, email, firstName, lastName, alias, role]) => {
    const contact = contactBuilder
      .new()
      .setRelationship("AccountId", account)
      .setField("ContactMigrationId__c", id)
      .setField("Email", email)
      .setField("FirstName", firstName)
      .setField("LastName", lastName);

    const user = defaultUser
      .copy()
      .setRelationship("ContactId", contact)
      .setField("Username", email)
      .setField("Email", email)
      .setField("FirstName", firstName)
      .setField("LastName", lastName)
      .setField("Alias", alias)
      .setField("CommunityNickname", alias);

    const pcl = accProjectContactLinkBuilder
      .new()
      .setRelationship("Acc_AccountId__c", account)
      .setRelationship("Acc_ContactId__c", contact)
      .setRelationship("Acc_ProjectId__c", project)
      .setField("Acc_EmailOfSFContact__c", email)
      .setField("Acc_Role__c", role);

    return [contact, user, pcl];
  });

  const projectParticipant = defaultAccProjectParticipant
    .copy()
    .setRelationship("Acc_AccountId__c", pmFcAccount)
    .setRelationship("Acc_ProjectId__c", project);

  const prefix = Math.floor(Date.now() / 1000).toString() + ".";

  const apex = buildApex({
    instances: [competition, ...contactUserPclArray, project, mspAccount, pmFcAccount, projectParticipant],
    options: {
      prefix,
    },
  });

  cy.log(apex);
  cy.accTask("runApex", { apex });
});
