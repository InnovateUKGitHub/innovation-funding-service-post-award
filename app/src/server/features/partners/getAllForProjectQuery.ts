import { IContext, IQuery } from "../common/context";
import { PartnerDto } from "../../../ui/models/partnerDto";
import { MapToPartnersDtoCommand } from "./mapToPartnersDto";

export class GetAllForProjectQuery implements IQuery<PartnerDto[]> {
    constructor(private projectId: string) {
    }

    public async Run(context: IContext) {
        const results = await context.repositories.partners.getAllByProjectId(this.projectId);
        const mapped = await context.runCommand(new MapToPartnersDtoCommand(results));

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
