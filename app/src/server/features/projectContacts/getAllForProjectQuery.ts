import { IContext, IQuery } from "../common/context";
import { ProjectContactDto } from "../../../models/projectContactDto";
import { ISalesforceProjectContact } from "../../repositories/projectContactsRepository";

export class GetAllForProjectQuery implements IQuery<ProjectContactDto[]> {
    constructor(private projectId: string) {
    }

    public async Run(context: IContext) {
        const results = await context.repositories.projectContacts.getAllByProjectId(this.projectId);
        return results.map(this.map);
    }

    private map(x: ISalesforceProjectContact): ProjectContactDto {
        return ({
            id: x.Id,
            name: x.Acc_ContactId__r.Name,
            role: x.Acc_Role__c,
            email: x.Acc_EmailOfSFContact__c,
            accountId: x.Acc_AccountId__c,
            projectId: x.Acc_ProjectId__c
        });
    }
}
