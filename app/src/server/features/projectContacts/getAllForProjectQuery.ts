import { QueryBase } from "../common";
import { ISalesforceProjectContact } from "../../repositories/projectContactsRepository";
import { IContext } from "@framework/types";

export class GetAllForProjectQuery extends QueryBase<ProjectContactDto[]> {
    constructor(private readonly projectId: string) {
        super();
    }

    protected async Run(context: IContext) {
        const results = await context.repositories.projectContacts.getAllByProjectId(this.projectId);
        return results.map(this.map);
    }

    private map(x: ISalesforceProjectContact): ProjectContactDto {
        return ({
            id: x.Id,
            name: x.Acc_ContactId__r.Name,
            role: x.Acc_Role__c,
            roleName: x.RoleName,
            email: x.Acc_EmailOfSFContact__c,
            accountId: x.Acc_AccountId__c,
            projectId: x.Acc_ProjectId__c
        });
    }
}
