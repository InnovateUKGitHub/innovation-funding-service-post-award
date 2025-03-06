import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { DatabaseConnector } from "../database/DatabaseConnector";
import { AbstractProjectFactoryScript } from "./AbstractProjectFactoryScript";
import { Competition__c } from "../sobjects/Competition__c";
import { Acc_Project__c } from "../sobjects/Acc_Project__c";
import { Account } from "../sobjects/Account";
import { Acc_ProjectParticipant__c } from "../sobjects/Acc_ProjectParticipant__c";
import { Contact } from "../sobjects/Contact";
import { User } from "../sobjects/User";
import { Acc_ProjectContactLink__c } from "../sobjects/Acc_ProjectContactLink__c";
import { Acc_Prepayment__c } from "../sobjects/Acc_Prepayment__c";
import { getRecordType } from "../helpers/getRecordType";
import { useTriggerMdt } from "../helpers/triggerMdtToggles";
import { awaitResults } from "../helpers/awaitResults";
import { batch } from "../helpers/batch";
import { makeClaims } from "../helpers/makeClaims";
import { overwriteProfiles } from "../helpers/overwriteProfiles";

interface LoansProjectFactoryScriptArguments {
  competitionType: "LOANS";
  generateProfiles: boolean;
}

type LoansProjectFactoryScriptContext = {
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
  grantAdjustment: Acc_Prepayment__c;
  grantAdjustment2: Acc_Prepayment__c;
  grantAdjustment3: Acc_Prepayment__c;
  grantAdjustment4: Acc_Prepayment__c;
  grantAdjustment5: Acc_Prepayment__c;
  grantAdjustment6: Acc_Prepayment__c;
  grantAdjustment7: Acc_Prepayment__c;
  grantAdjustment8: Acc_Prepayment__c;
  grantAdjustment9: Acc_Prepayment__c;
  grantAdjustment10: Acc_Prepayment__c;
  grantAdjustment11: Acc_Prepayment__c;
  grantAdjustment12: Acc_Prepayment__c;
};

class LoansProjectFactoryScript extends AbstractProjectFactoryScript<
  LoansProjectFactoryScriptContext,
  LoansProjectFactoryScriptArguments
