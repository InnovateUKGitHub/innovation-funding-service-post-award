import { IQuery, IContext } from "../common/context";
import { ProjectContactDto } from "../../../models/projectContactDto";

export class GetAllForProjectQuery implements IQuery<ProjectContactDto[]>{
    
    constructor(private projectId: string){
    }
    
    public async Run(context:IContext) {
        const results = await context.repositories.projectContacts.getAllByProjectId(this.projectId);
        return results.map<ProjectContactDto>(x => ({
            id: x.Id,
            name: x.Name,
            role: x.Role__c,
            email: x.EmailOfSFContact__c,
            organisationId: x.AccountId
         }));
    }
}