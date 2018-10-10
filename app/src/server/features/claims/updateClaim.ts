import { ICommand, IContext } from "../common/context";
import { ClaimDto } from "../../../ui/models";
import { ClaimDtoValidator } from "../../../ui/validators/claimDtoValidator";
import { Results } from "../../../ui/validation/results";

export class ValidationError extends Error {
  constructor(public readonly validaionResult: Results<{}>) {
    super();
  }
}

export class UpdateClaimCommand implements ICommand<boolean> {
  constructor(private claimDto: ClaimDto) { }

  public async Run(context: IContext) {
    const result = new ClaimDtoValidator(this.claimDto, true);

    if (!result.isValid()) {
      throw new ValidationError(result);
    }

    const update = {
      Id: this.claimDto.id,
      Acc_ClaimStatus__c: this.claimDto.status,
      Acc_LineItemDescription__c: this.claimDto.comments,
    };

    return await context.repositories.claims.update(update);
  }
}
