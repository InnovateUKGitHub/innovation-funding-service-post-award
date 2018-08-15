import { IQuery, IContext } from "../common/context";
import { PartnerDto } from "../../../models/partnerDto";

export class GetAllForProjectQuery implements IQuery<PartnerDto[]>{
    
    constructor(private projectId: string){
    }
    
    public async Run(context:IContext) {
        const results = await context.repositories.partners.getAllByProjectId(this.projectId);
        return results.map(x => ({
            id: x.Id,
            name: x.ParticipantName__c,
            type: x.ParticipantType__c,
         } as PartnerDto));
    }
}