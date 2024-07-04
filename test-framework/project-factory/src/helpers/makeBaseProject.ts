import { accProfileDetailBuilder } from "../factory/ifspa/Acc_Profile__c.Profile_Detail";
import { accProfileTotalCostCategoryBuilder } from "../factory/ifspa/Acc_Profile__c.Total_Cost_Category";
import { accPcrRemovePartnerBuilder } from "../factory/ifspa/Acc_ProjectChangeRequest__c.RemovePartner";
import { accPcrHeaderBuilder } from "../factory/ifspa/Acc_ProjectChangeRequest__c.RequestHeader";
import { accProjectContactLinkBuilder } from "../factory/ifspa/Acc_ProjectContactLink__c";
import { accProjectParticipantBuilder, defaultAccProjectParticipant } from "../factory/ifspa/Acc_ProjectParticipant__c";
import { accProjectBuilder, defaultAccProject } from "../factory/ifspa/Acc_Project__c";
import { accountBuilder, defaultAccount } from "../factory/ifspa/Account";
import { competitionBuilder } from "../factory/ifspa/Competition__c";
import { contactBuilder } from "../factory/ifspa/Contact";
import { projectFactoryProfilesHelperBuilder } from "../factory/ifspa/ProjectFactory.ProfilesHelper";
import { userBuilder, defaultUser } from "../factory/ifspa/User";
import { ProjectFactoryInstanceType } from "../types/ProjectFactoryDefinition";

interface CreateProjectProps {
  project: ProjectFactoryInstanceType<typeof accProjectBuilder>;
  logins: {
    pcl: ProjectFactoryInstanceType<typeof accProjectContactLinkBuilder>;
    user: ProjectFactoryInstanceType<typeof userBuilder>;
    contact: ProjectFactoryInstanceType<typeof contactBuilder>;
    account: ProjectFactoryInstanceType<typeof accountBuilder>;
  }[];
  pcrs: {
    headers: ProjectFactoryInstanceType<typeof accPcrHeaderBuilder>[];
    removePartner: ProjectFactoryInstanceType<typeof accPcrRemovePartnerBuilder>[];
  };
  competition: ProjectFactoryInstanceType<typeof competitionBuilder>;
  projectParticipant: ProjectFactoryInstanceType<typeof accProjectParticipantBuilder>;
  profiles: {
    projectFactoryHelper: ProjectFactoryInstanceType<typeof projectFactoryProfilesHelperBuilder>;
    details: ProjectFactoryInstanceType<typeof accProfileDetailBuilder>[];
    totalCostCategories: ProjectFactoryInstanceType<typeof accProfileTotalCostCategoryBuilder>[];
  };
}

const makeBaseProject = (): CreateProjectProps => {
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

  const projectParticipant = defaultAccProjectParticipant.copy().set({
    Acc_AccountId__c: pmFcAccount,
    Acc_ProjectId__c: project,
    Acc_CreateProfiles__c: false,
    Acc_CreateClaims__c: true,
  });

  const helper = projectFactoryProfilesHelperBuilder.create().set({
    ProjectFactory_ProjectParticipant: projectParticipant,
    ProjectFactory_Competition: competition,
    ProjectFactory_NumberOfPeriods: 12,
  });

  const profileDetails = [
    accProfileDetailBuilder.create().set({
      ProjectFactory_ProfileHelper: helper,
      Acc_CostCategoryDescription__c: "Labour",
      Acc_ProjectPeriodNumber__c: 1,
      Acc_InitialForecastCost__c: 100.46,
      Acc_LatestForecastCost__c: 95.53,
    }),
  ];

  const totalCostCategories = [
    accProfileTotalCostCategoryBuilder.create().set({
      ProjectFactory_ProfileHelper: helper,
      Acc_CostCategoryDescription__c: "Labour",
      Acc_CostCategoryGOLCost__c: 50_000,
    }),
  ];

  return {
    competition,
    project,
    logins: [
      { pcl: mspPcl, user: mspUser, contact: mspContact, account: mspAccount },
      { pcl: pmPcl, user: pmUser, contact: pmContact, account: pmFcAccount },
      { pcl: fcPcl, user: fcUser, contact: fcContact, account: pmFcAccount },
    ],
    pcrs: {
      headers: [],
      removePartner: [],
    },
    projectParticipant,
    profiles: {
      projectFactoryHelper: helper,
      details: profileDetails,
      totalCostCategories: totalCostCategories,
    },
  };
};

export { CreateProjectProps, makeBaseProject };
