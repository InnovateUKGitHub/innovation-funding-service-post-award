import { DeveloperUser } from "@framework/dtos/developerUser";
import { IContext } from "@framework/types";
import { ISalesforceProjectContact } from "../../repositories/projectContactsRepository";
import { QueryBase } from "../common";

export class GetAllUsersForProjectQuery extends QueryBase<DeveloperUser[]> {
  constructor(private readonly projectId: string) {
    super();
  }

  protected async run(context: IContext) {
    const results = await context.repositories.projectContacts.getAllByProjectId(this.projectId);
    return results.map(this.map);
  }

  private map(x: ISalesforceProjectContact): DeveloperUser {
    const externalUserName = x.Acc_ContactId__r && x.Acc_ContactId__r.Name;
    const internalUserName = x.Acc_UserId__r && x.Acc_UserId__r.Name;

    // Note: Derive external contact over internal where possible
    const name = externalUserName || internalUserName || "";

    return {
      name,
      role: x.Acc_Role__c,
      email: x.Acc_EmailOfSFContact__c,
      externalUsername: x.Acc_ContactId__r.Email,
      internalUsername: x.Acc_UserId__r?.Username,
    };
  }
}
