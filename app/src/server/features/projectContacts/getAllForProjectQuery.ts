import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { IContext } from "@framework/types/IContext";
import { ISalesforceProjectContact } from "../../repositories/projectContactsRepository";
import { QueryBase } from "../common/queryBase";

export class GetAllForProjectQuery extends QueryBase<ProjectContactDto[]> {
  constructor(private readonly projectId: ProjectId) {
    super();
  }

  protected async run(context: IContext) {
    const results = await context.repositories.projectContacts.getAllByProjectId(this.projectId);
    return results.map(this.map);
  }

  private map(x: ISalesforceProjectContact): ProjectContactDto {
    const externalUserName = x.Acc_ContactId__r && x.Acc_ContactId__r.Name;
    const internalUserName = x.Acc_UserId__r && x.Acc_UserId__r.Name;

    // Note: Derive external contact over internal where possible
    const name = externalUserName || internalUserName || "";

    return {
      id: x.Id,
      name,
      role: x.Acc_Role__c,
      roleName: x.RoleName,
      email: x.Acc_EmailOfSFContact__c,
      accountId: x.Acc_AccountId__c,
      projectId: x.Acc_ProjectId__c as ProjectId,
    };
  }
}
