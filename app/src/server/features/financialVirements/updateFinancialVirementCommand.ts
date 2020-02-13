// tslint:disable:complexity
import { CommandBase } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { flatten } from "@framework/util/arrayHelpers";
import { ISalesforceFinancialVirement } from "@server/repositories";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { CostCategoryFinancialVirement } from "@framework/entities";

export class UpdateFinancialVirementCommand extends CommandBase<boolean> {
  constructor(private readonly projectId: string, private readonly pcrId: string, private readonly pcrItemId: string, private readonly data: FinancialVirementDto) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager);
  }

  protected async Run(context: IContext): Promise<boolean> {

    const existingVirements = await context.repositories.financialVirements.getAllForPcr(this.pcrItemId);

    const updates: Updatable<ISalesforceFinancialVirement>[] = [];
    const flattenedData = flatten(this.data.partners.map(partner => partner.virements.map(virement => ({ partnerId: partner.partnerId, costCategoryId: virement.costCategoryId, virement }))));

    existingVirements.forEach(partner => {
      partner.virements.forEach(virement => {
        const dataItem = flattenedData.find(x => x.partnerId === partner.partnerId && x.costCategoryId === virement.costCategoryId);
        if (dataItem) {
          const update = this.getUpdate(virement, dataItem.virement);
          if (update) {
            updates.push(update);
          }
        }
      });
    });

    if (updates.length) {
      await context.repositories.financialVirements.updateVirements(updates);
    }

    return true;
  }

  private getUpdate(original: CostCategoryFinancialVirement, dto: VirementDto): Updatable<ISalesforceFinancialVirement> | null {
    let isUpdated = false;

    const update: Updatable<ISalesforceFinancialVirement> = {
      Id: original.id,
      Acc_Profile__c: original.profileId
    };

    if (original.newCosts !== dto.newEligibleCosts) {
      isUpdated = true;
      update.Acc_NewCosts__c = dto.newEligibleCosts;
    }

    return isUpdated ? update : null;
  }
}
