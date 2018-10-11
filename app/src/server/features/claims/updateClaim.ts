import {ICommand, IContext} from "../common/context";
import {ClaimDto} from "../../../ui/models";

export class UpdateClaimCommand implements ICommand<boolean> {
  constructor(private claimDto: ClaimDto) {}

  public async Run(context: IContext) {
    // TODO add to as needed
    const update = {
      Id: this.claimDto.id,
      Acc_ClaimStatus__c: this.claimDto.status,
      Acc_LineItemDescription__c: this.claimDto.comments,
    };
    return await context.repositories.claims.updateOne(update);
  }
}
