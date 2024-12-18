import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { DatabaseConnector } from "../database/DatabaseConnector";
import { awaitResults } from "../helpers/awaitResults";
import { batch } from "../helpers/batch";
import { getRecordType } from "../helpers/getRecordType";
import { makeClaims } from "../helpers/makeClaims";
import { useTriggerMdt } from "../helpers/triggerMdtToggles";
import { Acc_Profile__c } from "../sobjects/Acc_Profile__c";
import { Acc_Project__c } from "../sobjects/Acc_Project__c";
import { Acc_ProjectContactLink__c } from "../sobjects/Acc_ProjectContactLink__c";
import { Acc_ProjectParticipant__c } from "../sobjects/Acc_ProjectParticipant__c";
import { Account } from "../sobjects/Account";
import { Competition__c } from "../sobjects/Competition__c";
import { Contact } from "../sobjects/Contact";
import { User } from "../sobjects/User";
import { AbstractProjectFactoryScript } from "./AbstractProjectFactoryScript";
import { overwriteProfiles } from "../helpers/overwriteProfiles";

interface TwoParticipantKTPProjectFactoryScriptArguments {
  generateProfiles: boolean;
}

type TwoParticipantKTPProjectFactoryScriptContext = {
  competition: Competition__c;
  project: Acc_Project__c;
  mspAccount: Account;
  mainAccount: Account;
  secondaryAccount: Account;
  mainProjectParticipant: Acc_ProjectParticipant__c;
  secondaryProjectParticipant: Acc_ProjectParticipant__c;
  mspContact: Contact;
  pmContact: Contact;
  mainFcContact: Contact;
  secondaryFcContact: Contact;
  mccContact: Contact;
  kbAdminContact: Contact;
  mspUser: User;
  pmUser: User;
  mainFcUser: User;
  secondaryFcUser: User;
  mccUser: User;
  kbAdminUser: User;
  mspPcl: Acc_ProjectContactLink__c;
  pmPcl: Acc_ProjectContactLink__c;
  mainFcPcl: Acc_ProjectContactLink__c;
  secondaryFcPcl: Acc_ProjectContactLink__c;
  mccPcl: Acc_ProjectContactLink__c;
  kbAdminPcl: Acc_ProjectContactLink__c;
};

class TwoParticipantKTPProjectFactoryScript extends AbstractProjectFactoryScript<
  TwoParticipantKTPProjectFactoryScriptContext,
  TwoParticipantKTPProjectFactoryScriptArguments
