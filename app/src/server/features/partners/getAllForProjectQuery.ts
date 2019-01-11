import { IContext, QueryBase } from "../common/context";
import { MapToPartnerDtoCommand } from "./mapToPartnerDto";
import { PartnerDto, ProjectRole } from "../../../types";
import { GetAllProjectRolesForUser, getEmptyRoleInfo } from "../projects/getAllProjectRolesForUser";

export class GetAllForProjectQuery extends QueryBase<PartnerDto[]> {
    constructor(private projectId: string) {
        super();
    }

    protected async Run(context: IContext) {
        const results = await context.repositories.partners.getAllByProjectId(this.projectId);
        const roles = await context.runQuery(new GetAllProjectRolesForUser());

        const mapped = await Promise.all(results.map(item => {
            const roleInfo = roles[item.Acc_ProjectId__c] || getEmptyRoleInfo();
            const partnerRoles = roleInfo.partnerRoles[item.Acc_AccountId__r.Id] || ProjectRole.Unknown;
            return context.runCommand(new MapToPartnerDtoCommand(item, partnerRoles));
        }));

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
