import { IContext, PartnerDto } from "@framework/types";
import { QueryBase } from "../common";
import { GetAllProjectRolesForUser } from "../projects/getAllProjectRolesForUser";
import { MapToPartnerDtoCommand } from "./mapToPartnerDto";
import { sortPartners } from "./sortPartners";

export class GetAllForProjectQuery extends QueryBase<PartnerDto[]> {
    constructor(private readonly projectId: string) {
        super();
    }

    protected async run(context: IContext) {
        const results = await context.repositories.partners.getAllByProjectId(this.projectId);
        const roles = await context.runQuery(new GetAllProjectRolesForUser());
        const projectRoles = roles.forProject(this.projectId).getRoles();

        const mapped = results.map(item => {
            const partnerRoles = roles.forPartner(item.projectId, item.id).getRoles();
            return context.runSyncCommand(new MapToPartnerDtoCommand(item, partnerRoles, projectRoles));
        });

        return mapped.sort(sortPartners);
    }
}
