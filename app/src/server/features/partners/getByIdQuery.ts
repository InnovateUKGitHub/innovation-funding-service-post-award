import { IContext, QueryBase } from "../common/context";
import {MapToPartnerDtoCommand} from "./mapToPartnerDto";

export class GetByIdQuery extends QueryBase<PartnerDto|null> {
  constructor(readonly id: string) {
    super();
  }

  async Run(context: IContext) {
      const result = await context.repositories.partners.getById(this.id);
      return result && await context.runCommand(new MapToPartnerDtoCommand(result));
  }
}