> {
  async script({
    connection,
    Database,
    args,
  }: {
    connection: ITsforceConnection;
    Database: DatabaseConnector;
    args: LoansProjectFactoryScriptArguments;
  }): Promise<LoansProjectFactoryScriptContext> {
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
    competition.Acc_CompetitionName__c = "Beg, Borrow, Steal";
    competition.Acc_CompetitionType__c = args.competitionType;
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

    /**
     * Drawdowns
     */
    const grantAdjustment = new Acc_Prepayment__c();
    grantAdjustment.Acc_PeriodNumber__c = 1;
    grantAdjustment.Acc_Adjustment_Type__c = "Loan Drawdown";
    grantAdjustment.Acc_Status__c = "New";
    grantAdjustment.Loan_DrawdownStatus__c = "Planned";
    grantAdjustment.Acc_ProjectParticipant__c = mainProjectParticipant.Id;
    grantAdjustment.Acc_ReasonForPrepayment__c = "'it's just optional, you know' - Olu";
    grantAdjustment.Acc_GranttobePaid__c = 110_000;
    grantAdjustment.Loan_LatestForecastDrawdown__c = 110_000;
    grantAdjustment.Loan_InitialForecastDrawdown__c = 110_000;
    grantAdjustment.Loan_PlannedDateForDrawdown__c = new Date(date.getFullYear(), date.getMonth(), 1, 12);
    await Database.insert(grantAdjustment);

    const grantAdjustment2 = new Acc_Prepayment__c();
    grantAdjustment2.Acc_PeriodNumber__c = 2;
    grantAdjustment2.Acc_Adjustment_Type__c = "Loan Drawdown";
    grantAdjustment2.Acc_Status__c = "New";
    grantAdjustment2.Loan_DrawdownStatus__c = "Planned";
    grantAdjustment2.Acc_ProjectParticipant__c = mainProjectParticipant.Id;
    grantAdjustment2.Acc_ReasonForPrepayment__c = "'it's just optional, you know' - Olu";
    grantAdjustment2.Acc_GranttobePaid__c = 121_000;
    grantAdjustment2.Loan_LatestForecastDrawdown__c = 121_000;
    grantAdjustment2.Loan_InitialForecastDrawdown__c = 121_000;
    grantAdjustment2.Loan_PlannedDateForDrawdown__c = new Date(date.getFullYear(), date.getMonth() + 3, 1, 12);
    await Database.insert(grantAdjustment2);

    const grantAdjustment3 = new Acc_Prepayment__c();
    grantAdjustment3.Acc_PeriodNumber__c = 3;
    grantAdjustment3.Acc_Adjustment_Type__c = "Loan Drawdown";
    grantAdjustment3.Acc_Status__c = "New";
    grantAdjustment3.Loan_DrawdownStatus__c = "Planned";
    grantAdjustment3.Acc_ProjectParticipant__c = mainProjectParticipant.Id;
    grantAdjustment3.Acc_ReasonForPrepayment__c = "'it's just optional, you know' - Olu";
    grantAdjustment3.Acc_GranttobePaid__c = 132_000;
    grantAdjustment3.Loan_LatestForecastDrawdown__c = 132_000;
    grantAdjustment3.Loan_InitialForecastDrawdown__c = 132_000;
    grantAdjustment3.Loan_PlannedDateForDrawdown__c = new Date(date.getFullYear(), date.getMonth() + 6, 1, 12);
    await Database.insert(grantAdjustment3);

    const grantAdjustment4 = new Acc_Prepayment__c();
    grantAdjustment4.Acc_PeriodNumber__c = 4;
    grantAdjustment4.Acc_Adjustment_Type__c = "Loan Drawdown";
    grantAdjustment4.Acc_Status__c = "New";
    grantAdjustment4.Loan_DrawdownStatus__c = "Planned";
    grantAdjustment4.Acc_ProjectParticipant__c = mainProjectParticipant.Id;
    grantAdjustment4.Acc_ReasonForPrepayment__c = "'it's just optional, you know' - Olu";
    grantAdjustment4.Acc_GranttobePaid__c = 143_000;
    grantAdjustment4.Loan_LatestForecastDrawdown__c = 143_000;
    grantAdjustment4.Loan_InitialForecastDrawdown__c = 143_000;
    grantAdjustment4.Loan_PlannedDateForDrawdown__c = new Date(date.getFullYear(), date.getMonth() + 9, 1, 12);
    await Database.insert(grantAdjustment4);

    const grantAdjustment5 = new Acc_Prepayment__c();
    grantAdjustment5.Acc_PeriodNumber__c = 5;
    grantAdjustment5.Acc_Adjustment_Type__c = "Loan Drawdown";
    grantAdjustment5.Acc_Status__c = "New";
    grantAdjustment5.Loan_DrawdownStatus__c = "Planned";
    grantAdjustment5.Acc_ProjectParticipant__c = mainProjectParticipant.Id;
    grantAdjustment5.Acc_ReasonForPrepayment__c = "'it's just optional, you know' - Olu";
    grantAdjustment5.Acc_GranttobePaid__c = 154_000;
    grantAdjustment5.Loan_LatestForecastDrawdown__c = 154_000;
    grantAdjustment5.Loan_InitialForecastDrawdown__c = 154_000;
    grantAdjustment5.Loan_PlannedDateForDrawdown__c = new Date(date.getFullYear(), date.getMonth() + 12, 1, 12);
    await Database.insert(grantAdjustment5);

    const grantAdjustment6 = new Acc_Prepayment__c();
    grantAdjustment6.Acc_PeriodNumber__c = 6;
    grantAdjustment6.Acc_Adjustment_Type__c = "Loan Drawdown";
    grantAdjustment6.Acc_Status__c = "New";
    grantAdjustment6.Loan_DrawdownStatus__c = "Planned";
    grantAdjustment6.Acc_ProjectParticipant__c = mainProjectParticipant.Id;
    grantAdjustment6.Acc_ReasonForPrepayment__c = "'it's just optional, you know' - Olu";
    grantAdjustment6.Acc_GranttobePaid__c = 165_000;
    grantAdjustment6.Loan_LatestForecastDrawdown__c = 165_000;
    grantAdjustment6.Loan_InitialForecastDrawdown__c = 165_000;
    grantAdjustment6.Loan_PlannedDateForDrawdown__c = new Date(date.getFullYear(), date.getMonth() + 15, 1, 12);
    await Database.insert(grantAdjustment6);

    const grantAdjustment7 = new Acc_Prepayment__c();
    grantAdjustment7.Acc_PeriodNumber__c = 7;
    grantAdjustment7.Acc_Adjustment_Type__c = "Loan Drawdown";
    grantAdjustment7.Acc_Status__c = "New";
    grantAdjustment7.Loan_DrawdownStatus__c = "Planned";
    grantAdjustment7.Acc_ProjectParticipant__c = mainProjectParticipant.Id;
    grantAdjustment7.Acc_ReasonForPrepayment__c = "'it's just optional, you know' - Olu";
    grantAdjustment7.Acc_GranttobePaid__c = 176_000;
    grantAdjustment7.Loan_LatestForecastDrawdown__c = 176_000;
    grantAdjustment7.Loan_InitialForecastDrawdown__c = 176_000;
    grantAdjustment7.Loan_PlannedDateForDrawdown__c = new Date(date.getFullYear(), date.getMonth() + 18, 1, 12);
    await Database.insert(grantAdjustment7);

    const grantAdjustment8 = new Acc_Prepayment__c();
    grantAdjustment8.Acc_PeriodNumber__c = 8;
    grantAdjustment8.Acc_Adjustment_Type__c = "Loan Drawdown";
    grantAdjustment8.Acc_Status__c = "New";
    grantAdjustment8.Loan_DrawdownStatus__c = "Planned";
    grantAdjustment8.Acc_ProjectParticipant__c = mainProjectParticipant.Id;
    grantAdjustment8.Acc_ReasonForPrepayment__c = "'it's just optional, you know' - Olu";
    grantAdjustment8.Acc_GranttobePaid__c = 187_000;
    grantAdjustment8.Loan_LatestForecastDrawdown__c = 187_000;
    grantAdjustment8.Loan_InitialForecastDrawdown__c = 187_000;
    grantAdjustment8.Loan_PlannedDateForDrawdown__c = new Date(date.getFullYear(), date.getMonth() + 21, 1, 12);
    await Database.insert(grantAdjustment8);

    const grantAdjustment9 = new Acc_Prepayment__c();
    grantAdjustment9.Acc_PeriodNumber__c = 9;
    grantAdjustment9.Acc_Adjustment_Type__c = "Loan Drawdown";
    grantAdjustment9.Acc_Status__c = "New";
    grantAdjustment9.Loan_DrawdownStatus__c = "Planned";
    grantAdjustment9.Acc_ProjectParticipant__c = mainProjectParticipant.Id;
    grantAdjustment9.Acc_ReasonForPrepayment__c = "'it's just optional, you know' - Olu";
    grantAdjustment9.Acc_GranttobePaid__c = 198_000;
    grantAdjustment9.Loan_LatestForecastDrawdown__c = 198_000;
    grantAdjustment9.Loan_InitialForecastDrawdown__c = 198_000;
    grantAdjustment9.Loan_PlannedDateForDrawdown__c = new Date(date.getFullYear(), date.getMonth() + 24, 1, 12);
    await Database.insert(grantAdjustment9);

    const grantAdjustment10 = new Acc_Prepayment__c();
    grantAdjustment10.Acc_PeriodNumber__c = 10;
    grantAdjustment10.Acc_Adjustment_Type__c = "Loan Drawdown";
    grantAdjustment10.Acc_Status__c = "New";
    grantAdjustment10.Loan_DrawdownStatus__c = "Planned";
    grantAdjustment10.Acc_ProjectParticipant__c = mainProjectParticipant.Id;
    grantAdjustment10.Acc_ReasonForPrepayment__c = "'it's just optional, you know' - Olu";
    grantAdjustment10.Acc_GranttobePaid__c = 209_000;
    grantAdjustment10.Loan_LatestForecastDrawdown__c = 209_000;
    grantAdjustment10.Loan_InitialForecastDrawdown__c = 209_000;
    grantAdjustment10.Loan_PlannedDateForDrawdown__c = new Date(date.getFullYear(), date.getMonth() + 27, 1, 12);
    await Database.insert(grantAdjustment10);

    const grantAdjustment11 = new Acc_Prepayment__c();
    grantAdjustment11.Acc_PeriodNumber__c = 11;
    grantAdjustment11.Acc_Adjustment_Type__c = "Loan Drawdown";
    grantAdjustment11.Acc_Status__c = "New";
    grantAdjustment11.Loan_DrawdownStatus__c = "Planned";
    grantAdjustment11.Acc_ProjectParticipant__c = mainProjectParticipant.Id;
    grantAdjustment11.Acc_ReasonForPrepayment__c = "'it's just optional, you know' - Olu";
    grantAdjustment11.Acc_GranttobePaid__c = 220_000;
    grantAdjustment11.Loan_LatestForecastDrawdown__c = 220_000;
    grantAdjustment11.Loan_InitialForecastDrawdown__c = 220_000;
    grantAdjustment11.Loan_PlannedDateForDrawdown__c = new Date(date.getFullYear(), date.getMonth() + 30, 1, 12);
    await Database.insert(grantAdjustment11);

    const grantAdjustment12 = new Acc_Prepayment__c();
    grantAdjustment12.Acc_PeriodNumber__c = 12;
    grantAdjustment12.Acc_Adjustment_Type__c = "Loan Drawdown";
    grantAdjustment12.Acc_Status__c = "New";
    grantAdjustment12.Loan_DrawdownStatus__c = "Planned";
    grantAdjustment12.Acc_ProjectParticipant__c = mainProjectParticipant.Id;
    grantAdjustment12.Acc_ReasonForPrepayment__c = "'it's just optional, you know' - Olu";
    grantAdjustment12.Acc_GranttobePaid__c = 231_000;
    grantAdjustment12.Loan_LatestForecastDrawdown__c = 231_000;
    grantAdjustment12.Loan_InitialForecastDrawdown__c = 231_000;
    grantAdjustment12.Loan_PlannedDateForDrawdown__c = new Date(date.getFullYear(), date.getMonth() + 33, 1, 12);
    await Database.insert(grantAdjustment12);

    await connection.executeApex({
      query: `
          ProjectTriggerHelper.isFirstTime = true;
          new Acc_ProjectPeriodProcessor_Batch().start(null);
        `,
    });

    if (args.generateProfiles) {
      const [mainProfiles] = await Promise.all([
        awaitResults(() =>
          Database.query(
            `SELECT Id, RecordTypeId, Acc_CostCategoryDescription__c, Acc_CostCategory__c, Acc_ProjectPeriodNumber__c FROM Acc_Profile__c WHERE Acc_ProjectID__c = '${project.Id}' AND Acc_ProjectParticipant__c = '${mainProjectParticipant.Id}'`,
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
            costCategoryGolCost: 186_000,
            detail: [
              { latestForecastCost: 10_000 },
              { latestForecastCost: 11_000 },
              { latestForecastCost: 12_000 },
              { latestForecastCost: 13_000 },
              { latestForecastCost: 14_000 },
              { latestForecastCost: 15_000 },
              { latestForecastCost: 16_000 },
              { latestForecastCost: 17_000 },
              { latestForecastCost: 18_000 },
              { latestForecastCost: 19_000 },
              { latestForecastCost: 20_000 },
              { latestForecastCost: 21_000 },
            ],
          },
        ],
        defaultValues: {
          costCategoryGolCost: 7_800_000,
          detail: [
            { latestForecastCost: 10_000 },
            { latestForecastCost: 11_000 },
            { latestForecastCost: 12_000 },
            { latestForecastCost: 13_000 },
            { latestForecastCost: 14_000 },
            { latestForecastCost: 15_000 },
            { latestForecastCost: 16_000 },
            { latestForecastCost: 17_000 },
            { latestForecastCost: 18_000 },
            { latestForecastCost: 19_000 },
            { latestForecastCost: 20_000 },
            { latestForecastCost: 21_000 },
          ],
        },
      });

      for (const updateBatch of batch([...mainProfileUpdates])) {
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
            claimStatus: "Draft",
            claimDetails: [],
            finalClaim: false,
          },
        ],
      });
      await Database.upsert([...mainClaims.claimTotalProjectPeriods]);
      await Database.upsert([...mainClaims.claimDetails]);
      await Database.upsert([...mainClaims.claimLineItems]);
    }

    // await approveSObject(connection, grantAdjustment.Id);

    // Re-enable Trigger__mdt for normal projects
    enableClaimTrigger();
    await Database.update(triggers);
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
      grantAdjustment,
      grantAdjustment2,
      grantAdjustment3,
      grantAdjustment4,
      grantAdjustment5,
      grantAdjustment6,
      grantAdjustment7,
      grantAdjustment8,
      grantAdjustment9,
      grantAdjustment10,
      grantAdjustment11,
      grantAdjustment12,
    };
  }
}
export { LoansProjectFactoryScript, LoansProjectFactoryScriptContext, LoansProjectFactoryScriptArguments };
