import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { DatabaseConnector } from "../database/DatabaseConnector";
import { awaitResults } from "../helpers/awaitResults";
import { batch } from "../helpers/batch";
import { getRecordType } from "../helpers/getRecordType";
import { ClaimPeriodInfo, makeClaims } from "../helpers/makeClaims";
import { useTriggerMdt } from "../helpers/triggerMdtToggles";
import { Acc_Project__c } from "../sobjects/Acc_Project__c";
import { Acc_ProjectContactLink__c } from "../sobjects/Acc_ProjectContactLink__c";
import { Acc_ProjectParticipant__c } from "../sobjects/Acc_ProjectParticipant__c";
import { Account } from "../sobjects/Account";
import { Competition__c } from "../sobjects/Competition__c";
import { Contact } from "../sobjects/Contact";
import { User } from "../sobjects/User";
import { AbstractProjectFactoryScript } from "./AbstractProjectFactoryScript";
import { overwriteProfiles } from "../helpers/overwriteProfiles";
import { Acc_Claims__c } from "../sobjects/Acc_Claims__c";

interface BaseCrndProjectScriptArguments {}

type BaseCrndProjectScriptContext = {
  competition: Competition__c;
  project: Acc_Project__c;
  mspAccount: Account;
  mainAccount: Account;
  mainProjectParticipant: Acc_ProjectParticipant__c;
  mspContact: Contact;
  pmContact: Contact;
  mainFcContact: Contact;
  mspUser: User;
  pmUser: User;
  mainFcUser: User;
  mspPcl: Acc_ProjectContactLink__c;
  pmPcl: Acc_ProjectContactLink__c;
  mainFcPcl: Acc_ProjectContactLink__c;
  claimPeriod1: Acc_Claims__c;
  claimPeriod2: Acc_Claims__c;
  claimPeriod3: Acc_Claims__c;
  claimPeriod4: Acc_Claims__c;
  claimPeriod5: Acc_Claims__c;
  claimPeriod6: Acc_Claims__c;
  claimPeriod7: Acc_Claims__c;
  claimPeriod8: Acc_Claims__c;
  claimPeriod9: Acc_Claims__c;
  claimPeriod10: Acc_Claims__c;
  claimPeriod11: Acc_Claims__c;
  claimPeriod12: Acc_Claims__c;
};

class BaseCrndProjectFactoryScript extends AbstractProjectFactoryScript<
  BaseCrndProjectScriptContext,
  BaseCrndProjectScriptArguments
> {
  async script({
    connection,
    Database,
  }: {
    connection: ITsforceConnection;
    Database: DatabaseConnector;
  }): Promise<BaseCrndProjectScriptContext> {
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
    competition.Acc_CompetitionType__c = "CR&D";
    competition.Impact_Management_participation__c = "No";
    competition.SBRI_Contracting_Authority__c = null;
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

    await Database.insert([mspAccount, mainAccount]);

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
    mainProjectParticipant.Acc_WorkdaySupplierSetupComplete__c = true;

    // Disable Trigger__mdt so we can insert profiles/claims with impunity
    disableClaimTrigger();
    await Database.update(triggers);

    await Database.insert([mainProjectParticipant]);

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

    await Database.insert([mspContact, pmContact, mainFcContact]);

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

    await Database.insert([mspUser, pmUser, mainFcUser]);

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

    await Database.insert([mspPcl, pmPcl, mainFcPcl]);

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

    const profiles = await awaitResults(() =>
      Database.query(
        `SELECT Id, RecordTypeId, Acc_CostCategoryDescription__c, Acc_CostCategory__c FROM Acc_Profile__c WHERE Acc_ProjectID__c = '${project.Id}'`,
      ),
    );

    const profileUpdates = overwriteProfiles({
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

    for (const updateBatch of batch(profileUpdates)) {
      await Database.update(updateBatch);
    }

    const claimTotalProjectPeriods = await awaitResults(() =>
      Database.query(
        `SELECT Id, RecordTypeId, Acc_ProjectPeriodNumber__c, Acc_ProjectParticipant__c FROM Acc_Claims__c WHERE Acc_ProjectID__c = '${project.Id}' AND RecordType.DeveloperName = 'Total_Project_Period'`,
      ),
    );

    const claimOverrides: ClaimPeriodInfo[] = [];

    for (let i = 1; i <= project.Acc_Duration__c / 3; i++) {
      claimOverrides.push({
        period: i,
        finalClaim: false,
        claimStatus: i === 1 ? "Draft" : "New",
        claimDetails: [
          {
            costCategory: "Subcontracting",
            claimLineItems: [
              {
                name: "Licenced Cypress Engineer",
                value: parseFloat(`99.${String(i).padStart(2, "0")}`),
              },
            ],
          },
        ],
      });
    }

    const mainClaimsAndProfiles = makeClaims({
      recordTypes,
      projectParticipant: mainProjectParticipant,
      project,
      profiles,
      claimTotalProjectPeriods,
      claimOverrides,
    });

    await Database.upsert(mainClaimsAndProfiles.claimTotalProjectPeriods);
    await Database.upsert(mainClaimsAndProfiles.claimDetails);
    await Database.upsert(mainClaimsAndProfiles.claimLineItems);

    return {
      competition,
      project,
      mspAccount,
      mainAccount,
      mainProjectParticipant,
      mspContact,
      pmContact,
      mainFcContact,
      mspUser,
      pmUser,
      mainFcUser,
      mspPcl,
      pmPcl,
      mainFcPcl,
      claimPeriod1: mainClaimsAndProfiles.claimTotalProjectPeriods[0],
      claimPeriod2: mainClaimsAndProfiles.claimTotalProjectPeriods[1],
      claimPeriod3: mainClaimsAndProfiles.claimTotalProjectPeriods[2],
      claimPeriod4: mainClaimsAndProfiles.claimTotalProjectPeriods[3],
      claimPeriod5: mainClaimsAndProfiles.claimTotalProjectPeriods[4],
      claimPeriod6: mainClaimsAndProfiles.claimTotalProjectPeriods[5],
      claimPeriod7: mainClaimsAndProfiles.claimTotalProjectPeriods[6],
      claimPeriod8: mainClaimsAndProfiles.claimTotalProjectPeriods[7],
      claimPeriod9: mainClaimsAndProfiles.claimTotalProjectPeriods[8],
      claimPeriod10: mainClaimsAndProfiles.claimTotalProjectPeriods[9],
      claimPeriod11: mainClaimsAndProfiles.claimTotalProjectPeriods[10],
      claimPeriod12: mainClaimsAndProfiles.claimTotalProjectPeriods[11],
    };
  }
}

export { BaseCrndProjectFactoryScript, BaseCrndProjectScriptArguments, BaseCrndProjectScriptContext };
