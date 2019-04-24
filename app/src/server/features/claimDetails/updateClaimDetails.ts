import { CommandBase } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { ISalesforceClaimDetails } from "@server/repositories/claimDetailsRepository";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";

export class UpdateClaimDetailsCommand extends CommandBase<boolean> {
  constructor(
    private readonly projectId: string,
    private readonly partnerId: string,
    private readonly claimDetailsDto: ClaimDetailsDto
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  protected async Run(context: IContext) {
    const update: Updatable<ISalesforceClaimDetails> = {
      Id: this.claimDetailsDto.id,
      Acc_ReasonForDifference__c: this.claimDetailsDto.comments
    };

    return context.repositories.claimDetails.update(update);
  }

}
