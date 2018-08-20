import { IQuery, IContext } from "../common/context";
import { PartnerDto } from "../../../models/PartnerDto";

export class GetAllForProjectQuery implements IQuery<PartnerDto[]>{
    
    constructor(private projectId: string){
    }
    
    public async Run(context:IContext) {
        const results = await context.repositories.partners.getAllByProjectId(this.projectId);
        return results.map(x => ({
            id: x.Id,
            name: x.ParticipantName__c,
            type: x.ParticipantType__c,
            isLead: x.ProjectRole__c === "Lead"
         } as PartnerDto));
    }
}