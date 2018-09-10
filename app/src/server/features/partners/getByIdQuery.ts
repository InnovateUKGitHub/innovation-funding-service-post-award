import { IContext, IQuery } from "../common/context";
import {PartnerDto} from "../../../ui/models";

export class GetByIdQuery implements IQuery<PartnerDto|null> {
  constructor(readonly id: string) {}

  async Run(context: IContext) {
      const result = await context.repositories.partners.getById(this.id);
      return result && {
          id: result.Id,
          name: result.Acc_AccountId__r.Name,
          accountId: result.Acc_AccountId__r.Id,
          type: result.Acc_ParticipantType__c,
          isLead: result.Acc_ProjectRole__c === "Project Lead",
          projectId: result.Acc_ProjectId__c
      } as PartnerDto;
  }
}
