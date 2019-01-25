import { QueryBase } from "../common/queryBase";
import { MapToPartnerDtoCommand } from "./mapToPartnerDto";
import { PartnerDto } from "../../../types";
import { GetAllProjectRolesForUser } from "../projects/getAllProjectRolesForUser";
import { IContext } from "../../../types/IContext";

export class GetAllForProjectQuery extends QueryBase<PartnerDto[]> {
    constructor(private projectId: string) {
        super();
    }

    protected async Run(context: IContext) {
        const results = await context.repositories.partners.getAllByProjectId(this.projectId);
        const roles = await context.runQuery(new GetAllProjectRolesForUser());
        const projectRoles = roles.getProjectRoles(this.projectId);

        const mapped = results.map(item => {
            const partnerRoles = roles.getPartnerRoles(item.Acc_ProjectId__c, item.Id);
            return context.runSyncCommand(new MapToPartnerDtoCommand(item, partnerRoles, projectRoles));
        });

        return mapped.sort((x, y) => {
            // if x is not lead but y is lead then y is bigger
            if (!x.isLead && !!y.isLead) {
                return 1;
            }
            // if x is lead but y is not lead then x is bigger
            if (!!x.isLead && !y.isLead) {
                return -1;
            }

            // both same so sort by name
            if (x.name && y.name) {
                return x.name.localeCompare(y.name);
            }
            else if (x.name) {
                return -1;
            }
            else if (y.name) {
                return 1;
            }
            return 0;
        });
    }
}
