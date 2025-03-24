import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { DatabaseConnector } from "../database/DatabaseConnector";
import { awaitResults } from "../helpers/awaitResults";
import { batch } from "../helpers/batch";
import { getRecordType } from "../helpers/getRecordType";
import { makeClaims } from "../helpers/makeClaims";
import { Acc_Project__c } from "../sobjects/Acc_Project__c";
import { Acc_ProjectContactLink__c } from "../sobjects/Acc_ProjectContactLink__c";
import { Acc_ProjectParticipant__c } from "../sobjects/Acc_ProjectParticipant__c";
import { Account } from "../sobjects/Account";
import { Competition__c } from "../sobjects/Competition__c";
import { Contact } from "../sobjects/Contact";
import { User } from "../sobjects/User";
import { AbstractProjectFactoryScript } from "./AbstractProjectFactoryScript";
import { overwriteProfiles } from "../helpers/overwriteProfiles";
import { Acc_Prepayment__c } from "../sobjects/Acc_Prepayment__c";

interface TwoParticipantProjectSetupScriptArguments {
  competitionType: "CR&D" | "SBRI";
  profiles: boolean;
  projectSource: "Manual" | "IFS";
}

type TwoParticipantProjectSetupScriptContext = {
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
  mspUser: User;
  pmUser: User;
  mainFcUser: User;
  secondaryFcUser: User;
  mspPcl: Acc_ProjectContactLink__c;
  pmPcl: Acc_ProjectContactLink__c;
  mainFcPcl: Acc_ProjectContactLink__c;
  secondaryFcPcl: Acc_ProjectContactLink__c;
  grantAdjustment: Acc_Prepayment__c;
};

class TwoParticipantProjectSetupScript extends AbstractProjectFactoryScript<
  TwoParticipantProjectSetupScriptContext,
  TwoParticipantProjectSetupScriptArguments
