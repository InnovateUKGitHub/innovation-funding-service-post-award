import { describe, expect, test } from "@jest/globals";
import { competitionBuilder } from "./Competition__c";
import { accProjectBuilder } from "./Acc_Project__c";
import { buildApex } from "../../helpers/apex";
import { accountBuilder } from "./Account";
import { userBuilder } from "./User";
import { contactBuilder } from "./Contact";
import { accProjectContactLinkBuilder } from "./Acc_ProjectContactLink__c";
import { accProjectParticipantBuilder } from "./Acc_ProjectParticipant__c";

const competition = competitionBuilder
  .create()
  .set({ Acc_CompetitionCode__c: "100", Acc_CompetitionName__c: "Competition", Acc_CompetitionType__c: "KTP" });

const account = accountBuilder.create().set({
  OrgMigrationId__c: "001",
  Name: "xgov",
  BillingStreet: "North Star Avenue",
  BillingCity: "Swindon",
  BillingState: "Wiltshire",
  BillingPostalCode: "SN2 1SZ",
  BillingCountry: "United Kingdom",
});

const project = accProjectBuilder.create().set({
  Acc_StartDate__c: new Date("2024-01-16 12:59:42"),
  Acc_Duration__c: 36,
  Acc_ClaimFrequency__c: "Quarterly",
  Acc_ProjectTitle__c: "Title",
  Acc_ProjectNumber__c: "100",
  Acc_LegacyID__c: "100",
  Acc_WorkdayProjectSetupComplete__c: true,
  Acc_NonFEC__c: false,
  Acc_MonitoringLevel__c: "Platinum",
  Acc_MonitoringReportSchedule__c: "Monthly",
  Acc_ProjectStatus__c: "Live",
  Acc_CompetitionId__c: competition,
});

const contact = contactBuilder.create().set({
  AccountId: account,
  ContactMigrationId__c: "001",
  Email: "austria@x.gov.uk",
  FirstName: "Austria",
  LastName: "Hedges",
});

const user = userBuilder.create().set({
  ContactId: contact,
  Username: "austria@x.gov.uk",
  Email: "austria@x.gov.uk",
  FirstName: "Austria",
  LastName: "Hedges",
  Alias: "xgovuk",
  CommunityNickname: "austria",
  EmailEncodingKey: "UTF-8",
  LocaleSidKey: "en_GB",
  LanguageLocaleKey: "en_US",
  TimeZoneSidKey: "Europe/London",
  ProfileId: "00e58000001ITpLAAW",
});

const projectContactLink = accProjectContactLinkBuilder.create().set({
  Acc_AccountId__c: account,
  Acc_ContactId__c: contact,
  Acc_ProjectId__c: project,
  Acc_EmailOfSFContact__c: "noemail@noemail.com",
  Acc_Role__c: "Monitoring officer",
});

const projectParticipant = accProjectParticipantBuilder.create().set({
  Acc_AccountId__c: account,
  Acc_ProjectId__c: project,
  ParticipantMigrationID__c: "004001",
  Acc_ParticipantType__c: "Business",
  Acc_ParticipantSize__c: "Medium",
  Acc_ProjectRole__c: "Lead",
  Acc_AuditReportFrequency__c: "With all claims",
  Acc_ParticipantStatus__c: "Active",
  Acc_Award_Rate__c: 50,
  Acc_Cap_Limit__c: 50,
  Acc_FlaggedParticipant__c: false,
  Acc_OverheadRate__c: 20,
  Acc_ParticipantProjectReportingType__c: "Public",
  Acc_OrganisationType__c: "Industrial",
  Acc_CreateProfiles__c: false,
  Acc_CreateClaims__c: false,
});

describe("Project Builder", () => {
  test("Expect project to be built, linking correctly to competition", () => {
    const code = buildApex({ instances: [project, competition] });
    expect(code).toMatchSnapshot();
  });

  test("Expect everything to be harmonious", () => {
    const code = buildApex({
      instances: [project, competition, account, contact, user, projectContactLink, projectParticipant],
    });
    expect(code).toMatchSnapshot();
  });

  test("Expect everything to be harmonious with a prefix", () => {
    const code = buildApex({
      instances: [project, competition, account, contact, user, projectContactLink, projectParticipant],
      options: { prefix: "hello." },
    });
    expect(code).toMatchSnapshot();
  });
});
