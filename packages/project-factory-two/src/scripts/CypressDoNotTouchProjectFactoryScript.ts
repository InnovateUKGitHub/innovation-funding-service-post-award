import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { DatabaseConnector } from "../database/DatabaseConnector";
import { awaitResults } from "../helpers/awaitResults";
import { batch } from "../helpers/batch";
import { getRecordType } from "../helpers/getRecordType";
import { makeClaims } from "../helpers/makeClaims";
import { overwriteProfiles } from "../helpers/overwriteProfiles";
import { useTriggerMdt } from "../helpers/triggerMdtToggles";
import { Acc_Project__c } from "../sobjects/Acc_Project__c";
import { Acc_ProjectContactLink__c } from "../sobjects/Acc_ProjectContactLink__c";
import { Acc_ProjectParticipant__c } from "../sobjects/Acc_ProjectParticipant__c";
import { Account } from "../sobjects/Account";
import { Competition__c } from "../sobjects/Competition__c";
import { Contact } from "../sobjects/Contact";
import { User } from "../sobjects/User";
import { AbstractProjectFactoryScript } from "./AbstractProjectFactoryScript";
import { deleteEverything } from "../helpers/deleteEverything";

class CypressDoNotTouchProjectFactoryScript extends AbstractProjectFactoryScript<unknown, unknown> {
  async script({
    connection,
    Database,
  }: {
    connection: ITsforceConnection;
    Database: DatabaseConnector;
  }): Promise<unknown> {
    const date = new Date();
    const now = Math.floor(date.getTime() / 1000);
    const prefix = (val: string) => `${now}.${val}`;

    const recordTypes = await Database.query(`SELECT Id, SObjectType, DeveloperName FROM RecordType`);
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
    competition.Acc_CompetitionCode__c = prefix("342463");
    competition.Acc_CompetitionName__c = "SteveTest";
    competition.Acc_CompetitionType__c = "CR&D";
    competition.Impact_Management_participation__c = "No";
    competition.SBRI_Contracting_Authority__c = null;
    await Database.insert(competition);

    const project = new Acc_Project__c();
    project.Acc_ProjectNumber__c = prefix("328407");
    project.Acc_CompetitionId__c = competition.Id;
    project.Acc_StartDate__c = new Date(2024, 2, 1, 12);
    project.Acc_Duration__c = 12;
    project.Acc_ProjectTitle__c = "1_CYPRESS_DO_NOT_USE";
    project.Acc_TSBProjectNumber__c = 328407;
    project.Acc_ProjectSource__c = "Manual";
    project.Acc_PublicDescription__c = "Hello! I am the public description for this Cypress project. \\";
    project.Acc_ProjectSummary__c = "Howdy! I am the public summary for this Cypress project. \\";
    project.Acc_WorkdayProjectSetupComplete__c = true;
    await Database.insert(project);

    const swindonAccount = new Account();
    swindonAccount.BillingStreet = "12 Freedom Square";
    swindonAccount.BillingCity = "Swindon";
    swindonAccount.BillingPostalCode = "SN1 2AB";
    swindonAccount.BillingCountry = "UK";
    swindonAccount.OrgMigrationId__c = prefix("10004");
    swindonAccount.Name = "Swindon University";
    swindonAccount.Acc_FundingStatus__c = "Fund";
    swindonAccount.JES_Organisation__c = "Yes";

    const euiAccount = new Account();
    euiAccount.BillingStreet = "57/A Queen Charlotte Road";
    euiAccount.BillingCity = "Bristol";
    euiAccount.BillingPostalCode = "BS1 1DB";
    euiAccount.BillingCountry = "UK";
    euiAccount.OrgMigrationId__c = prefix("10003");
    euiAccount.Name = "EUI Small Ent Health";
    euiAccount.Acc_FundingStatus__c = "Fund";
    euiAccount.JES_Organisation__c = "No";

    const abCadAccount = new Account();
    abCadAccount.BillingStreet = "Woodhouse Farm, Abbots Close";
    abCadAccount.BillingPostalCode = "TA19 0EF";
    abCadAccount.BillingCountry = "UK";
    abCadAccount.OrgMigrationId__c = prefix("10013");
    abCadAccount.Name = "A B Cad Services";
    abCadAccount.Acc_FundingStatus__c = "Fund";
    abCadAccount.JES_Organisation__c = "No";

    const absAccount = new Account();
    absAccount.BillingStreet = "1 Waterfall way";
    absAccount.BillingCity = "Swansee"; // This is an intentional mispeling (we think!)
    absAccount.BillingPostalCode = "SA2 1DY";
    absAccount.BillingCountry = "UK";
    absAccount.OrgMigrationId__c = prefix("10005");
    absAccount.Name = "ABS EUI Medium Enterprise";
    absAccount.Acc_FundingStatus__c = "Fund";
    absAccount.JES_Organisation__c = "No";

    await Database.insert([swindonAccount, euiAccount, abCadAccount, absAccount]);

    const euiPp = new Acc_ProjectParticipant__c();
    euiPp.Acc_AccountId__c = euiAccount.Id;
    euiPp.Acc_ProjectId__c = project.Id;
    euiPp.Acc_ParticipantType__c = "Business";
    euiPp.Acc_ProjectRole__c = "Lead";
    euiPp.Acc_AuditReportFrequency__c = "Quarterly";
    euiPp.Acc_ParticipantStatus__c = "Active";
    euiPp.Acc_Award_Rate__c = 65;
    euiPp.Acc_Cap_Limit__c = 80;
    euiPp.Acc_FlaggedParticipant__c = false;
    euiPp.Acc_OverheadRate__c = 20;
    euiPp.Acc_ParticipantProjectReportingType__c = "Public";
    euiPp.Acc_OrganisationType__c = "Industrial";
    euiPp.Acc_CreateProfiles__c = false;
    euiPp.Acc_CreateClaims__c = false;

    const abCadPp = new Acc_ProjectParticipant__c();
    abCadPp.Acc_AccountId__c = abCadAccount.Id;
    abCadPp.Acc_ProjectId__c = project.Id;
    abCadPp.Acc_ParticipantType__c = "Business";
    abCadPp.Acc_ProjectRole__c = "Collaborator";
    abCadPp.Acc_AuditReportFrequency__c = "Quarterly";
    abCadPp.Acc_ParticipantStatus__c = "Active";
    abCadPp.Acc_Award_Rate__c = 65;
    abCadPp.Acc_Cap_Limit__c = 80;
    abCadPp.Acc_FlaggedParticipant__c = false;
    abCadPp.Acc_ParticipantProjectReportingType__c = "Public";
    abCadPp.Acc_OrganisationType__c = "Industrial";
    abCadPp.Acc_CreateProfiles__c = false;
    abCadPp.Acc_CreateClaims__c = false;

    const absPp = new Acc_ProjectParticipant__c();
    absPp.Acc_AccountId__c = absAccount.Id;
    absPp.Acc_ProjectId__c = project.Id;
    absPp.Acc_ParticipantType__c = "Research";
    absPp.Acc_ProjectRole__c = "Collaborator";
    absPp.Acc_AuditReportFrequency__c =
      "With the first claim, last claim and on every anniversary of the project start date";
    absPp.Acc_ParticipantStatus__c = "Active";
    absPp.Acc_Award_Rate__c = 65;
    absPp.Acc_Cap_Limit__c = 80;
    absPp.Acc_FlaggedParticipant__c = false;
    absPp.Acc_ParticipantProjectReportingType__c = "Public";
    absPp.Acc_OrganisationType__c = "Academic";
    absPp.Acc_CreateProfiles__c = false;
    absPp.Acc_CreateClaims__c = false;

    await Database.insert([euiPp, abCadPp, absPp]);

    const jamesBlackContact = new Contact();
    jamesBlackContact.FirstName = "James";
    jamesBlackContact.LastName = "Black";
    jamesBlackContact.AccountId = euiAccount.Id;
    jamesBlackContact.Email = prefix("james.black@euimeabs.test");
    jamesBlackContact.Email__c = prefix("james.black@euimeabs.test");

    const javierBaezContact = new Contact();
    javierBaezContact.FirstName = "Javier";
    javierBaezContact.LastName = "Baez";
    javierBaezContact.AccountId = swindonAccount.Id;
    javierBaezContact.Email = prefix("testman2@testing.com");
    javierBaezContact.Email__c = prefix("testman2@testing.com");

    const kenCharlesContact = new Contact();
    kenCharlesContact.Salutation = "Mr.";
    kenCharlesContact.FirstName = "ken";
    kenCharlesContact.LastName = "Charles";
    kenCharlesContact.AccountId = abCadAccount.Id;
    kenCharlesContact.Email = prefix("contact77@test.co.uk");
    kenCharlesContact.Email__c = prefix("contact77@test.co.uk");

    const sarahShuangContact = new Contact();
    sarahShuangContact.FirstName = "Sarah";
    sarahShuangContact.LastName = "Shuang";
    sarahShuangContact.AccountId = abCadAccount.Id;
    sarahShuangContact.Email = prefix("s.shuang@irc.trde.org.uk.test");
    sarahShuangContact.Email__c = prefix("s.shuang@irc.trde.org.uk.test");

    await Database.insert([jamesBlackContact, javierBaezContact, kenCharlesContact, sarahShuangContact]);

    const jamesBlackUser = User.fromContact(jamesBlackContact);
    jamesBlackUser.boilerplate();
    jamesBlackUser.Alias = "JBlack";
    jamesBlackUser.CommunityNickname = prefix("jamesBlack");

    const javierBaezUser = User.fromContact(javierBaezContact);
    javierBaezUser.boilerplate();
    javierBaezUser.Alias = "JBaez";
    javierBaezUser.CommunityNickname = prefix("javierBaez");

    const kenCharlesUser = User.fromContact(kenCharlesContact);
    kenCharlesUser.boilerplate();
    kenCharlesUser.Alias = "kCharles";
    kenCharlesUser.CommunityNickname = prefix("kenCharles");

    const sarahShuangUser = User.fromContact(sarahShuangContact);
    sarahShuangUser.boilerplate();
    sarahShuangUser.Alias = "sShuang";
    sarahShuangUser.CommunityNickname = prefix("sarahShuang");

    await Database.insert([jamesBlackUser, javierBaezUser, kenCharlesUser, sarahShuangUser]);
    await Database.insert([
      Acc_ProjectContactLink__c.fromSobject({
        project,
        account: euiAccount,
        contact: jamesBlackContact,
        user: jamesBlackUser,
        role: "Project Manager",
      }),
      Acc_ProjectContactLink__c.fromSobject({
        project,
        account: euiAccount,
        contact: jamesBlackContact,
        user: jamesBlackUser,
        role: "Finance contact",
      }),
      Acc_ProjectContactLink__c.fromSobject({
        project,
        account: swindonAccount,
        contact: javierBaezContact,
        user: javierBaezUser,
        role: "Monitoring officer",
      }),
      Acc_ProjectContactLink__c.fromSobject({
        project,
        account: abCadAccount,
        contact: kenCharlesContact,
        user: kenCharlesUser,
        role: "Finance contact",
      }),
      Acc_ProjectContactLink__c.fromSobject({
        project,
        account: absAccount,
        contact: sarahShuangContact,
        user: sarahShuangUser,
        role: "Finance contact",
      }),
    ]);

    project.Acc_ClaimFrequency__c = "Monthly";
    project.Acc_NonFEC__c = false;
    project.Acc_MonitoringLevel__c = "Platinum";
    project.Acc_MonitoringReportSchedule__c = "Monthly";
    project.Acc_ProjectStatus__c = "Live";
    project.Acc_CurrentPeriodNumberHelper__c = 11;
    await Database.update(project);

    // await connection.executeApex({
    //   query: `
    //     ProjectTriggerHelper.isFirstTime = true;
    //     new Acc_ProjectPeriodProcessor_Batch().start(null);
    //   `,
    // });

    const [euiProfiles, abCadProfiles, absProfiles] = await Promise.all([
      awaitResults(() =>
        Database.query(
          `SELECT Id, RecordTypeId, Acc_CostCategoryDescription__c, Acc_CostCategory__c FROM Acc_Profile__c WHERE Acc_ProjectID__c = '${project.Id}' AND Acc_ProjectParticipant__c = '${euiPp.Id}'`,
        ),
      ),
      awaitResults(() =>
        Database.query(
          `SELECT Id, RecordTypeId, Acc_CostCategoryDescription__c, Acc_CostCategory__c FROM Acc_Profile__c WHERE Acc_ProjectID__c = '${project.Id}' AND Acc_ProjectParticipant__c = '${abCadPp.Id}'`,
        ),
      ),
      awaitResults(() =>
        Database.query(
          `SELECT Id, RecordTypeId, Acc_CostCategoryDescription__c, Acc_CostCategory__c FROM Acc_Profile__c WHERE Acc_ProjectID__c = '${project.Id}' AND Acc_ProjectParticipant__c = '${absPp.Id}'`,
        ),
      ),
    ]);

    for (const updateBatch of batch([
      ...overwriteProfiles({
        profiles: euiProfiles,
        profileTotalCostCategoryRecordType,
        profileProfileDetailRecordType,
        profileOverrides: [
          {
            costCategoryDescription: "Labour",
            costCategoryGolCost: 35000,
            detail: [{ latestForecastCost: 0 }, { latestForecastCost: -3333.33 }],
          },
          {
            costCategoryDescription: "Materials",
            costCategoryGolCost: 35000,
            detail: [],
          },
          {
            costCategoryDescription: "Overheads",
            costCategoryGolCost: 35000,
            detail: [{ latestForecastCost: 0 }, { latestForecastCost: -666.67 }],
          },
          {
            costCategoryDescription: "Subcontracting",
            costCategoryGolCost: 0,
            detail: [],
          },
        ],
        defaultValues: {
          costCategoryGolCost: 35000,
          detail: [{ latestForecastCost: 35000 }],
        },
      }),
      ...overwriteProfiles({
        profiles: abCadProfiles,
        profileTotalCostCategoryRecordType,
        profileProfileDetailRecordType,
        profileOverrides: [
          {
            costCategoryDescription: "Other costs 5",
            costCategoryGolCost: 0,
            detail: [],
          },
        ],
        defaultValues: {
          costCategoryGolCost: 17500,
          detail: [],
        },
      }),
      ...overwriteProfiles({
        profiles: absProfiles,
        profileTotalCostCategoryRecordType,
        profileProfileDetailRecordType,
        profileOverrides: [
          {
            costCategoryDescription: "Exceptions - Staff",
            costCategoryGolCost: 50000,
            detail: [],
          },
        ],
        defaultValues: {
          costCategoryGolCost: 0,
          detail: [],
        },
      }),
    ])) {
      await Database.update(updateBatch);
    }

    const claimTotalProjectPeriods = await awaitResults(() =>
      Database.query(
        `SELECT Id, RecordTypeId, Acc_ProjectPeriodNumber__c, Acc_ProjectParticipant__c FROM Acc_Claims__c WHERE Acc_ProjectID__c = '${project.Id}' AND RecordType.DeveloperName = 'Total_Project_Period'`,
      ),
    );

    const euiClaims = makeClaims({
      recordTypes,
      projectParticipant: euiPp,
      project,
      profiles: euiProfiles,
      claimTotalProjectPeriods,
      claimOverrides: [
        {
          period: 1,
          claimStatus: "Draft",
          claimDetails: [
            { costCategory: "Materials", claimLineItems: [{ name: "materials 1", value: 35000 }] },
            { costCategory: "Capital usage", claimLineItems: [{ name: "", value: 35000 }] },
            { costCategory: "Travel and subsistence", claimLineItems: [{ name: "", value: 35000 }] },
            { costCategory: "Other costs", claimLineItems: [{ name: "", value: 35000 }] },
            { costCategory: "Other costs 2", claimLineItems: [{ name: "", value: 35000 }] },
            { costCategory: "Other costs 3", claimLineItems: [{ name: "", value: 35000 }] },
            { costCategory: "Other costs 4", claimLineItems: [{ name: "", value: 35000 }] },
            { costCategory: "Other costs 5", claimLineItems: [{ name: "", value: 35000 }] },
          ],
          finalClaim: false,
        },
      ],
    });

    const absClaims = makeClaims({
      recordTypes,
      projectParticipant: absPp,
      project,
      profiles: absProfiles,
      claimTotalProjectPeriods,
      claimOverrides: [
        {
          period: 1,
          claimStatus: "Payment being processed",
          claimDetails: [{ costCategory: "Exceptions - Staff", claimLineItems: [{ name: "Labour1", value: 49000 }] }],
          finalClaim: false,
        },
        {
          period: 2,
          claimStatus: "Draft",
          claimDetails: [],
          finalClaim: false,
        },
      ],
    });

    const abCadClaims = makeClaims({
      recordTypes,
      projectParticipant: abCadPp,
      project,
      profiles: abCadProfiles,
      claimTotalProjectPeriods,
      claimOverrides: [
        {
          period: 1,
          claimStatus: "New", // Default for period 1 is usually Draft
          claimDetails: [],
          finalClaim: false,
        },
      ],
    });

    await Database.upsert([
      ...euiClaims.claimTotalProjectPeriods,
      ...absClaims.claimTotalProjectPeriods,
      ...abCadClaims.claimTotalProjectPeriods,
    ]);
    await Database.upsert([...euiClaims.claimDetails, ...absClaims.claimDetails, ...abCadClaims.claimDetails]);
    await Database.upsert([...euiClaims.claimLineItems, ...absClaims.claimLineItems, ...abCadClaims.claimLineItems]);

    return {};
  }
}

export { CypressDoNotTouchProjectFactoryScript };
