import { getCertificateEnv as certEnv, getStringEnv as strEnv } from "@innovateuk/common/envHelpers";
import { TsforceConnection } from "@innovateuk/tsforce/TsforceConnection";
import { getSalesforceAccessToken } from "@innovateuk/tsforce/TsforceToken";
import { DatabaseConnector } from "../database/DatabaseConnector";
import { Competition__c } from "../sobjects/Competition__c";
import { Account } from "../sobjects/Account";
import { Contact } from "../sobjects/Contact";
import { User } from "../sobjects/User";
import { Acc_Project__c } from "../sobjects/Acc_Project__c";
import { Acc_ProjectContactLink__c } from "../sobjects/Acc_ProjectContactLink__c";
import { Acc_ProjectParticipant__c } from "../sobjects/Acc_ProjectParticipant__c";
import { AbstractProjectFactoryScript } from "./AbstractProjectFactoryScript";
import { ITsforceConnection } from "@innovateuk/tsforce/index";

class BaseCrndProjectScript extends AbstractProjectFactoryScript {
  async script({
    connection,
    Database,
  }: {
    connection: ITsforceConnection;
    Database: DatabaseConnector;
  }): Promise<void> {
    const date = new Date();
    const now = Math.floor(date.getTime() / 1000);
    const prefix = (val: string) => `${now}.${val}`;

    const competition = new Competition__c();
    competition.Acc_CompetitionCode__c = prefix("000");
    competition.Acc_CompetitionName__c = "High-carbon inefficient motorways";
    competition.Acc_CompetitionType__c = "CR&D";
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

    const ppAccount = new Account();
    ppAccount.BillingStreet = "North Star Avenue";
    ppAccount.BillingCity = "Swindon";
    ppAccount.BillingState = "Wiltshire";
    ppAccount.BillingPostalCode = "SN2 1SZ";
    ppAccount.BillingCountry = "United Kingdom";
    ppAccount.OrgMigrationId__c = prefix("301");
    ppAccount.Name = "Hedge's Monitoring Ltd.";

    await Database.insert([mspAccount, ppAccount]);

    const projectParticipant = new Acc_ProjectParticipant__c();
    projectParticipant.Acc_AccountId__c = ppAccount.Id;
    projectParticipant.Acc_ProjectId__c = project.Id;
    projectParticipant.ParticipantMigrationID__c = prefix("200");
    projectParticipant.Acc_ParticipantType__c = "Business";
    projectParticipant.Acc_ParticipantSize__c = "Medium";
    projectParticipant.Acc_ProjectRole__c = "Lead";
    projectParticipant.Acc_AuditReportFrequency__c = "With all claims";
    projectParticipant.Acc_ParticipantStatus__c = "Active";
    projectParticipant.Acc_Award_Rate__c = 50;
    projectParticipant.Acc_Cap_Limit__c = 50;
    projectParticipant.Acc_FlaggedParticipant__c = false;
    projectParticipant.Acc_OverheadRate__c = 20;
    projectParticipant.Acc_ParticipantProjectReportingType__c = "Public";
    projectParticipant.Acc_OrganisationType__c = "Industrial";
    projectParticipant.Acc_CreateProfiles__c = false;
    projectParticipant.Acc_CreateClaims__c = true;

    await Database.insert(projectParticipant);

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
    pmContact.AccountId = ppAccount.Id;

    const fcContact = new Contact();
    fcContact.ContactMigrationId__c = prefix("402");
    fcContact.Email = prefix("fc@x.gov.uk");
    fcContact.FirstName = "Finance";
    fcContact.LastName = "Contact";
    fcContact.AccountId = ppAccount.Id;

    await Database.insert([mspContact, pmContact, fcContact]);

    const mspUser = User.fromContact(mspContact);
    mspUser.boilerplate();
    mspUser.Alias = "msp";
    mspUser.CommunityNickname = prefix("msp");

    const pmUser = User.fromContact(pmContact);
    pmUser.boilerplate();
    pmUser.Alias = "pm";
    pmUser.CommunityNickname = prefix("pm");

    const fcUser = User.fromContact(fcContact);
    fcUser.boilerplate();
    fcUser.Alias = "fc";
    fcUser.CommunityNickname = prefix("fc");

    await Database.insert([mspUser, pmUser, fcUser]);

    const mspPcl = new Acc_ProjectContactLink__c();
    mspPcl.Acc_AccountId__c = mspAccount.Id;
    mspPcl.Acc_ContactId__c = mspContact.Id;
    mspPcl.Acc_ProjectId__c = project.Id;
    mspPcl.Acc_UserId__c = mspUser.Id;
    mspPcl.Acc_EmailOfSFContact__c = mspContact.Email;
    mspPcl.Acc_Role__c = "Project Manager";

    const pmPcl = new Acc_ProjectContactLink__c();
    pmPcl.Acc_AccountId__c = ppAccount.Id;
    pmPcl.Acc_ContactId__c = pmContact.Id;
    pmPcl.Acc_ProjectId__c = project.Id;
    pmPcl.Acc_UserId__c = pmUser.Id;
    pmPcl.Acc_EmailOfSFContact__c = pmContact.Email;
    pmPcl.Acc_Role__c = "Project Manager";

    const fcPcl = new Acc_ProjectContactLink__c();
    fcPcl.Acc_AccountId__c = ppAccount.Id;
    fcPcl.Acc_ContactId__c = fcContact.Id;
    fcPcl.Acc_ProjectId__c = project.Id;
    fcPcl.Acc_UserId__c = fcUser.Id;
    fcPcl.Acc_EmailOfSFContact__c = fcContact.Email;
    fcPcl.Acc_Role__c = "Finance contact";

    await Database.insert([mspPcl, pmPcl, fcPcl]);

    project.Acc_ClaimFrequency__c = "Quarterly";
    project.Acc_NonFEC__c = false;
    project.Acc_MonitoringLevel__c = "Platinum";
    project.Acc_MonitoringReportSchedule__c = "Monthly";
    project.Acc_ProjectStatus__c = "Live";
    project.Acc_CurrentPeriodNumberHelper__c = 1;

    await Database.update(project);

    await connection.executeSOQL({
      query: `
        ProjectTriggerHelper.isFirstTime = true;
        new Acc_ProjectPeriodProcessor_Batch().start(null);
      `,
    });
  }
}

export { BaseCrndProjectScript };
