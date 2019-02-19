import { QueryBase } from "../common";
import { MapToPartnerDtoCommand } from "./mapToPartnerDto";
import { GetAllProjectRolesForUser } from "../projects/getAllProjectRolesForUser";
import { IContext, PartnerDto } from "../../../types";
import { sortPartners } from "./sortPartners";

export class GetAllForProjectQuery extends QueryBase<PartnerDto[]> {
    constructor(private readonly projectId: string) {
        super();
    }

    protected async Run(context: IContext) {
        const results = await context.repositories.partners.getAllByProjectId(this.projectId);
        const roles = await context.runQuery(new GetAllProjectRolesForUser());
        const projectRoles = roles.for(this.projectId).getRoles();

        const mapped = results.map(item => {
            const partnerRoles = roles.for(item.Acc_ProjectId__c, item.Id).getRoles();
            return context.runSyncCommand(new MapToPartnerDtoCommand(item, partnerRoles, projectRoles));
        });

        return mapped.sort(sortPartners);
    }
}
