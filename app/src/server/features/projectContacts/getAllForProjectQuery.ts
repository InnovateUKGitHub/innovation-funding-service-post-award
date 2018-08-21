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

    private map(x: ISalesforceProjectContact) : ProjectContactDto{
        return ({
            id: x.Id,
            name: x.Name,
            role: x.Role__c,
            email: x.EmailOfSFContact__c,
            partnerId: x.AccountId
        });
    }
}
