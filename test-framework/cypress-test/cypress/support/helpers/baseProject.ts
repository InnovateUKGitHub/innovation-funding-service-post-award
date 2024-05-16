import { competitionBuilder, contactBuilder, accProjectContactLinkBuilder } from "project-factory";
import { defaultAccProjectParticipant } from "project-factory/dist/factory/ifspa/Acc_ProjectParticipant__c";
import { defaultAccProject } from "project-factory/dist/factory/ifspa/Acc_Project__c";
import { defaultAccount } from "project-factory/dist/factory/ifspa/Account";
import { defaultUser } from "project-factory/dist/factory/ifspa/User";

const makeBaseProject = () => {
  const competition = competitionBuilder
    .create()
    .set({ Acc_CompetitionCode__c: "0", Acc_CompetitionName__c: "Competition", Acc_CompetitionType__c: "CR&D" });

  const project = defaultAccProject.copy().set({ Acc_CompetitionId__c: competition });
  const mspAccount = defaultAccount.copy().set({ OrgMigrationId__c: "0", Name: "Hedge's Monitoring Ltd." });
  const pmFcAccount = defaultAccount.copy().set({ OrgMigrationId__c: "1", Name: "Hedge's Consulting Ltd." });

  const [[mspContact, mspUser, mspPcl], [pmContact, pmUser, pmPcl], [fcContact, fcUser, fcPcl]] = (<const>[
    ["0", mspAccount, "mo@x.gov.uk", "Matt", "Otrebski", "mo", "Monitoring officer"],
    ["1", pmFcAccount, "pm@x.gov.uk", "Peter", "May", "pm", "Project Manager"],
    ["2", pmFcAccount, "fc@x.gov.uk", "Ferris", "Colton", "fc", "Finance contact"],
  ]).map(([ContactMigrationId__c, account, Email, FirstName, LastName, Alias, Acc_Role__c]) => {
    const contact = contactBuilder
      .create()
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

    const pcl = accProjectContactLinkBuilder.create().set({
      Acc_AccountId__c: account,
      Acc_ContactId__c: contact,
      Acc_ProjectId__c: project,
      Acc_EmailOfSFContact__c: Email,
      Acc_Role__c: Acc_Role__c,
    });

    return [contact, user, pcl];
  });

  const projectParticipant = defaultAccProjectParticipant
    .copy()
    .set({ Acc_AccountId__c: pmFcAccount, Acc_ProjectId__c: project });

  return {
    competition,
    project,
    mspAccount,
    pmFcAccount,
    mspContact,
    mspUser,
    mspPcl,
    pmContact,
    pmUser,
    pmPcl,
    fcContact,
    fcUser,
    fcPcl,
    projectParticipant,
  };
};

export { makeBaseProject };
