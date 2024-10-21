import { accProjectContactLinkBuilder } from "../factory/ifspa/Acc_ProjectContactLink__c";
import { defaultAccProjectParticipant } from "../factory/ifspa/Acc_ProjectParticipant__c";
import { defaultAccProject } from "../factory/ifspa/Acc_Project__c";
import { defaultAccount } from "../factory/ifspa/Account";
import { competitionBuilder } from "../factory/ifspa/Competition__c";
import { contactBuilder } from "../factory/ifspa/Contact";
import { projectFactoryProfilesHelperBuilder } from "../factory/ifspa/ProjectFactory.ProfilesHelper";
import { defaultUser } from "../factory/ifspa/User";
import { CreateProjectProps } from "./makeBaseProject";

const makeMultiPartnerProject = (): CreateProjectProps => {
  const competition = competitionBuilder
    .create()
    .set({ Acc_CompetitionCode__c: "0", Acc_CompetitionName__c: "Competition", Acc_CompetitionType__c: "CR&D" });

  const project = defaultAccProject.copy().set({ Acc_CompetitionId__c: competition });
  const mspAccount = defaultAccount.copy().set({ OrgMigrationId__c: "0", Name: "Hedge's Monitoring Ltd." });
  const pmFcAccount = defaultAccount.copy().set({ OrgMigrationId__c: "1", Name: "Hedge's Consulting Ltd." });
  const fcAccount = defaultAccount.copy().set({ OrgMigrationId__c: "2", Name: "Hedge's Finance Ltd." });

  const [
    [mspContact, mspUser, mspPcl],
    [pmContact, pmUser, pmPcl],
    [fcContact, fcUser, fcPcl],
    [fc2Contact, fc2User, fc2Pcl],
  ] = (<const>[
    ["0", mspAccount, "mo@x.gov.uk", "Matt", "Otrebski", "mo", "Monitoring officer"],
    ["1", pmFcAccount, "pm@x.gov.uk", "Peter", "May", "pm", "Project Manager"],
    ["2", pmFcAccount, "fc@x.gov.uk", "Ferris", "Colton", "fc", "Finance contact"],
    ["3", fcAccount, "fc2@x.gov.uk", "Frances", "Clapp", "fc2", "Finance contact"],
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

  const projectParticipant = defaultAccProjectParticipant.copy().set({
    Acc_AccountId__c: pmFcAccount,
    Acc_ProjectId__c: project,
    Acc_CreateProfiles__c: false,
    Acc_CreateClaims__c: true,
  });

  const projectParticipantSecondary = defaultAccProjectParticipant.copy().set({
    Acc_AccountId__c: fcAccount,
    Acc_ProjectId__c: project,
    Acc_CreateProfiles__c: false,
    Acc_CreateClaims__c: true,
  });

  const helper = projectFactoryProfilesHelperBuilder.create().set({
    ProjectFactory_ProjectParticipant: projectParticipant,
    ProjectFactory_Competition: competition,
    ProjectFactory_NumberOfPeriods: 12,
  });

  const helperMulti = projectFactoryProfilesHelperBuilder.create().set({
    ProjectFactory_ProjectParticipant: projectParticipantSecondary,
    ProjectFactory_Competition: competition,
    ProjectFactory_NumberOfPeriods: 12,
  });

  return {
    competition,
    project,
    logins: [
      { pcl: mspPcl, user: mspUser, contact: mspContact, account: mspAccount },
      { pcl: pmPcl, user: pmUser, contact: pmContact, account: pmFcAccount },
      { pcl: fcPcl, user: fcUser, contact: fcContact, account: pmFcAccount },
      { pcl: fc2Pcl, user: fc2User, contact: fc2Contact, account: fcAccount },
    ],
    pcrs: {
      headers: [],
      removePartner: [],
    },
    projectParticipants: [projectParticipant, projectParticipantSecondary],
    profiles: {
      projectFactoryHelpers: [helper, helperMulti],
      details: [],
      totalCostCategories: [],
    },
  };
};

export { makeMultiPartnerProject };
