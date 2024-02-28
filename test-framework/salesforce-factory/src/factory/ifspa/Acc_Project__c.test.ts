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
  .new()
  .setField("Acc_CompetitionCode__c", "100")
  .setField("Acc_CompetitionName__c", "Competition")
  .setField("Acc_CompetitionType__c", "KTP");

const account = accountBuilder
  .new()
  .setField("OrgMigrationId__c", "001")
  .setField("Name", "xgov")
  .setField("BillingStreet", "North Star Avenue")
  .setField("BillingCity", "Swindon")
  .setField("BillingState", "Wiltshire")
  .setField("BillingPostalCode", "SN2 1SZ")
  .setField("BillingCountry", "United Kingdom");

const project = accProjectBuilder
  .new()
  .setRelationship("Acc_CompetitionId__c", competition)
  .setField("Acc_StartDate__c", new Date("2024-01-16 12:59:42"))
  .setField("Acc_Duration__c", 36)
  .setField("Acc_ClaimFrequency__c", "Quarterly")
  .setField("Acc_ProjectTitle__c", "Title")
  .setField("Acc_ProjectNumber__c", "100")
  .setField("Acc_LegacyID__c", "100")
  .setField("Acc_WorkdayProjectSetupComplete__c", true)
  .setField("Acc_NonFEC__c", false)
  .setField("Acc_MonitoringLevel__c", "Platinum")
  .setField("Acc_MonitoringReportSchedule__c", "Monthly")
  .setField("Acc_ProjectStatus__c", "Live");

const contact = contactBuilder
  .new()
  .setRelationship("AccountId", account)
  .setField("ContactMigrationId__c", "001")
  .setField("Email", "austria@x.gov.uk")
  .setField("FirstName", "Austria")
  .setField("LastName", "Hedges");

const user = userBuilder
  .new()
  .setRelationship("ContactId", contact)
  .setField("Username", "austria@x.gov.uk")
  .setField("Email", "austria@x.gov.uk")
  .setField("FirstName", "Austria")
  .setField("LastName", "Hedges")
  .setField("Alias", "xgovuk")
  .setField("CommunityNickname", "austria")
  .setField("EmailEncodingKey", "UTF-8")
  .setField("LocaleSidKey", "en_GB")
  .setField("LanguageLocaleKey", "en_US")
  .setField("TimeZoneSidKey", "Europe/London")
  .setField("ProfileId", "00e58000001ITpLAAW");

const projectContactLink = accProjectContactLinkBuilder
  .new()
  .setRelationship("Acc_AccountId__c", account)
  .setRelationship("Acc_ContactId__c", contact)
  .setRelationship("Acc_ProjectId__c", project)
  .setField("Acc_EmailOfSFContact__c", "noemail@noemail.com")
  .setField("Acc_Role__c", "Monitoring officer");

const projectParticipant = accProjectParticipantBuilder
  .new()
  .setRelationship("Acc_AccountId__c", account)
  .setRelationship("Acc_ProjectId__c", project)
  .setField("ParticipantMigrationID__c", "004001")
  .setField("Acc_ParticipantType__c", "Business")
  .setField("Acc_ParticipantSize__c", "Medium")
  .setField("Acc_ProjectRole__c", "Lead")
  .setField("Acc_AuditReportFrequency__c", "With all claims")
  .setField("Acc_ParticipantStatus__c", "Active")
  .setField("Acc_Award_Rate__c", 50)
  .setField("Acc_Cap_Limit__c", 50)
  .setField("Acc_FlaggedParticipant__c", false)
  .setField("Acc_OverheadRate__c", 20)
  .setField("Acc_ParticipantProjectReportingType__c", "Public")
  .setField("Acc_OrganisationType__c", "Industrial")
  .setField("Acc_CreateProfiles__c", false)
  .setField("Acc_CreateClaims__c", false);

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