> {
  async script({
    connection,
    Database,
    args,
  }: {
    connection: ITsforceConnection;
    Database: DatabaseConnector;
    args: TwoParticipantKTPProjectFactoryScriptArguments;
  }): Promise<TwoParticipantKTPProjectFactoryScriptContext> {
    const date = new Date();
    const now = Math.floor(date.getTime() / 1000);
    const prefix = (val: string) => `${now}.${val}`;

    const [recordTypes, triggers] = await Promise.all([
      Database.query(`SELECT Id, SObjectType, DeveloperName FROM RecordType`),
      Database.query(`SELECT Id, DeveloperName, IsDisabled__c FROM Trigger__mdt`),
    ]);
    const { disableClaimTrigger, enableClaimTrigger } = useTriggerMdt({
      triggers,
    });
    const profileTotalCostCategoryRecordType = getRecordType({
      recordTypes,
      developerName: "Total_Cost_Category",
      sobject: "Acc_Profile__c",
    });
    const profileProfileDetailRecordType = getRecordType({
      recordTypes,
      developerName: "Profile_Detail",
      sobject: "Acc_Profile__c",
    });

    const competition = new Competition__c();
    competition.Acc_CompetitionCode__c = prefix("000");
    competition.Acc_CompetitionName__c = "High-carbon inefficient motorways";
    competition.Acc_CompetitionType__c = "KTP";
    await Database.insert(competition);

    const project = new Acc_Project__c();
    project.Acc_ProjectNumber__c = prefix("100");
    project.Acc_CompetitionId__c = competition.Id;
    project.Acc_StartDate__c = new Date(date.getFullYear(), date.getMonth(), 1, 12);
    project.Acc_Duration__c = 36;
    project.Acc_ProjectTitle__c = "Project Factory 2 - Electric Boogaloo";
    project.Acc_LegacyID__c = prefix("100");
    project.Acc_ProjectSource__c = "Manual";
    project.Acc_PublicDescription__c = "This is a public description";
    project.Acc_ProjectSummary__c = "This is a project summary";
    project.Acc_WorkdayProjectSetupComplete__c = true;
    await Database.insert(project);

    const mspAccount = new Account();
    mspAccount.BillingStreet = "North Star Avenue";
    mspAccount.BillingCity = "Swindon";
    mspAccount.BillingState = "Wiltshire";
    mspAccount.BillingPostalCode = "SN2 1SZ";
    mspAccount.BillingCountry = "United Kingdom";
    mspAccount.OrgMigrationId__c = prefix("300");
    mspAccount.Name = "Hedge's Monitoring Ltd.";

    const mainAccount = new Account();
    mainAccount.BillingStreet = "North Star Avenue";
    mainAccount.BillingCity = "Swindon";
    mainAccount.BillingState = "Wiltshire";
    mainAccount.BillingPostalCode = "SN2 1SZ";
    mainAccount.BillingCountry = "United Kingdom";
    mainAccount.OrgMigrationId__c = prefix("301");
    mainAccount.Name = "Hedge's Primary Ltd.";

    const secondaryAccount = new Account();
    secondaryAccount.BillingStreet = "North Star Avenue";
    secondaryAccount.BillingCity = "Swindon";
    secondaryAccount.BillingState = "Wiltshire";
    secondaryAccount.BillingPostalCode = "SN2 1SZ";
    secondaryAccount.BillingCountry = "United Kingdom";
    secondaryAccount.OrgMigrationId__c = prefix("301");
    secondaryAccount.Name = "Hedge's Secondary Ltd.";

    await Database.insert([mspAccount, mainAccount, secondaryAccount]);

    const mainProjectParticipant = new Acc_ProjectParticipant__c();
    mainProjectParticipant.Acc_AccountId__c = mainAccount.Id;
    mainProjectParticipant.Acc_ProjectId__c = project.Id;
    mainProjectParticipant.ParticipantMigrationID__c = prefix("200");
    mainProjectParticipant.Acc_ParticipantType__c = "Business";
    mainProjectParticipant.Acc_ParticipantSize__c = "Medium";
    mainProjectParticipant.Acc_ProjectRole__c = "Lead";
    mainProjectParticipant.Acc_AuditReportFrequency__c = "With all claims";
    mainProjectParticipant.Acc_ParticipantStatus__c = "Active";
    mainProjectParticipant.Acc_Award_Rate__c = 50;
    mainProjectParticipant.Acc_Cap_Limit__c = 50;
    mainProjectParticipant.Acc_FlaggedParticipant__c = false;
    mainProjectParticipant.Acc_OverheadRate__c = 20;
    mainProjectParticipant.Acc_ParticipantProjectReportingType__c = "Public";
    mainProjectParticipant.Acc_OrganisationType__c = "Industrial";
    mainProjectParticipant.Acc_CreateProfiles__c = false;
    mainProjectParticipant.Acc_CreateClaims__c = false;

    const secondaryProjectParticipant = new Acc_ProjectParticipant__c();
    secondaryProjectParticipant.Acc_AccountId__c = secondaryAccount.Id;
    secondaryProjectParticipant.Acc_ProjectId__c = project.Id;
    secondaryProjectParticipant.ParticipantMigrationID__c = prefix("200");
    secondaryProjectParticipant.Acc_ParticipantType__c = "Knowledge base";
    secondaryProjectParticipant.Acc_ParticipantSize__c = "Medium";
    secondaryProjectParticipant.Acc_ProjectRole__c = "Collaborator";
    secondaryProjectParticipant.Acc_AuditReportFrequency__c = "With all claims";
    secondaryProjectParticipant.Acc_ParticipantStatus__c = "Active";
    secondaryProjectParticipant.Acc_Award_Rate__c = 50;
    secondaryProjectParticipant.Acc_Cap_Limit__c = 50;
    secondaryProjectParticipant.Acc_FlaggedParticipant__c = false;
    secondaryProjectParticipant.Acc_OverheadRate__c = 20;
    secondaryProjectParticipant.Acc_ParticipantProjectReportingType__c = "Public";
    secondaryProjectParticipant.Acc_OrganisationType__c = "Industrial";
    secondaryProjectParticipant.Acc_CreateProfiles__c = false;
    secondaryProjectParticipant.Acc_CreateClaims__c = false;

    // Disable Trigger__mdt so we can insert profiles/claims with impunity
    disableClaimTrigger();
    await Database.update(triggers);
    await Database.insert([mainProjectParticipant, secondaryProjectParticipant]);

    const mspContact = new Contact();
    mspContact.ContactMigrationId__c = prefix("400");
    mspContact.Email = prefix("mo@x.gov.uk");
    mspContact.FirstName = "Monitoring";
    mspContact.LastName = "Officer";
    mspContact.AccountId = mspAccount.Id;

    const pmContact = new Contact();
    pmContact.ContactMigrationId__c = prefix("401");
    pmContact.Email = prefix("pm@x.gov.uk");
    pmContact.FirstName = "Project";
    pmContact.LastName = "Manager";
    pmContact.AccountId = mainAccount.Id;

    const mainFcContact = new Contact();
    mainFcContact.ContactMigrationId__c = prefix("402");
    mainFcContact.Email = prefix("fc1@x.gov.uk");
    mainFcContact.FirstName = "Main Finance";
    mainFcContact.LastName = "Contact";
    mainFcContact.AccountId = mainAccount.Id;

    const secondaryFcContact = new Contact();
    secondaryFcContact.ContactMigrationId__c = prefix("402");
    secondaryFcContact.Email = prefix("fc2@x.gov.uk");
    secondaryFcContact.FirstName = "Secondary Finance";
    secondaryFcContact.LastName = "Contact";
    secondaryFcContact.AccountId = secondaryAccount.Id;

    const kbAdminContact = new Contact();
    kbAdminContact.ContactMigrationId__c = prefix("402");
    kbAdminContact.Email = prefix("kb@x.gov.uk");
    kbAdminContact.FirstName = "Knowledge";
    kbAdminContact.LastName = "Base";
    kbAdminContact.AccountId = mainAccount.Id;

    const mccContact = new Contact();
    mccContact.ContactMigrationId__c = prefix("402");
    mccContact.Email = prefix("mcc@x.gov.uk");
    mccContact.FirstName = "Main";
    mccContact.LastName = "Contact";
    mccContact.AccountId = mainAccount.Id;

    const associateContact = new Contact();
    associateContact.ContactMigrationId__c = prefix("402");
    associateContact.Email = prefix("associate@x.gov.uk");
    associateContact.FirstName = "Anna";
    associateContact.LastName = "Sociate";
    associateContact.AccountId = secondaryAccount.Id;

    await Database.insert([
      mspContact,
      pmContact,
      mainFcContact,
      secondaryFcContact,
      kbAdminContact,
      mccContact,
      associateContact,
    ]);

    const mspUser = User.fromContact(mspContact);
    mspUser.boilerplate();
    mspUser.Alias = "msp";
    mspUser.CommunityNickname = prefix("msp");

    const pmUser = User.fromContact(pmContact);
    pmUser.boilerplate();
    pmUser.Alias = "pm";
    pmUser.CommunityNickname = prefix("pm");

    const mainFcUser = User.fromContact(mainFcContact);
    mainFcUser.boilerplate();
    mainFcUser.Alias = "fc1";
    mainFcUser.CommunityNickname = prefix("fc1");

    const secondaryFcUser = User.fromContact(secondaryFcContact);
    secondaryFcUser.boilerplate();
    secondaryFcUser.Alias = "fc2";
    secondaryFcUser.CommunityNickname = prefix("fc2");

    const kbAdminUser = User.fromContact(kbAdminContact);
    kbAdminUser.boilerplate();
    kbAdminUser.Alias = "kb";
    kbAdminUser.CommunityNickname = prefix("kb");

    const mccUser = User.fromContact(mccContact);
    mccUser.boilerplate();
    mccUser.Alias = "mcc";
    mccUser.CommunityNickname = prefix("mcc");

    const associateUser = User.fromContact(associateContact);
    associateUser.boilerplate();
    associateUser.Alias = "ass";
    associateUser.CommunityNickname = prefix("ass");

    await Database.insert([pmUser, mspUser, mainFcUser, secondaryFcUser, kbAdminUser, mccUser, associateUser]);

    const pmPcl = new Acc_ProjectContactLink__c();
    pmPcl.Acc_AccountId__c = mainAccount.Id;
    pmPcl.Acc_ContactId__c = pmContact.Id;
    pmPcl.Acc_ProjectId__c = project.Id;
    pmPcl.Acc_UserId__c = pmUser.Id;
    pmPcl.Acc_EmailOfSFContact__c = pmContact.Email;
    pmPcl.Acc_Role__c = "Project Manager";

    const mspPcl = new Acc_ProjectContactLink__c();
    mspPcl.Acc_AccountId__c = mspAccount.Id;
    mspPcl.Acc_ContactId__c = mspContact.Id;
    mspPcl.Acc_ProjectId__c = project.Id;
    mspPcl.Acc_UserId__c = mspUser.Id;
    mspPcl.Acc_EmailOfSFContact__c = mspContact.Email;
    mspPcl.Acc_Role__c = "Monitoring officer";

    const mainFcPcl = new Acc_ProjectContactLink__c();
    mainFcPcl.Acc_AccountId__c = mainAccount.Id;
    mainFcPcl.Acc_ContactId__c = mainFcContact.Id;
    mainFcPcl.Acc_ProjectId__c = project.Id;
    mainFcPcl.Acc_UserId__c = mainFcUser.Id;
    mainFcPcl.Acc_EmailOfSFContact__c = mainFcContact.Email;
    mainFcPcl.Acc_Role__c = "Finance contact";

    const secondaryFcPcl = new Acc_ProjectContactLink__c();
    secondaryFcPcl.Acc_AccountId__c = secondaryAccount.Id;
    secondaryFcPcl.Acc_ContactId__c = secondaryFcContact.Id;
    secondaryFcPcl.Acc_ProjectId__c = project.Id;
    secondaryFcPcl.Acc_UserId__c = secondaryFcUser.Id;
    secondaryFcPcl.Acc_EmailOfSFContact__c = secondaryFcContact.Email;
    secondaryFcPcl.Acc_Role__c = "Finance contact";

    const kbAdminPcl = new Acc_ProjectContactLink__c();
    kbAdminPcl.Acc_AccountId__c = mainAccount.Id;
    kbAdminPcl.Acc_ContactId__c = kbAdminContact.Id;
    kbAdminPcl.Acc_ProjectId__c = project.Id;
    kbAdminPcl.Acc_UserId__c = kbAdminUser.Id;
    kbAdminPcl.Acc_EmailOfSFContact__c = kbAdminContact.Email;
    kbAdminPcl.Acc_Role__c = "KB Admin";

    const mccPcl = new Acc_ProjectContactLink__c();
    mccPcl.Acc_AccountId__c = mainAccount.Id;
    mccPcl.Acc_ContactId__c = mccContact.Id;
    mccPcl.Acc_ProjectId__c = project.Id;
    mccPcl.Acc_UserId__c = mccUser.Id;
    mccPcl.Acc_EmailOfSFContact__c = mccContact.Email;
    mccPcl.Acc_Role__c = "Main Company Contact";

    const assPcl = new Acc_ProjectContactLink__c();
    assPcl.Acc_AccountId__c = mainAccount.Id;
    assPcl.Acc_ContactId__c = associateContact.Id;
    assPcl.Acc_ProjectId__c = project.Id;
    assPcl.Acc_UserId__c = associateUser.Id;
    assPcl.Acc_EmailOfSFContact__c = associateContact.Email;
    assPcl.Acc_Role__c = "Associate";

    await Database.insert([pmPcl, mspPcl, mainFcPcl, secondaryFcPcl, kbAdminPcl, mccPcl, assPcl]);

    const mainClaims = makeClaims({
      recordTypes,
      projectParticipant: mainProjectParticipant,
      project,
    });

    const secondaryClaims = makeClaims({
      recordTypes,
      projectParticipant: secondaryProjectParticipant,
      project,
    });

    await Promise.all([
      Database.insert(mainClaims.claimTotalProjectPeriods),
      Database.insert(secondaryClaims.claimTotalProjectPeriods),
    ]);

    project.Acc_ClaimFrequency__c = "Quarterly";
    project.Acc_NonFEC__c = false;
    project.Acc_MonitoringLevel__c = "Platinum";
    project.Acc_MonitoringReportSchedule__c = "Monthly";
    project.Acc_ProjectStatus__c = "Live";
    project.Acc_CurrentPeriodNumberHelper__c = 1;
    await Database.update(project);

    await connection.executeApex({
      query: `
        ProjectTriggerHelper.isFirstTime = true;
        new Acc_ProjectPeriodProcessor_Batch().start(null);
      `,
    });

    // Re-enable Trigger__mdt for normal projects
    enableClaimTrigger();
    await Database.update(triggers);

    if (args.generateProfiles) {
      const profiles = await awaitResults(() =>
        Database.query(
          `SELECT Id, RecordTypeId, Acc_CostCategoryDescription__c FROM Acc_Profile__c WHERE Acc_ProjectID__c = '${project.Id}'`,
        ),
      );

      const updates = overwriteProfiles({
        profiles,
        profileTotalCostCategoryRecordType,
        profileProfileDetailRecordType,
        profileOverrides: [
          {
            costCategoryDescription: "Overheads",
            costCategoryGolCost: 240,
            detail: { latestForecastCost: 20 },
          },
        ],
        defaultValues: {
          costCategoryGolCost: 1200,
          detail: { latestForecastCost: 100 },
        },
      });

      for (const updateBatch of batch(updates)) {
        await Database.update(updateBatch);
      }
    }

    return {
      competition,
      project,
      mspAccount,
      mainAccount,
      secondaryAccount,
      mainProjectParticipant,
      secondaryProjectParticipant,
      mspContact,
      pmContact,
      mainFcContact,
      secondaryFcContact,
      mccContact,
      kbAdminContact,
      mspUser,
      pmUser,
      mainFcUser,
      secondaryFcUser,
      mccUser,
      kbAdminUser,
      mspPcl,
      pmPcl,
      mainFcPcl,
      secondaryFcPcl,
      mccPcl,
      kbAdminPcl,
    };
  }
}

export {
  TwoParticipantKTPProjectFactoryScript,
  TwoParticipantKTPProjectFactoryScriptArguments,
  TwoParticipantKTPProjectFactoryScriptContext,
};
