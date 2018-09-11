import { IContext, IQuery } from "../common/context";
import {PartnerDto} from "../../../ui/models";
import {MapToPartnerDtoCommand} from "./mapToPartnerDto";

export class GetByIdQuery implements IQuery<PartnerDto|null> {
  constructor(readonly id: string) {}

  async Run(context: IContext) {
      const result = await context.repositories.partners.getById(this.id);
      return result && await context.runCommand(new MapToPartnerDtoCommand(result));
  }
}
