import { IContext, IQuery } from "../common/context";
import { MapToPartnerDtoCommand } from "./mapToPartnerDto";
import {ISalesforcePartner} from "../../repositories/partnersRepository";

export class MapToPartnersDtoCommand implements IQuery<PartnerDto[]> {
    constructor(readonly items: ISalesforcePartner[]) {}

    async Run(context: IContext) {
        const partnerDtos = this.items.map((item) => {
            return new MapToPartnerDtoCommand(item).Run(context);
        });

        return Promise.all(partnerDtos);
    }
}