> {
  async script({
    connection,
    Database,
    args,
  }: {
    connection: ITsforceConnection;
    Database: DatabaseConnector;
    args: TwoParticipantProjectSetupScriptArguments;
  }): Promise<TwoParticipantProjectSetupScriptContext> {
    const date = new Date();
    const now = Math.floor(date.getTime() / 1000);
    const prefix = (val: string) => `${now}.${val}`;

    const [recordTypes, triggers] = await Promise.all([
      Database.query(`SELECT Id, SObjectType, DeveloperName FROM RecordType`),
      Database.query(`SELECT Id, DeveloperName, IsDisabled__c FROM Trigger__mdt`),
    ]);
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
    competition.Acc_CompetitionType__c = args.competitionType;
    competition.Impact_Management_participation__c = "No";
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
    mainProjectParticipant.Acc_ParticipantStatus__c = "Pending";
    mainProjectParticipant.Acc_Award_Rate__c = 50;
    mainProjectParticipant.Acc_Cap_Limit__c = 50;
    mainProjectParticipant.Acc_FlaggedParticipant__c = false;
    mainProjectParticipant.Acc_OverheadRate__c = 20;
    mainProjectParticipant.Acc_ParticipantProjectReportingType__c = "Public";
    mainProjectParticipant.Acc_OrganisationType__c = "Industrial";
    mainProjectParticipant.Acc_CreateProfiles__c = false;
    mainProjectParticipant.Acc_CreateClaims__c = false;
    mainProjectParticipant.Acc_WorkdaySupplierSetupComplete__c = true;

    const secondaryProjectParticipant = new Acc_ProjectParticipant__c();
    secondaryProjectParticipant.Acc_AccountId__c = secondaryAccount.Id;
    secondaryProjectParticipant.Acc_ProjectId__c = project.Id;
    secondaryProjectParticipant.ParticipantMigrationID__c = prefix("200");
    secondaryProjectParticipant.Acc_ParticipantType__c = "Research";
    secondaryProjectParticipant.Acc_ParticipantSize__c = "Medium";
    secondaryProjectParticipant.Acc_ProjectRole__c = "Collaborator";
    secondaryProjectParticipant.Acc_AuditReportFrequency__c = "With all claims";
    secondaryProjectParticipant.Acc_ParticipantStatus__c = "Pending";
    secondaryProjectParticipant.Acc_Award_Rate__c = 50;
    secondaryProjectParticipant.Acc_Cap_Limit__c = 50;
    secondaryProjectParticipant.Acc_FlaggedParticipant__c = false;
    secondaryProjectParticipant.Acc_OverheadRate__c = 20;
    secondaryProjectParticipant.Acc_ParticipantProjectReportingType__c = "Public";
    secondaryProjectParticipant.Acc_OrganisationType__c = "Academic";
    secondaryProjectParticipant.Acc_CreateProfiles__c = false;
    secondaryProjectParticipant.Acc_CreateClaims__c = false;
    secondaryProjectParticipant.Acc_WorkdaySupplierSetupComplete__c = true;

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
    secondaryFcContact.AccountId = mainAccount.Id;

    await Database.insert([mspContact, pmContact, mainFcContact, secondaryFcContact]);

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

    await Database.insert([mspUser, pmUser, mainFcUser, secondaryFcUser]);

    const mspPcl = new Acc_ProjectContactLink__c();
    mspPcl.Acc_AccountId__c = mspAccount.Id;
    mspPcl.Acc_ContactId__c = mspContact.Id;
    mspPcl.Acc_ProjectId__c = project.Id;
    mspPcl.Acc_UserId__c = mspUser.Id;
    mspPcl.Acc_EmailOfSFContact__c = mspContact.Email;
    mspPcl.Acc_Role__c = "Monitoring officer";

    const pmPcl = new Acc_ProjectContactLink__c();
    pmPcl.Acc_AccountId__c = mainAccount.Id;
    pmPcl.Acc_ContactId__c = pmContact.Id;
    pmPcl.Acc_ProjectId__c = project.Id;
    pmPcl.Acc_UserId__c = pmUser.Id;
    pmPcl.Acc_EmailOfSFContact__c = pmContact.Email;
    pmPcl.Acc_Role__c = "Project Manager";

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

    await Database.insert([mspPcl, pmPcl, mainFcPcl, secondaryFcPcl]);

    project.Acc_ClaimFrequency__c = "Quarterly";
    project.Acc_NonFEC__c = false;
    project.Acc_MonitoringLevel__c = "Platinum";
    project.Acc_MonitoringReportSchedule__c = "Monthly";
    project.Acc_ProjectStatus__c = "Offer Letter Sent";
    project.Acc_CurrentPeriodNumberHelper__c = 1;
    await Database.update(project);

    await connection.executeApex({
      query: `
        ProjectTriggerHelper.isFirstTime = true;
        new Acc_ProjectPeriodProcessor_Batch().start(null);
      `,
    });

    if (args.profiles) {
      const [mainProfiles, secondaryProfiles] = await Promise.all([
        awaitResults(() =>
          Database.query(
            `SELECT Id, RecordTypeId, Acc_CostCategoryDescription__c, Acc_CostCategory__c, Acc_ProjectPeriodNumber__c FROM Acc_Profile__c WHERE Acc_ProjectID__c = '${project.Id}' AND Acc_ProjectParticipant__c = '${mainProjectParticipant.Id}'`,
          ),
        ),
        awaitResults(() =>
          Database.query(
            `SELECT Id, RecordTypeId, Acc_CostCategoryDescription__c, Acc_CostCategory__c, Acc_ProjectPeriodNumber__c FROM Acc_Profile__c WHERE Acc_ProjectID__c = '${project.Id}' AND Acc_ProjectParticipant__c = '${secondaryProjectParticipant.Id}'`,
          ),
        ),
      ]);

      const mainProfileUpdates = overwriteProfiles({
        profiles: mainProfiles,
        profileTotalCostCategoryRecordType,
        profileProfileDetailRecordType,
        profileOverrides: [
          {
            costCategoryDescription: "Overheads",
            costCategoryGolCost: 1_560_000,
            detail: [
              { latestForecastCost: 20_000 },
              { latestForecastCost: 40_000 },
              { latestForecastCost: 60_000 },
              { latestForecastCost: 80_000 },
              { latestForecastCost: 100_000 },
              { latestForecastCost: 120_000 },
              { latestForecastCost: 140_000 },
              { latestForecastCost: 160_000 },
              { latestForecastCost: 180_000 },
              { latestForecastCost: 200_000 },
              { latestForecastCost: 220_000 },
              { latestForecastCost: 240_000 },
            ],
          },
        ],
        defaultValues: {
          costCategoryGolCost: 7_800_000,
          detail: [
            { latestForecastCost: 100_000 },
            { latestForecastCost: 200_000 },
            { latestForecastCost: 300_000 },
            { latestForecastCost: 400_000 },
            { latestForecastCost: 500_000 },
            { latestForecastCost: 600_000 },
            { latestForecastCost: 700_000 },
            { latestForecastCost: 800_000 },
            { latestForecastCost: 900_000 },
            { latestForecastCost: 1_000_000 },
            { latestForecastCost: 1_100_000 },
            { latestForecastCost: 1_200_000 },
          ],
        },
      });
      const secondaryProfileUpdates = overwriteProfiles({
        profiles: secondaryProfiles,
        profileTotalCostCategoryRecordType,
        profileProfileDetailRecordType,
        profileOverrides: [],
        defaultValues: {
          costCategoryGolCost: 1200,
          detail: { latestForecastCost: 100 },
        },
      });

      for (const updateBatch of batch([...mainProfileUpdates, ...secondaryProfileUpdates])) {
        await Database.update(updateBatch);
      }

      const claimTotalProjectPeriods = await awaitResults(() =>
        Database.query(
          `SELECT Id, RecordTypeId, Acc_ProjectPeriodNumber__c, Acc_ProjectParticipant__c FROM Acc_Claims__c WHERE Acc_ProjectID__c = '${project.Id}' AND RecordType.DeveloperName = 'Total_Project_Period'`,
        ),
      );

      const mainClaims = makeClaims({
        recordTypes,
        projectParticipant: mainProjectParticipant,
        project,
        profiles: mainProfiles,
        claimTotalProjectPeriods,
        claimOverrides: [
          {
            period: 1,
            claimStatus: "New",
            claimDetails: [],
            finalClaim: false,
          },
        ],
      });

      const secondaryClaims = makeClaims({
        recordTypes,
        projectParticipant: secondaryProjectParticipant,
        project,
        profiles: secondaryProfiles,
        claimTotalProjectPeriods,
        claimOverrides: [
          {
            period: 1,
            claimStatus: "New",
            claimDetails: [],
            finalClaim: false,
          },
        ],
      });

      await Database.upsert([...mainClaims.claimTotalProjectPeriods, ...secondaryClaims.claimTotalProjectPeriods]);
      await Database.upsert([...mainClaims.claimDetails, ...secondaryClaims.claimDetails]);
      await Database.upsert([...mainClaims.claimLineItems, ...secondaryClaims.claimLineItems]);
    }

    const grantAdjustment = new Acc_Prepayment__c();
    grantAdjustment.Acc_PeriodNumber__c = 1;
    grantAdjustment.Acc_Adjustment_Type__c = "Prepayment";
    grantAdjustment.Acc_Status__c = "New";
    grantAdjustment.Acc_ProjectParticipant__c = mainProjectParticipant.Id;
    grantAdjustment.Acc_ReasonForPrepayment__c = "'it's just optional, you know' - Olu";
    grantAdjustment.Acc_GranttobePaid__c = 10_000_000;
    await Database.insert(grantAdjustment);
    // await approveSObject(connection, grantAdjustment.Id);

    //Changes the project source to the configured arguments after the project has built
    project.Acc_ProjectSource__c = args.projectSource;
    await Database.update(project);

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
      mspUser,
      pmUser,
      mainFcUser,
      secondaryFcUser,
      mspPcl,
      pmPcl,
      mainFcPcl,
      secondaryFcPcl,
      grantAdjustment,
    };
  }
}

export {
  TwoParticipantProjectSetupScript,
  TwoParticipantProjectSetupScriptArguments,
  TwoParticipantProjectSetupScriptContext,
};
