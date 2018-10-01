import {ICommand, IContext} from "../common/context";
import {ClaimDto} from "../../../ui/models";
import {UpdateDto} from "../../../ui/models/updateDto";

export class UpdateClaimCommand implements ICommand<UpdateDto> {
  constructor(private claimDto: ClaimDto) {}

  public async Run(context: IContext) {
    // TODO add to as needed
    const update = {
      Id: this.claimDto.id,
      Acc_ClaimStatus__c: this.claimDto.status,
      Acc_LineItemDescription__c: this.claimDto.comments,
    };
    return await context.repositories.claims.update(update).then(success => ({ success }));
  }
}
