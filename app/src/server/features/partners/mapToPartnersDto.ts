import { IContext, QueryBase } from "../common/context";
import { MapToPartnerDtoCommand } from "./mapToPartnerDto";
import {ISalesforcePartner} from "../../repositories/partnersRepository";

export class MapToPartnersDtoCommand extends QueryBase<PartnerDto[]> {
    constructor(readonly items: ISalesforcePartner[]) {
        super();
    }

    async Run(context: IContext) {
        const partnerDtos = this.items.map((item) => {
            return new MapToPartnerDtoCommand(item).Run(context);
        });

        return Promise.all(partnerDtos);
    }
}
