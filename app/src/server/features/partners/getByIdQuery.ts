import { IContext, IQuery } from "../common/context";
import {PartnerDto} from "../../../ui/models";
import {MapToPartnerDtoCommand} from "./mapToPartnerDto";

export class GetByIdQuery implements IQuery<PartnerDto|null> {
  constructor(readonly id: string) {}

  async Run(context: IContext) {
      const result = await context.repositories.partners.getById(this.id);
      // return result && await context.runCommand(new MapToPartnerDtoCommand(result));
      // TODO remove below stub data
      if (result === null) {
          return null;
      }
      return await context.runCommand(new MapToPartnerDtoCommand({
          ...result,
          Acc_TotalParticipantGrant__c: 100000,
          Acc_TotalParticipantCosts__c: 50000,
          Acc_TotalParticipantCostsPaid__c: 30000,
          Acc_PercentageParticipantCosts__c: 50,
          Acc_CapLimit__c: 85,
          Acc_AwardRate__c: 50,
      }));
  }
}
