import { accProjectContactLinkBuilder, contactBuilder, makeBaseProject } from "@innovateuk/project-factory";
import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";
import { defaultUser } from "@innovateuk/project-factory/dist/factory/ifspa/User";

export
@Fixture("accProjectKTP")
class AccProjectKTP extends ProjectFactory {
  getProject() {
    const data = makeBaseProject();

    const [[asContact, asUser, asPcl, asAccount]] = (<const>[
      ["3", data.logins[1].account, "associate@x.gov.uk", "Anna", "Sociate", "as", "Associate"],
      ["4", data.logins[1].account, "kbadmin@x.gov.uk", "Kristoff", "Baseman", "kb", "KB Admin"],
      ["5", data.logins[1].account, "maincontact@x.gov.uk", "Mary", "Cabrera", "mc", "Main Company Contact"],
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
        Acc_ProjectId__c: data.project,
        Acc_EmailOfSFContact__c: Email,
        Acc_Role__c: Acc_Role__c,
      });

      return [contact, user, pcl, account];
    });

    data.competition.set({ Acc_CompetitionType__c: "KTP" });
    data.logins.push({
      pcl: asPcl,
      user: asUser,
      contact: asContact,
      account: asAccount,
    });
    return data;
  }

  @Given("a standard KTP project exists")
  async create() {
    await this.createProject();
  }
}
