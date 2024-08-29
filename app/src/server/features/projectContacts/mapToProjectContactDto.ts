import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { Clock } from "@framework/util/clock";
import { ISalesforceProjectContact } from "@server/repositories/projectContactsRepository";

const clock = new Clock();

const mapToProjectContactDto = (x: ISalesforceProjectContact): ProjectContactDto => {
  const externalUserName = x.Acc_ContactId__r && x.Acc_ContactId__r.Name;
  const externalUserFirstName = x.Acc_ContactId__r && x.Acc_ContactId__r.FirstName;
  const externalUserLastName = x.Acc_ContactId__r && x.Acc_ContactId__r.LastName;
  const internalUserName = x.Acc_UserId__r && x.Acc_UserId__r.Name;
  const internalFirstName = x.Acc_UserId__r && x.Acc_UserId__r.FirstName;
  const internalLastName = x.Acc_UserId__r && x.Acc_UserId__r.LastName;

  // Note: Derive external contact over internal where possible
  const name = externalUserName || internalUserName || "";
  const firstName = externalUserFirstName || internalFirstName || "";
  const lastName = externalUserLastName || internalLastName || "";

  return {
    id: x.Id,
    name,
    role: x.Acc_Role__c,
    roleName: x.RoleName,
    email: x.Acc_EmailOfSFContact__c,
    contactId: x.Acc_ContactId__r.Id as ContactId,
    accountId: x.Acc_AccountId__c,
    projectId: x.Acc_ProjectId__c as ProjectId,
    startDate: clock.parseOptionalSalesforceDateTime(x.Acc_StartDate__c),
    endDate: clock.parseOptionalSalesforceDateTime(x.Acc_EndDate__c),
    associateStartDate: clock.parseOptionalSalesforceDateTime(x.Associate_Start_Date__c),
    firstName,
    lastName,
  };
};

export { mapToProjectContactDto };
